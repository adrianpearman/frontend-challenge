import { useQuery } from "@tanstack/react-query";
import {
  ClickableTable,
  type ClickableTableRow,
  SectionError,
  TruncateText,
} from "@/components/base";
import {
  BalanceCell,
  LoadingTableComponent,
} from "@/features/Dashboard/components/DashboardAccountsAndBilling/components/AccountsAndBillingTable";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import { createFetchAccounts } from "@/utils/api/requests";
import { AccountTypeMap } from "@/utils/consts";

export const DashboardAccounts = () => {
  const { data, isError, isLoading } = useQuery(createFetchAccounts({}));

  const rows: ClickableTableRow[] = (data?.data ?? []).map((row) => ({
    id: row.id,
    cells: [
      <TruncateText content={<span>{row.name}</span>} />,
      AccountTypeMap[row.type],
      <BalanceCell
        amount={row.balance?.available ?? 0}
        currency={row.currency}
      />,
    ],
  }));

  const handleRowClick = (id: string) => {
    baseUIStoreActions.setAccountID(id);
    baseUIStoreActions.openDrawer("show_account");
  };

  if (isLoading) {
    return <LoadingTableComponent />;
  }

  if (isError) {
    return <SectionError message="Could not load accounts." />;
  }

  return (
    <div className="flex-1 border border-neutral-border rounded-md flex flex-col">
      <div className="flex flex-wrap gap-2 justify-between p-3.5">
        <h2 className="text-h5">Accounts Overview</h2>
      </div>
      <ClickableTable
        onRowClick={handleRowClick}
        tableHeader={["Account", "Type", "Balance"]}
        tableRows={rows}
      />
    </div>
  );
};
