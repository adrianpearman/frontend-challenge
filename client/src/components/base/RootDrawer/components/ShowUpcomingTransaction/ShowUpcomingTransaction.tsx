import { useQuery } from "@tanstack/react-query";
import {
  ErrorLoadingDrawerComponent,
  LoadingDetails,
} from "@/components/base/RootDrawer/components";
import { baseUIStoreActions, useBaseUIStore } from "@/store/BaseUIStore";
import { useAccountsAndCategories } from "@/utils/api/hooks/useAccountsAndCategories";
import { createFetchScheduledItem } from "@/utils/api/requests";
import { formatCurrency, formatDate } from "@/utils/functions";
import { Button } from "@/components/vendors";
import { DeleteConfirmationAlert } from "@/components/base/RootDrawer/components/ShowUpcomingTransaction/DeleteConfirmationAlert";

export const ShowUpcomingTransaction = () => {
  const today = new Date();

  const transactionID = useBaseUIStore((state) => state.transactionID);

  const {
    data: scheduleTransactionData,
    isError: scheduleTransactionFetchingError,
    isLoading: scheduleTransactionFetchingLoading,
  } = useQuery({
    ...createFetchScheduledItem(transactionID ?? "", {}),
    enabled: !!transactionID,
  });

  const {
    accountsMap,
    categoriesMap,
    isLoading: isFetchLoading,
    isError: isFetchError,
  } = useAccountsAndCategories();

  const isError = isFetchError || scheduleTransactionFetchingError;
  const isLoading = isFetchLoading || scheduleTransactionFetchingLoading;

  if (!transactionID) {
    return null;
  }

  const displayedContext: Record<string, string | string[]>[] = [
    {
      title: "Account",
      value:
        accountsMap.get(scheduleTransactionData?.data.accountId ?? "") ?? "",
    },
    {
      title: "Category",
      value:
        categoriesMap.get(scheduleTransactionData?.data.categoryId ?? "") ?? "",
    },
    {
      title: "Frequency",
      value: scheduleTransactionData?.data.frequency ?? "-",
    },
    {
      title: "Kind",
      value: scheduleTransactionData?.data.kind ?? "-",
    },
  ];

  const handleShowEditForm = () => {
    baseUIStoreActions.setDisplayedDrawerOptions("edit_transaction");
  };

  if (isError) {
    return <ErrorLoadingDrawerComponent drawerName="upcoming transaction" />;
  }

  if (isLoading) {
    return <LoadingDetails />;
  }

  return (
    <div className="flex flex-col h-full overflow-auto relative">
      <div className="sticky top-0 flex flex-col gap-2 bg-background p-4 pb-0 ">
        <h2 className="text-h5">Scheduled Transaction Details</h2>
        <h3 className="text-h6">{scheduleTransactionData?.data.name ?? ""}</h3>
        <p className="text-body-small">
          Next occurrence:{" "}
          {formatDate({
            date:
              scheduleTransactionData?.data.nextDueDate ?? today.getSeconds(),
            showYear: true,
          })}
        </p>
        <p className="text-h4 py-4">
          {formatCurrency({
            amount: scheduleTransactionData?.data.amount ?? 0,
            currency: scheduleTransactionData?.data.currency ?? "CAD",
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
      <div className="bg-background-secondary p-4 flex gap-1 justify-end mt-auto sticky bottom-0">
        <DeleteConfirmationAlert
          transaction={scheduleTransactionData?.data.name ?? ""}
          transactionID={scheduleTransactionData?.data.id ?? ""}
        />
        <Button
          onClick={handleShowEditForm}
          onKeyPress={(e: React.KeyboardEvent<HTMLButtonElement>) =>
            e.key === "Enter" && handleShowEditForm()
          }
        >
          Edit Transaction
        </Button>
      </div>
    </div>
  );
};
