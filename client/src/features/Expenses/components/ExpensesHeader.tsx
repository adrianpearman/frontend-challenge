import { Button } from "@/components/vendors";

export const ExpensesHeader = () => {
  return (
    <div className="flex justify-between p-3">
      <div className="flex flex-col">
        <h1 className="text-h4">Expense Report</h1>
        <p className="text-body-small">Spending by category per month</p>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary">{"<"}</Button>
        <Button variant="outline">November</Button>
        <Button variant="secondary">{">"}</Button>
        <Button variant="default">All accounts</Button>
      </div>
    </div>
  );
};
