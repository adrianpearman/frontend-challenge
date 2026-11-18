import { useQuery } from "@tanstack/react-query";
import {
  CategoryPercentageChart,
  HistoricalMonthlyExpenseChart,
} from "@/features/Expenses/components/ExpensesCharts/components";
import { LoadingCharts } from "@/features/Expenses/components/ExpensesCharts";
import { createFetchMonthlyExpenses } from "@/utils/api/requests";
import { formatDate, shiftMonth } from "@/utils/functions";
import type {
  CategoryChartDataObject,
  ExpensesChartDataObject,
} from "@/features/Expenses/utils/types";
import type { CurrencyCode } from "@/utils/types";

type ExpensesChartsProps = {
  currency?: CurrencyCode;
  currentMonth: string; // YYYY-MM
  earliestMonth?: string; // YYYY-MM, undefined while accounts load
  selectedAccount: string; // "all" = every account
};

export const ExpensesCharts = ({
  currency,
  currentMonth,
  earliestMonth,
  selectedAccount,
}: ExpensesChartsProps) => {
  const sixMonthsAgo = shiftMonth(currentMonth, -5);
  const from =
    earliestMonth && earliestMonth > sixMonthsAgo
      ? earliestMonth
      : sixMonthsAgo;

  const {
    data: { categoryData, historicalData } = {
      categoryData: [],
      historicalData: [],
    },
    isError,
    isLoading,
  } = useQuery({
    ...createFetchMonthlyExpenses({
      params: {
        from,
        to: currentMonth,
        ...(selectedAccount !== "all" && {
          accountId: selectedAccount,
          currency,
        }),
      },
    }),
    enabled: earliestMonth !== undefined,
    select: (report) => {
      // The range ends at currentMonth, so its category breakdown is already here.
      const current = report.months.find((m) => m.month === currentMonth);
      const expenses = (current?.byCategory ?? []).filter(
        (c) => c.kind === "expense" && c.outflow > 0,
      );
      const totalOutflow = current?.outflow || 1;
      return {
        historicalData: report.months.map(
          ({ month, outflow }): ExpensesChartDataObject => ({
            label: formatDate({ date: month, showDay: false }).trim(),
            total: outflow,
          }),
        ),
        categoryData: expenses.map((c): CategoryChartDataObject => ({
          color: c.color as CategoryChartDataObject["color"],
          currency: currency ?? "CAD",
          label: c.name,
          percentage: c.outflow / totalOutflow,
          total: c.outflow,
        })),
      };
    },
  });

  if (isError) {
  }

  if (isLoading) {
    return (
      <div className="flex gap-2 ">
        <LoadingCharts className="w-2/3" />
        <LoadingCharts className="w-1/3" />
      </div>
    );
  }

  return (
    <div className="flex gap-2 ">
      <CategoryPercentageChart data={categoryData} />
      <HistoricalMonthlyExpenseChart data={historicalData} />
    </div>
  );
};
