import { Button } from "@/components/vendors";

type AccountsHeaderProps = {
  resetStateFn: () => void;
};

export const AccountsHeader = ({ resetStateFn }: AccountsHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-h4">Accounts & ledger</h1>
          <p className="text-body-small">Every account and it's transactions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={resetStateFn} variant="outline">
            Show all account transactions
          </Button>
          <Button
            // onClick={() => baseUIStoreActions.setShowApplicationDrawer(true)}
            variant="secondary"
          >
            Add Expense
          </Button>
          <Button
            // onClick={() => baseUIStoreActions.setShowApplicationDrawer(true)}
            variant="default"
          >
            Add Account
          </Button>
        </div>
      </div>
    </div>
  );
};
