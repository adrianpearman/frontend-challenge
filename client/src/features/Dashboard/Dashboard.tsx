import { BaseLayoutComponent } from "@/components/base/Layouts/BaseLayoutComponent";
import {
  AccountsAndBilling,
  Overview,
  Transactions,
} from "@/features/Dashboard/components";

export const Dashboard = () => {
  return (
    <BaseLayoutComponent>
      <div className="flex flex-col gap-2 p-10">
        <Overview />
        <AccountsAndBilling />
        <Transactions />
      </div>
    </BaseLayoutComponent>
  );
};
