import { PageHeader } from "@/components/base";
import { Button } from "@/components/vendors";
import { baseUIStoreActions } from "@/store/BaseUIStore";

export const BillsHeader = () => {
  return (
    <PageHeader
      title="Bills & income"
      description="Scheduled future transactions feed your budget projections"
      actions={
        <Button
          onClick={() => baseUIStoreActions.openDrawer("add_expense")}
          variant="secondary"
        >
          Add Bill or Income
        </Button>
      }
    />
  );
};
