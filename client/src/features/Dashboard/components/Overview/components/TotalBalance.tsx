import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { OverviewItem } from "@/components/base";
import { useBaseUIStore } from "@/store/BaseUIStore";
import { createFetchDashboardMetrics } from "@/utils/api/requests";
import { CurrencyConversionMap } from "@/utils/consts";

export const TotalBalance = () => {
  const selectedCurrency = useBaseUIStore((state) => state.selectedCurrency);

  const { data } = useQuery(createFetchDashboardMetrics({}));

  const convertedTotalBalance = useMemo(() => {
    if (!data) {
      return 0;
    }

    return data.data.reduce((total, { balance, currency }) => {
      const available = balance?.available ?? 0;

      const rate = CurrencyConversionMap[currency];
      if (currency === selectedCurrency || rate === undefined) {
        return total + available;
      }
      return total + Math.floor(available * rate);
    }, 0);
  }, [data]);

  return (
    <OverviewItem
      amount={convertedTotalBalance}
      content={
        <p className="text-text-success">Across {data?.data.length} accounts</p>
      }
      title={"Total Balance"}
    />
  );
};
