import {
  DashboardAccounts,
  DashboardBilling,
} from "@/features/Dashboard/components/DashboardAccountsAndBilling/components";

export const DashboardAccountsAndBilling = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <DashboardAccounts />
      <DashboardBilling />
    </div>
  );
};
