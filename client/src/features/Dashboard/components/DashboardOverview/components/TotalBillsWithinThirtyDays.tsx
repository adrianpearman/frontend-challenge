import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadingOverviewItem, OverviewItem } from "@/components/base";
import { useBaseUIStore } from "@/store/BaseUIStore";
import { createFetchOccurrences } from "@/utils/api/requests";
import { CurrencyConversionMap } from "@/utils/consts";
import { addDays, toLocalDate } from "@/utils/functions";

export const TotalBillsWithinThirtyDays = () => {
  const selectedCurrency = useBaseUIStore((state) => state.selectedCurrency);

  const from = toLocalDate();
  const to = toLocalDate(addDays(30));

  const { data, isLoading } = useQuery(
    createFetchOccurrences({ params: { from, to, kind: "bill" } }),
  );

  const convertedTotalBalance = useMemo(() => {
    if (!data) {
      return 0;
    }

    return data.occurrences.reduce((total, { amount, currency }) => {
      const available = amount ?? 0;

      const rate = CurrencyConversionMap[currency];
      if (currency === selectedCurrency || rate === undefined) {
        return total - available;
      }
      return total - Math.floor(available * rate);
    }, 0);
  }, [data]);

  if (isLoading) return <LoadingOverviewItem />;

  return (
    <OverviewItem
      content={convertedTotalBalance}
      subContent={
        <p className="text-body-small text-text-success">
          {data?.totals.occurrenceCount ?? 0} upcoming
        </p>
      }
      title={<p className="text-body-small">Bills due (30 days)</p>}
    />
  );
};
