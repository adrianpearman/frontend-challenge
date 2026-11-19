import { useQuery } from "@tanstack/react-query";
import { LoadingOverviewItem, OverviewItem } from "@/components/base";
import { useBaseUIStore } from "@/store/BaseUIStore";
import { createFetchAccounts } from "@/utils/api/requests";
import { convertCurrency } from "@/utils/functions";

export const TotalBalance = () => {
  const selectedCurrency = useBaseUIStore((state) => state.selectedCurrency);

  const { data, isLoading } = useQuery(createFetchAccounts({}));

  const convertedTotalBalance = (data?.data ?? []).reduce(
    (total, { balance, currency }) =>
      total +
      convertCurrency(balance?.available ?? 0, currency, selectedCurrency),
    0,
  );

  if (isLoading) return <LoadingOverviewItem />;

  return (
    <OverviewItem
      content={convertedTotalBalance}
      currency={selectedCurrency}
      subContent={
        <p className="text-body-small text-text-success">
          Across {data?.data.length} accounts
        </p>
      }
      title={<p className="text-body-small">Total Balance</p>}
    />
  );
};
