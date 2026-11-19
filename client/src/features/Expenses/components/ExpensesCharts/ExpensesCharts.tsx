import { useQuery } from "@tanstack/react-query";
import {
  CategoryPercentageChart,
  HistoricalMonthlyExpenseChart,
} from "@/features/Expenses/components/ExpensesCharts/components";
import {
  ErrorCharts,
  LoadingCharts,
} from "@/features/Expenses/components/ExpensesCharts";
import { expensesReportQuery } from "@/features/Expenses/utils/expensesReportQuery";
import { useExpensesFilters } from "@/features/Expenses/utils/expensesSearch";
import { formatDate } from "@/utils/functions";
import type {
  CategoryChartDataObject,
  ExpensesChartDataObject,
} from "@/features/Expenses/utils/types";

export const ExpensesCharts = () => {
  const { currency, currentMonth, earliestMonth, selectedAccount } =
    useExpensesFilters();
  const {
    data: { categoryData, historicalData } = {
      categoryData: [],
      historicalData: [],
    },
    isError,
    isLoading,
  } = useQuery({
    ...expensesReportQuery({
      currency,
      currentMonth,
      earliestMonth,
      selectedAccount,
    }),
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

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-2">
        <LoadingCharts className="lg:w-2/3" />
        <LoadingCharts className="lg:w-1/3" />
      </div>
    );
  }

  if (isError) {
    return <ErrorCharts />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <CategoryPercentageChart data={categoryData} />
      <HistoricalMonthlyExpenseChart data={historicalData} />
    </div>
  );
};
