import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { TruncateText } from "@/components/base";
import {
  AccountsAndBillingTable,
  BalanceCell,
  LoadingTableComponent,
} from "@/features/Dashboard/components/DashboardAccountsAndBilling/components/AccountsAndBillingTable";
import { createFetchDashboardMetrics } from "@/utils/api/requests";
import { AccountTypeMap } from "@/utils/consts";

export const Accounts = () => {
  const { data, isError, isLoading } = useQuery(
    createFetchDashboardMetrics({}),
  );

  const formattedRowData = useMemo(() => {
    if (!data || data === undefined) {
      return [];
    }

    const rowData: React.ReactNode[][] = data.data.map((row) => {
      return [
        <TruncateText
          content={<span>{row.name}</span>}
          data-row-category-id={row.id}
        />,
        AccountTypeMap[row.type],
        <BalanceCell
          amount={row.balance?.available ?? 0}
          currency={row.currency}
        />,
      ];
    });

    return rowData;
  }, [data]);

  if (isError) {
    return <div>ERROR</div>;
  }

  if (isLoading) {
    return <LoadingTableComponent />;
  }

  return (
    <div className="flex-1 border border-neutral-border rounded-md flex flex-col">
      <div className="flex justify-between p-3.5">
        <h2 className="text-h5">Accounts Overview</h2>
      </div>
      <AccountsAndBillingTable
        table="accounts"
        tableHeader={["Account", "Type", "Balance"]}
        tableRows={formattedRowData}
      />
    </div>
  );
};
