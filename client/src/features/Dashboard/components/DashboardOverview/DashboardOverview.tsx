import { useQuery } from "@tanstack/react-query";
import { OverviewItemsContainer } from "@/components/base";
import { Button } from "@/components/vendors";
import {
  TotalBalance,
  TotalBillsWithinThirtyDays,
  TotalCurrentMonthSpend,
} from "@/features/Dashboard/components/DashboardOverview/components";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import { createFetchDashboardMetrics } from "@/utils/api/requests";
import { formatDate } from "@/utils/functions";

export const DashboardOverview = () => {
  const { dataUpdatedAt } = useQuery(createFetchDashboardMetrics({}));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-h4">Overview</h1>
          <p className="text-body-small">
            Updated at:{" "}
            {formatDate({
              date: dataUpdatedAt,
              showTime: true,
              showYear: true,
            })}
          </p>
        </div>
        <div>
          <Button
            onClick={() => baseUIStoreActions.openDrawer("add_expense")}
            variant="secondary"
          >
            Add Expense
          </Button>
        </div>
      </div>
      <OverviewItemsContainer>
        <TotalBalance />
        <TotalCurrentMonthSpend />
        <TotalBillsWithinThirtyDays />
      </OverviewItemsContainer>
    </div>
  );
};
