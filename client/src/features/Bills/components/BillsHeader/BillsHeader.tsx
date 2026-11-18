import { Button } from "@/components/vendors";
import { baseUIStoreActions } from "@/store/BaseUIStore";

export const BillsHeader = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-h4">Bills & income</h1>
          <p className="text-body-small">
            Scheduled future transactions feed your budget projections
          </p>
        </div>
        <div>
          <Button
            onClick={() => baseUIStoreActions.openDrawer("add_expense")}
            variant="secondary"
          >
            Add Bill or Income
          </Button>
        </div>
      </div>
    </div>
  );
};
