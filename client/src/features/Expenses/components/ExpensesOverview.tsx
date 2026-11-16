import { OverviewItem, OverviewItemsContainer } from "@/components/base";

export const ExpensesOverview = () => {
  return (
    <OverviewItemsContainer>
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
    </OverviewItemsContainer>
  );
};
