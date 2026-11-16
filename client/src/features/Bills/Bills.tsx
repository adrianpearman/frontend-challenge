import { BaseLayoutComponent } from "@/components/base";
import {
  BillsHeader,
  BillsOverview,
  BillsTable,
} from "@/features/Bills/components";

export const Bills = () => {
  return (
    <BaseLayoutComponent>
      <div className="flex flex-col gap-2 p-10">
        <BillsHeader />
        <BillsOverview />
        <BillsTable />
      </div>
    </BaseLayoutComponent>
  );
};
