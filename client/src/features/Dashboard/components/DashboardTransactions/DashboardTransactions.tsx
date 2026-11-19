import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ClickableTable,
  type ClickableTableRow,
  SectionError,
} from "@/components/base";
import { LoadingDetails } from "@/components/base/LoadingDetails";
import { buttonVariants } from "@/components/vendors";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import { useAccountsAndCategories } from "@/utils/api/hooks/useAccountsAndCategories";
import { createFetchRecentTransactions } from "@/utils/api/requests";
import { cn, formatCurrency, formatDate } from "@/utils/functions";

export const DashboardTransactions = () => {
  const {
    data: transactionData,
    isError: transactionError,
    isLoading: transactionLoading,
  } = useQuery(createFetchRecentTransactions({ params: { limit: 10 } }));

  const {
    accountsMap,
    categoriesMap,
    isError: lookupsError,
    isLoading: lookupsLoading,
  } = useAccountsAndCategories();

  const handleRowClick = (id: string) => {
    baseUIStoreActions.setTransactionID(id);
    baseUIStoreActions.openDrawer("show_transaction");
  };

  if (transactionLoading || lookupsLoading) {
    return (
      <div className="flex flex-col border border-neutral-border rounded-md">
        <div className="flex flex-col gap-2 p-3">
          <LoadingDetails overrideLength={5} />
        </div>
      </div>
    );
  }

  if (transactionError || lookupsError) {
    return <SectionError message="Could not load recent transactions." />;
  }

  const rows: ClickableTableRow[] = (transactionData?.data ?? []).map(
    ({ accountId, amount, categoryId, currency, date, description, id }) => ({
      id,
      cells: [
        formatDate({ date, showTime: false, showYear: false }),
        description,
        categoryId ? (categoriesMap.get(categoryId) ?? "") : "",
        accountsMap.get(accountId) ?? "",
        <span
          className={cn(amount < 0 ? "text-text-error" : "text-text-success")}
        >
          {formatCurrency({ amount, currency })}
        </span>,
      ],
    }),
  );

  return (
    <div className="flex flex-col border border-neutral-border rounded-md">
      <div className="flex flex-wrap gap-2 justify-between p-3">
        <h2 className="text-h5">Recent Transactions</h2>
        <Link to="/accounts" className={buttonVariants()}>
          View More Transactions
        </Link>
      </div>
      <ClickableTable
        caption="A list of recent transactions."
        onRowClick={handleRowClick}
        tableHeader={["Date", "Description", "Category", "Account", "Amount"]}
        tableRows={rows}
      />
    </div>
  );
};
