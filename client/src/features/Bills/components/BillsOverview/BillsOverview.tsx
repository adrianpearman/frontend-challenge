import { useQuery } from "@tanstack/react-query";
import {
  OverviewItem,
  OverviewItemsContainer,
  LoadingOverviewItem,
} from "@/components/base";
import { createFetchOccurrences } from "@/utils/api/requests";
import { cn } from "@/utils/functions";

export const BillsOverview = () => {
  const today = new Date();
  const in30Days = new Date(today);
  in30Days.setDate(today.getDate() + 30);

  const {
    data: billData,
    isError: fetchBillDataError,
    isLoading: fetchBillDataLoading,
  } = useQuery(
    createFetchOccurrences({
      params: {
        kind: "",
        from: today.toLocaleDateString("en-CA"),
        to: in30Days.toLocaleDateString("en-CA"),
      },
    }),
  );

  const {
    data: incomeData,
    isError: fetchIncomeDataError,
    isLoading: fetchIncomeDataLoading,
  } = useQuery(
    createFetchOccurrences({
      params: {
        kind: "income",
        from: today.toLocaleDateString("en-CA"),
        to: in30Days.toLocaleDateString("en-CA"),
      },
    }),
  );

  const isError = fetchBillDataError || fetchIncomeDataError;
  const isLoading = fetchBillDataLoading || fetchIncomeDataLoading;

  if (isLoading) {
    return (
      <OverviewItemsContainer>
        <LoadingOverviewItem />
        <LoadingOverviewItem />
        <LoadingOverviewItem />
      </OverviewItemsContainer>
    );
  }

  if (isError) {
    return "error";
  }

  const differentialIncomeBilling =
    (incomeData?.totals.net ?? 0) - (billData?.totals.net ?? 0);

  return (
    <OverviewItemsContainer>
      <OverviewItem
        content={billData?.totals.net ?? 0}
        subContent={
          <p
            className={cn(
              "text-body-small",
              (billData?.totals.net ?? 0) > 0
                ? "text-text-success"
                : "text-text-error",
            )}
          >
            {billData?.totals.occurrenceCount ?? 0} source(s)
          </p>
        }
        title={<p className="text-body-small">Bills due (30 days)</p>}
      />
      <OverviewItem
        content={incomeData?.totals.net ?? 0}
        subContent={
          <p
            className={cn(
              "text-body-small",
              (incomeData?.totals.net ?? 0) > 0
                ? "text-text-success"
                : "text-text-error",
            )}
          >
            {incomeData?.totals.occurrenceCount ?? 0} source(s)
          </p>
        }
        title={<p className="text-body-small">Income expected (30 days)</p>}
      />
      <OverviewItem
        content={differentialIncomeBilling}
        subContent={
          <p
            className={cn(
              "text-body-small",
              (incomeData?.totals.net ?? 0) > 0
                ? "text-text-success"
                : "text-text-error",
            )}
          >
            After all scheduled transactions in period
          </p>
        }
        title={<p className="text-body-small">Net (30 days)</p>}
      />
    </OverviewItemsContainer>
  );
};
