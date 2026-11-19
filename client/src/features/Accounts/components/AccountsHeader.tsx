import { PageHeader } from "@/components/base";
import { Button } from "@/components/vendors";
import { baseUIStoreActions } from "@/store/BaseUIStore";

type AccountsHeaderProps = {
  currentAccount: string;
  resetStateFn: () => void;
  showArchived: boolean;
  toggleShowArchivedFn: () => void;
};

export const AccountsHeader = ({
  currentAccount,
  resetStateFn,
  showArchived,
  toggleShowArchivedFn,
}: AccountsHeaderProps) => {
  return (
    <PageHeader
      title="Accounts & ledger"
      description="Every account and its transactions"
      actions={
        <>
          {currentAccount !== "" && (
            <Button onClick={resetStateFn} variant="outline">
              Show all account transactions
            </Button>
          )}
          <Button
            aria-pressed={showArchived}
            onClick={toggleShowArchivedFn}
            variant={showArchived ? "secondary" : "outline"}
          >
            {showArchived ? "Hide archived" : "Show archived"}
          </Button>
          <Button
            onClick={() => baseUIStoreActions.openDrawer("add_expense")}
            variant="secondary"
          >
            Add Expense
          </Button>
          <Button
            onClick={() => baseUIStoreActions.openDrawer("add_account")}
            variant="default"
          >
            Add Account
          </Button>
        </>
      }
    />
  );
};
