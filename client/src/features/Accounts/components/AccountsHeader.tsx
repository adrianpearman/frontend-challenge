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
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-h4">Accounts & ledger</h1>
          <p className="text-body-small">Every account and it's transactions</p>
        </div>
        <div className="flex gap-2">
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
        </div>
      </div>
    </div>
  );
};
