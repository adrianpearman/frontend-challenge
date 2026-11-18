import { useQuery } from "@tanstack/react-query";
import {
  LoadingOverviewItem,
  OverviewItem,
  OverviewItemsContainer,
} from "@/components/base";
import { createFetchMonthlyExpenses } from "@/utils/api/requests";
import { cn, formatCurrency, formatDate, shiftMonth } from "@/utils/functions";
import type { CategoryTotals, CurrencyCode } from "@/utils/types";

type ExpensesOverviewProps = {
  currency?: CurrencyCode;
  currentMonth: string;
  earliestMonth?: string;
  selectedAccount: string;
};

export const ExpensesOverview = ({
  currency,
  currentMonth,
  earliestMonth,
  selectedAccount,
}: ExpensesOverviewProps) => {
  const hasPreviousMonth =
    earliestMonth !== undefined && currentMonth > earliestMonth;
  const previousMonth = shiftMonth(currentMonth, -1);

  // One request covers both months: the report returns one entry per month in the range.
  const { data, isError, isLoading } = useQuery({
    ...createFetchMonthlyExpenses({
      params: {
        from: hasPreviousMonth ? previousMonth : currentMonth,
        to: currentMonth,
        ...(selectedAccount !== "all" && {
          accountId: selectedAccount,
          currency,
        }),
      },
    }),
    enabled: earliestMonth !== undefined,
  });

  const findMonth = (month: string) =>
    data?.months.find((entry) => entry.month === month) ?? null;
  const currentExpenses = findMonth(currentMonth);
  const previousExpenses = hasPreviousMonth ? findMonth(previousMonth) : null;

  const currentMonthLargestCategory = (currentExpenses?.byCategory ?? [])
    .filter((exp) => exp.kind === "expense")
    .reduce<CategoryTotals | null>(
      (max, exp) => (max === null || exp.outflow > max.outflow ? exp : max),
      null,
    );

  const monthDifferentialTotalExpense =
    (((currentExpenses?.outflow ?? 1) - (previousExpenses?.outflow ?? 1)) /
      (previousExpenses?.outflow ?? 1)) *
    100;

  const formattedLargestCategoryExpense =
    (((currentExpenses?.outflow ?? 1) -
      (currentMonthLargestCategory?.outflow ?? 1)) /
      (currentExpenses?.outflow ?? 1)) *
    100;

  if (isError) {
    return (
      <OverviewItemsContainer>
        <p>ERROr</p>
      </OverviewItemsContainer>
    );
  }

  if (isLoading) {
    return (
      <OverviewItemsContainer>
        <LoadingOverviewItem />
        <LoadingOverviewItem />
        <LoadingOverviewItem />
      </OverviewItemsContainer>
    );
  }

  return (
    <OverviewItemsContainer>
      <OverviewItem
        currency={currency}
        content={currentExpenses?.outflow ?? 1}
        subContent={
          <p
            className={cn(
              "text-body-small",
              monthDifferentialTotalExpense < 0
                ? "text-text-success"
                : "text-text-error",
            )}
          >
            {monthDifferentialTotalExpense.toFixed(2)}% compared to{" "}
            {formatDate({
              date: previousExpenses?.month ?? "",
              format: "long",
              showYear: false,
              showDay: false,
            })}
          </p>
        }
        title={<p className="text-body-small">Total Spent</p>}
      />
      <OverviewItem
        content={currentMonthLargestCategory?.name ?? ""}
        subContent={
          <p className="text-body-small">{`${formatCurrency({
            amount: currentMonthLargestCategory?.outflow ?? 1,
          })} · ${formattedLargestCategoryExpense.toFixed(2)}%`}</p>
        }
        title={<p className="text-body-small">Largest category</p>}
      />
      <OverviewItem
        content={(currentExpenses?.transactionCount ?? 0).toString()}
        subContent={
          <p className="text-body-small">
            {`${formatCurrency({
              amount:
                (currentExpenses?.outflow ?? 1) /
                (currentExpenses?.transactionCount ?? 1),
            })} per transaction`}
          </p>
        }
        title={<p className="text-body-small">Transactions</p>}
      />
    </OverviewItemsContainer>
  );
};
