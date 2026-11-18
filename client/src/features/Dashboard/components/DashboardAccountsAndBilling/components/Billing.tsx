import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { TruncateText } from "@/components/base";
import { buttonVariants } from "@/components/vendors";
import {
  AccountsAndBillingTable,
  BalanceCell,
  LoadingTableComponent,
} from "@/features/Dashboard/components/DashboardAccountsAndBilling/components/AccountsAndBillingTable";
import { createFetchScheduledTransactions } from "@/utils/api/requests";
import { formatDate } from "@/utils/functions";

export const Billing = () => {
  const { data, isError, isLoading } = useQuery(
    createFetchScheduledTransactions({}),
  );

  const formattedRowData = useMemo(() => {
    if (!data || data === undefined) {
      return [];
    }
    // Overview Page will only showcase 5 with an option to navigate to a different page to see more
    const rowData: React.ReactNode[][] = data.data.slice(0, 5).map((row) => {
      return [
        <TruncateText
          content={<span>{row.name}</span>}
          data-row-category-id={row.id}
        />,
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

  if (isError) {
    return (
      <p className="flex-1 border border-neutral-border rounded-md p-3 text-body-small text-text-error">
        Could not load upcoming bills & income.
      </p>
    );
  }

  if (isLoading) {
    return <LoadingTableComponent />;
  }

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
        table="billing"
        tableHeader={["Bill", "Date", "Amount"]}
        tableRows={formattedRowData}
      />
    </div>
  );
};
