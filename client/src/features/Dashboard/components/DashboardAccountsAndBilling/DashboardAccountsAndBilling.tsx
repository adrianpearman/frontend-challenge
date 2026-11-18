import { Accounts } from "@/features/Dashboard/components/DashboardAccountsAndBilling/components/Accounts";
import { Billing } from "@/features/Dashboard/components/DashboardAccountsAndBilling/components/Billing";

export const DashboardAccountsAndBilling = () => {
  return (
    <div className="flex gap-2">
      <Accounts />
      <Billing />
    </div>
  );
};
