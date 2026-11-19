import { useQuery } from "@tanstack/react-query";
import {
  LoadingOverviewItems,
  OverviewItem,
  OverviewItemsContainer,
  SectionError,
} from "@/components/base";
import { expensesReportQuery } from "@/features/Expenses/utils/expensesReportQuery";
import { useExpensesFilters } from "@/features/Expenses/utils/expensesSearch";
import {
  cn,
  formatCurrency,
  formatDate,
  safeDivide,
  shiftMonth,
} from "@/utils/functions";
import type { CategoryTotals } from "@/utils/types";

export const ExpensesOverview = () => {
  const { currency, currentMonth, earliestMonth, selectedAccount } =
    useExpensesFilters();
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

  if (isLoading) {
    return <LoadingOverviewItems />;
  }

  if (isError) {
    return (
      <OverviewItemsContainer>
        <SectionError message="Could not load the expense summary." />
      </OverviewItemsContainer>
    );
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
