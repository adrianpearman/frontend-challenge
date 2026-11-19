import { useQuery } from "@tanstack/react-query";
import {
  LoadingOverviewItems,
  OverviewItem,
  OverviewItemsContainer,
} from "@/components/base";
import { expensesReportQuery } from "@/features/Expenses/utils/expensesReportQuery";
import {
  cn,
  formatCurrency,
  formatDate,
  safeDivide,
  shiftMonth,
} from "@/utils/functions";
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

  // Same query as the charts, so this reuses their request; previous month is in the range.
  const { data, isError, isLoading } = useQuery(
    expensesReportQuery({
      currency,
      currentMonth,
      earliestMonth,
      selectedAccount,
    }),
  );

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

  const currentOutflow = currentExpenses?.outflow ?? 0;
  const transactionCount = currentExpenses?.transactionCount ?? 0;

  // null when there's no previous month (or it was 0) — a % change is undefined then.
  const monthDifferentialRatio = safeDivide(
    currentOutflow - (previousExpenses?.outflow ?? 0),
    previousExpenses?.outflow,
  );
  const monthDifferentialTotalExpense =
    monthDifferentialRatio === null ? null : monthDifferentialRatio * 100;

  const largestCategoryShare =
    (safeDivide(currentMonthLargestCategory?.outflow ?? 0, currentOutflow) ??
      0) * 100;

  const averagePerTransaction =
    safeDivide(currentOutflow, transactionCount) ?? 0;

  if (isError) {
    return (
      <OverviewItemsContainer>
        <p>ERROr</p>
      </OverviewItemsContainer>
    );
  }

  if (isLoading) {
    return <LoadingOverviewItems />;
  }

  return (
    <OverviewItemsContainer>
      <OverviewItem
        currency={currency}
        content={currentOutflow}
        subContent={
          monthDifferentialTotalExpense === null ? (
            <p className="text-body-small text-text-secondary">
              No previous month to compare
            </p>
          ) : (
            <p
              className={cn(
                "text-body-small",
                monthDifferentialTotalExpense <= 0
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
          )
        }
        title={<p className="text-body-small">Total Spent</p>}
      />
      <OverviewItem
        content={currentMonthLargestCategory?.name ?? "—"}
        subContent={
          <p className="text-body-small">{`${formatCurrency({
            amount: currentMonthLargestCategory?.outflow ?? 0,
          })} · ${largestCategoryShare.toFixed(2)}%`}</p>
        }
        title={<p className="text-body-small">Largest category</p>}
      />
      <OverviewItem
        content={transactionCount.toString()}
        subContent={
          <p className="text-body-small">
            {`${formatCurrency({
              amount: averagePerTransaction,
            })} per transaction`}
          </p>
        }
        title={<p className="text-body-small">Transactions</p>}
      />
    </OverviewItemsContainer>
  );
};
