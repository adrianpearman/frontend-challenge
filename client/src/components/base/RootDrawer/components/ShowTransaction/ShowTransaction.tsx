import { useQuery } from "@tanstack/react-query";
import { useBaseUIStore } from "@/store/BaseUIStore";
import { LoadingDrawerDetails } from "@/components/base/RootDrawer/components";
import { useAccountsAndCategories } from "@/utils/api/hooks/useAccountsAndCategories";
import { createFetchTransaction } from "@/utils/api/requests";
import { formatCurrency, formatDate } from "@/utils/functions";

export const ShowTransaction = () => {
  const today = new Date();

  const transactionID = useBaseUIStore((state) => state.transactionID);

  const {
    accountsMap,
    categoriesMap,
    isLoading: isFetchLoading,
    isError: isFetchError,
  } = useAccountsAndCategories();

  const {
    data: transactionData,
    isError: transactionFetchingError,
    isLoading: transactionFetchingLoading,
  } = useQuery({
    ...createFetchTransaction(transactionID ?? "", {}),
    enabled: !!transactionID,
  });

  if (!transactionID) {
    return null;
  }

  const isError = isFetchError || transactionFetchingError;

  const isLoading = isFetchLoading || transactionFetchingLoading;

  if (isLoading) {
    return <LoadingDrawerDetails />;
  }

  if (isError) {
    return (
      <div>
        <p>ERROR</p>
      </div>
    );
  }

  const displayedContext: Record<string, string | string[]>[] = [
    {
      title: "Account",
      value: accountsMap.get(transactionData?.data.accountId ?? "") ?? "",
    },
    {
      title: "Category",
      value: categoriesMap.get(transactionData?.data.categoryId ?? "") ?? "",
    },
    {
      title: "Project",
      value: transactionData?.data.projectId ?? "-",
    },
    {
      title: "Status",
      value: transactionData?.data.status ?? "-",
    },
    {
      title: "Tags",
      value: transactionData?.data.tags ?? ["No Tags"],
    },
    {
      title: "Notes",
      value: transactionData?.data.notes ?? "-",
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-auto relative">
      <div className="sticky top-0 flex flex-col gap-2 bg-background p-4 pb-0 ">
        <h2 className="text-h5">Transaction Details</h2>
        <p className="text-body-small">
          {formatDate({
            date: transactionData?.data.date ?? today.getSeconds(),
            showYear: true,
          })}
        </p>
        <p className="text-h4 py-4">
          {formatCurrency({
            amount: transactionData?.data.amount ?? 0,
            currency: transactionData?.data.currency ?? "CAD",
          })}
        </p>
      </div>
      <div className="flex flex-col gap-1 p-4">
        {displayedContext.map((context, i) => {
          return (
            <div
              className="flex justify-between py-3 items-center border-b border-b-border-secondary/50"
              key={`displayed-context-item-${i}`}
            >
              <h3>{context.title}</h3>
              <p className="flex gap-1.5">
                {typeof context.value === "string" ? (
                  <span className="capitalize">{context.value}</span>
                ) : (
                  context.value.map((label, j) => {
                    return (
                      <span
                        className="p-2 rounded-md bg-background-success"
                        key={`rendered-label-items-${j}`}
                      >
                        {label}
                      </span>
                    );
                  })
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
