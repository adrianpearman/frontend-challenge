import { OverviewItem } from "@/components/base";

export const ExpensesOverview = () => {
  return (
    <div className="flex gap-2">
      <OverviewItem
        amount={1000}
        content={
          <p className="text-text-success">-10% compared to last month</p>
        }
        title={"Total Spent"}
      />
      <OverviewItem
        amount={1000}
        content={<p className="text-text-success">Across accounts</p>}
        title={"Largest category"}
      />
      <OverviewItem
        amount={1000}
        content={<p className="text-text-success">Across accounts</p>}
        title={"Transactions"}
      />
    </div>
  );
};
