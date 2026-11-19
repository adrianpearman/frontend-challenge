import { useQuery } from "@tanstack/react-query";
import { LoadingOverviewItem, OverviewItem } from "@/components/base";
import { useBaseUIStore } from "@/store/BaseUIStore";
import { createFetchOccurrences } from "@/utils/api/requests";
import { addDays, convertCurrency, toLocalDate } from "@/utils/functions";

export const TotalBillsWithinThirtyDays = () => {
  const selectedCurrency = useBaseUIStore((state) => state.selectedCurrency);

  const from = toLocalDate();
  const to = toLocalDate(addDays(30));

  const { data, isLoading } = useQuery(
    createFetchOccurrences({ params: { from, to, kind: "bill" } }),
  );

  // Bill amounts are negative; subtracting shows the total owed as a positive figure.
  const convertedTotal = (data?.occurrences ?? []).reduce(
    (total, { amount, currency }) =>
      total - convertCurrency(amount ?? 0, currency, selectedCurrency),
    0,
  );

  if (isLoading) return <LoadingOverviewItem />;

  return (
    <OverviewItem
      content={convertedTotal}
      currency={selectedCurrency}
      subContent={
        <p className="text-body-small text-text-success">
          {data?.totals.occurrenceCount ?? 0} upcoming
        </p>
      }
      title={<p className="text-body-small">Bills due (30 days)</p>}
    />
  );
};
