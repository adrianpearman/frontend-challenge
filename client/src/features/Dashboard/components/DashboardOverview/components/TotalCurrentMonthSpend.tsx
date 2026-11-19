import { useQueries } from "@tanstack/react-query";
import { LoadingOverviewItem, OverviewItem } from "@/components/base";
import { createFetchMonthlyExpenses } from "@/utils/api/requests";
import { cn, formatDate, safeDivide, toLocalMonth } from "@/utils/functions";

export const TotalCurrentMonthSpend = () => {
  const currentDate = new Date();
  const previousDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1,
  );

  const monthParam = toLocalMonth(currentDate);
  const previousMonthParam = toLocalMonth(previousDate);

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

  if (isLoading) {
    return <LoadingOverviewItem />;
  }

  if (isError) {
    return "Error";
  }

  const displayedContent = () => {
    const higherSpendMonth = currentSpend > previousSpend;
    const equalSpend = currentSpend === previousSpend;
    const ratio = safeDivide(currentSpend - previousSpend, previousSpend);

    if (equalSpend || ratio === null) {
      return <p className="text-text-secondary">-</p>;
    }

    // Sign is rendered separately, so show the magnitude only.
    const differential = Math.floor(Math.abs(ratio) * 100);

    return (
      <p
        className={cn(
          "text-body-small",
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
