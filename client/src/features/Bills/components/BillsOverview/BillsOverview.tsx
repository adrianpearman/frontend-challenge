import { useQuery } from "@tanstack/react-query";
import {
  OverviewItem,
  OverviewItemsContainer,
  LoadingOverviewItems,
  SectionError,
} from "@/components/base";
import { createFetchOccurrences } from "@/utils/api/requests";
import { addDays, cn, toLocalDate } from "@/utils/functions";

export const BillsOverview = () => {
  const from = toLocalDate();
  const to = toLocalDate(addDays(30));

  const {
    data: billData,
    isError: fetchBillDataError,
    isLoading: fetchBillDataLoading,
  } = useQuery(
    createFetchOccurrences({
      params: {
        kind: "bill",
        from,
        to,
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
        from,
        to,
      },
    }),
  );

  const isError = fetchBillDataError || fetchIncomeDataError;
  const isLoading = fetchBillDataLoading || fetchIncomeDataLoading;

  if (isLoading) {
    return <LoadingOverviewItems />;
  }

  if (isError) {
    return (
      <OverviewItemsContainer>
        <SectionError message="Could not load bill & income totals." />
      </OverviewItemsContainer>
    );
  }

  // Bill amounts are negative, so a bill-only net is already money out.
  const differentialIncomeBilling =
    (incomeData?.totals.net ?? 0) + (billData?.totals.net ?? 0);

  return (
    <OverviewItemsContainer>
      <OverviewItem
        content={billData?.totals.outflow ?? 0}
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
              differentialIncomeBilling >= 0
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
