import { useQuery } from "@tanstack/react-query";
import { OverviewItemsContainer, PageHeader } from "@/components/base";
import { Button } from "@/components/vendors";
import {
  TotalBalance,
  TotalBillsWithinThirtyDays,
  TotalCurrentMonthSpend,
} from "@/features/Dashboard/components/DashboardOverview/components";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import { createFetchAccounts } from "@/utils/api/requests";
import { formatDate } from "@/utils/functions";

export const DashboardOverview = () => {
  const { dataUpdatedAt } = useQuery(createFetchAccounts({}));

  const displayedUpdateValue = dataUpdatedAt
    ? `Updated at: ${formatDate({
        date: dataUpdatedAt,
        showTime: true,
        showYear: true,
      })}`
    : "Unable to fetch data";

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Overview"
        description={displayedUpdateValue}
        actions={
          <Button
            onClick={() => baseUIStoreActions.openDrawer("add_expense")}
            variant="secondary"
          >
            Add Expense
          </Button>
        }
      />
      <OverviewItemsContainer>
        <TotalBalance />
        <TotalCurrentMonthSpend />
        <TotalBillsWithinThirtyDays />
      </OverviewItemsContainer>
    </div>
  );
};
