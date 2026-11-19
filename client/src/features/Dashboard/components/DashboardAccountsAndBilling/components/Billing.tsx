import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { TruncateText } from "@/components/base";
import { buttonVariants } from "@/components/vendors";
import {
  AccountsAndBillingTable,
  type AccountsAndBillingRow,
  BalanceCell,
  LoadingTableComponent,
} from "@/features/Dashboard/components/DashboardAccountsAndBilling/components/AccountsAndBillingTable";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import { createFetchScheduledTransactions } from "@/utils/api/requests";
import { formatDate } from "@/utils/functions";

export const Billing = () => {
  const { data, isError, isLoading } = useQuery(
    createFetchScheduledTransactions({}),
  );

  const rows: AccountsAndBillingRow[] = (data?.data ?? [])
    .slice(0, 5)
    .map((row) => ({
      id: row.id,
      cells: [
        <TruncateText content={<span>{row.name}</span>} />,
        formatDate({ date: row.nextDueDate, format: "short" }),
        <BalanceCell amount={row.amount} currency={row.currency} />,
      ],
    }));

  const handleRowClick = (id: string) => {
    baseUIStoreActions.setTransactionID(id);
    baseUIStoreActions.openDrawer("show_upcoming");
  };

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
      <div className="flex flex-wrap gap-2 justify-between p-3">
        <h2 className="text-h5">Upcoming bills & income</h2>
        <div className="flex gap-2">
          <Link to="/bills" className={buttonVariants()}>
            View More
          </Link>
        </div>
      </div>
      <AccountsAndBillingTable
        onRowClick={handleRowClick}
        tableHeader={["Bill", "Date", "Amount"]}
        tableRows={rows}
      />
    </div>
  );
};
