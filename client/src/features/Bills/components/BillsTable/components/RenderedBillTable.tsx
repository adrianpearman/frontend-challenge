import { LoadingDetails } from "@/components/base/RootDrawer/components";
import { VirtualizedTable } from "@/components/vendors";
import { RenderedBillTableColumns } from "@/features/Bills/components/BillsTable/components/RenderedBillTableColumns";
import { useAccountsAndCategories } from "@/utils/api/hooks/useAccountsAndCategories";
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
    accountsMap,
    categoriesMap,
    isError: lookupsError,
    isLoading: lookupsLoading,
  } = useAccountsAndCategories();

  if (isLoading || lookupsLoading) {
    return (
      <div className="flex flex-col gap-2 p-3">
        <LoadingDetails overrideLength={5} />
      </div>
    );
  }

  if (isError || lookupsError) {
    return "";
  }

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
