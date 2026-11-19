import { LoadingDetails } from "@/components/base/RootDrawer/components";
import { VirtualizedTable } from "@/components/vendors";
import { RenderedBillTableColumns } from "@/features/Bills/components/BillsTable/components/RenderedBillTableColumns";
import { useAccountsAndCategories } from "@/utils/api/hooks/useAccountsAndCategories";
import type { BillRow } from "@/features/Bills/utils/types";
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

  const rows: BillRow[] = data.map((bill) => ({
    ...bill,
    accountName: accountsMap.get(bill.accountId) ?? "",
    categoryName: bill.categoryId
      ? (categoriesMap.get(bill.categoryId) ?? "")
      : "",
  }));

  return <VirtualizedTable columns={RenderedBillTableColumns} data={rows} />;
};
