import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/vendors";
import {
  AccountsAndBillingTable,
  BalanceCell,
  LoadingTableComponent,
} from "@/features/Dashboard/components/AccountsAndBilling/components/AccountsAndBillingTable";
import { createFetchScheduledTransactions } from "@/utils/api/requests";
import { formatDate } from "@/utils/functions";

export const Billing = () => {
  const { data, isError, isLoading } = useQuery(
    createFetchScheduledTransactions({}),
  );

  if (isError) {
    return <div>ERROR</div>;
  }

  if (isLoading) {
    return <LoadingTableComponent />;
  }

  const formattedRowData = useMemo(() => {
    if (!data || data === undefined) {
      return [];
    }
    // Overview Page will only showcase 5 with an option to navigate to a different page to see more
    const rowData: React.ReactNode[][] = data.data.slice(0, 5).map((row) => {
      return [
        row.name,
        formatDate({
          date: row.nextDueDate,
          format: "short",
        }),
        <BalanceCell
          amount={row.amount}
          className="text-text-success"
          currency={row.currency}
        />,
      ];
    });

    return rowData;
  }, [data]);

  return (
    <div className="flex-1 border border-neutral-border rounded-md flex flex-col">
      <div className="flex justify-between p-3">
        <h2 className="text-h5">Upcoming bills & income</h2>
        <div className="flex gap-2">
          <Link to="/bills" className={buttonVariants()}>
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
