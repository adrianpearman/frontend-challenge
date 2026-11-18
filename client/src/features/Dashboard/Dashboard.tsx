import { BaseLayoutComponent } from "@/components/base/Layouts/BaseLayoutComponent";
import {
  DashboardAccountsAndBilling,
  DashboardOverview,
  DashboardTransactions,
} from "@/features/Dashboard/components";

export const Dashboard = () => {
  return (
    <BaseLayoutComponent>
      <div className="flex flex-col gap-2 p-10">
        <DashboardOverview />
        <DashboardAccountsAndBilling />
        <DashboardTransactions />
      </div>
    </BaseLayoutComponent>
  );
};
