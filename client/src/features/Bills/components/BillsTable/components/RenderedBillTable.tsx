import { useQuery } from "@tanstack/react-query";
import { LoadingDetails } from "@/components/base/RootDrawer/components";
import { VirtualizedTable } from "@/components/vendors";
import { RenderedBillTableColumns } from "@/features/Bills/components/BillsTable/components/RenderedBillTableColumns";
import {
  createFetchCategories,
  createFetchDashboardMetrics,
} from "@/utils/api/requests";
import type { Occurrence } from "@/utils/types";

type RenderedTableProps = {
  data: Occurrence[];
  isError: boolean;
  isLoading: boolean;
};

export const RenderedBillTable = ({
  data,
  isError,
  isLoading,
}: RenderedTableProps) => {
  const {
    data: accountData,
    isLoading: loadingAccountsData,
    isError: loadingAccountsError,
  } = useQuery(createFetchDashboardMetrics({}));

  const { data: categoriesData } = useQuery(
    createFetchCategories({ params: { kind: "expense" } }),
  );

  if (isLoading || loadingAccountsData) {
    return (
      <div className="flex flex-col gap-2 p-3">
        <LoadingDetails overrideLength={5} />
      </div>
    );
  }

  if (isError || loadingAccountsError) {
    return "";
  }

  const accountsMap = new Map(
    (accountData === undefined ? [] : accountData.data).map(({ id, name }) => [
      id,
      name,
    ]),
  );

  const categoriesMap = new Map(
    (categoriesData === undefined ? [] : categoriesData.data).map(
      ({ id, name }) => [id, name],
    ),
  );

  const formattedBillOccurrenceData = data.map((bill) => {
    const data: Occurrence = {
      ...bill,
      accountId: accountsMap.get(bill.accountId) ?? "",
      categoryId:
        bill.categoryId === null
          ? ""
          : (categoriesMap.get(bill.categoryId) ?? ""),
    };
    return data;
  });

  return (
    <VirtualizedTable
      columns={RenderedBillTableColumns}
      data={formattedBillOccurrenceData}
    />
  );
};
