import { OverviewItem } from "@/components/base";

export const ExpensesOverview = () => {
  return (
    <div className="flex gap-2">
      <OverviewItem
        content={1000}
        subContent={
          <p className="text-text-success">-10% compared to last month</p>
        }
        title={"Total Spent"}
      />
      <OverviewItem
        content={1000}
        subContent={<p className="text-text-success">Across accounts</p>}
        title={"Largest category"}
      />
      <OverviewItem
        content={1000}
        subContent={<p className="text-text-success">Across accounts</p>}
        title={"Transactions"}
      />
    </div>
  );
};
