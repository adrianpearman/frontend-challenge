import { useQueries } from "@tanstack/react-query";
import { OverviewItem } from "@/components/base";
import { useBaseUIStore } from "@/store/BaseUIStore";
import { createFetchMonthlyExpenses } from "@/utils/api/requests";
import { CurrencyConversionMap } from "@/utils/consts";
import { cn, formatDate } from "@/utils/functions";

export const TotalCurrentMonthSpend = () => {
  const selectedCurrency = useBaseUIStore((state) => state.selectedCurrency);

  const currentDate = new Date();
  const previousDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1,
  );

  const monthParam = currentDate.toLocaleDateString("en-CA").slice(0, 7); // returns YYYY-MM
  const previousMonthParam = previousDate
    .toLocaleDateString("en-CA")
    .slice(0, 7); // returns YYYY-MM

  const [current, previous] = useQueries({
    queries: [
      createFetchMonthlyExpenses({
        params: { from: monthParam, to: monthParam },
      }),
      createFetchMonthlyExpenses({
        params: { from: previousMonthParam, to: previousMonthParam },
      }),
    ],
  });

  const currentSpend = current.data?.totals.outflow ?? 0;
  const previousSpend = previous.data?.totals.outflow ?? 0;

  const isLoading = current.isLoading || previous.isLoading;
  const isError = current.isError || previous.isError;

  const formattedCurrentSpend =
    currentSpend * (CurrencyConversionMap[selectedCurrency ?? "CAD"] ?? 1);

  console.log(formattedCurrentSpend);

  if (isLoading) {
    return "LOADING";
  }

  if (isError) {
    return "Error";
  }

  const displayedContent = () => {
    const higherSpendMonth = currentSpend > previousSpend;
    const equalSpend = currentSpend === previousSpend;
    const differential = Math.floor(
      ((currentSpend - previousSpend) / previousSpend) * 100,
    );

    if (equalSpend) {
      return <p className="text-text-secondary">-</p>;
    }

    return (
      <p
        className={cn(
          higherSpendMonth ? "text-text-error" : "text-text-success",
        )}
      >
        {higherSpendMonth ? "+" : "-"}
        {differential}% vs{" "}
        {formatDate({
          date: previousDate.getTime(),
          format: "long",
          showDay: false,
        })}
      </p>
    );
  };

  return (
    <OverviewItem
      content={currentSpend ?? 0}
      subContent={displayedContent()}
      title={"Spent this month"}
    />
  );
};
