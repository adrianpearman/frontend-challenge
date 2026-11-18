import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { OverviewItem } from "@/components/base";
import { useBaseUIStore } from "@/store/BaseUIStore";
import { createFetchOccurrences } from "@/utils/api/requests";
import { CurrencyConversionMap } from "@/utils/consts";

export const TotalBillsWithinThirtyDays = () => {
  const selectedCurrency = useBaseUIStore((state) => state.selectedCurrency);

  const today = new Date();
  const from = today.toLocaleDateString("en-CA");
  const to = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 30,
  ).toLocaleDateString("en-CA");

  const { data } = useQuery(
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
