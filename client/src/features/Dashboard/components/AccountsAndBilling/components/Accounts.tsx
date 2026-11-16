import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/vendors";
import {
  AccountsAndBillingTable,
  BalanceCell,
  LoadingTableComponent,
} from "@/features/Dashboard/components/AccountsAndBilling/components/AccountsAndBillingTable";
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
        row.name,
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
      <div className="flex justify-between p-3">
        <h2 className="text-h5">Accounts</h2>
        <div className="flex gap-2">
          <Link to="/accounts" className={buttonVariants()}>
            View More
          </Link>
        </div>
      </div>
      <AccountsAndBillingTable
        tableHeader={["Account", "Type", "Balance"]}
        tableRows={formattedRowData}
      />
    </div>
  );
};
