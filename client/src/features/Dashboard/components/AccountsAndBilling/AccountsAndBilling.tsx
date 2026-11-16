import { Accounts } from "@/features/Dashboard/components/AccountsAndBilling/components/Accounts";
import { Billing } from "@/features/Dashboard/components/AccountsAndBilling/components/Billing";

export const AccountsAndBilling = () => {
  return (
    <div className="flex gap-2">
      <Accounts />
      <Billing />
    </div>
  );
};
