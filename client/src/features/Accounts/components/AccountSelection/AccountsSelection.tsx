import { useState } from "react";
import { EllipsisVerticalIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteAccountMutation } from "@/utils/api/requests";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/vendors";
import {
  LoadingOverviewItems,
  OverviewItem,
  OverviewItemsContainer,
  SectionError,
  TruncateText,
} from "@/components/base";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import { cn, formatDate, networkErrorMessage } from "@/utils/functions";
import type { Account } from "@/utils/types";
import { AccountSelectionDialog } from "./AccountSelectionDialog";

type AccountSelectionProps = {
  accounts: Account[];
  currentAccount: string;
  isError: boolean;
  isLoading: boolean;
  updateStateFn: (accountId: string) => void;
};

export const AccountSelection = ({
  accounts,
  currentAccount,
  isError,
  isLoading,
  updateStateFn,
}: AccountSelectionProps) => {
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const { mutateAsync, isPending } = useMutation(deleteAccountMutation());

  const handleDeleteAccount = async () => {
    if (!accountToDelete) return;
    try {
      await mutateAsync({ id: accountToDelete.id });
      toast.success("Account deleted.");
      if (currentAccount === accountToDelete.id) updateStateFn("");
      setAccountToDelete(null);
    } catch (error) {
      toast.error(
        networkErrorMessage({
          error,
          fallback: "Could not delete the account.",
        }),
      );
    }
  };

  if (isLoading) {
    return <LoadingOverviewItems />;
  }

  if (isError) {
    return <SectionError message="Could not load accounts." />;
  }

  return (
    <>
      <OverviewItemsContainer className="flex-wrap overflow-x ">
        {accounts.map((account) => {
          const {
            archivedAt,
            balance,
            color,
            id,
            institution,
            name,
            openedAt,
          } = account;

          const isSelected = currentAccount === id;

          const titleContent = `${institution ? `${institution} - ${name}` : name}`;

          return (
            <OverviewItem
              className={cn(
                "cursor-pointer min-w-[calc(33%-16px)]",
                color && "bg-(--content-color)/10",
                isSelected && "bg-brand-ghost-green border-brand-slate-green",
              )}
              content={balance?.posted ?? 0}
              currency={balance?.currency}
              key={account.id}
              onClickFn={() => updateStateFn(id)}
              pressed={isSelected}
              subContent={
                <p className="text-body-small">
                  Opened:{" "}
                  {formatDate({
                    date: openedAt,
                    showYear: true,
                  })}
                </p>
              }
              style={color ? { "--content-color": color } : undefined}
              tabIndex={0}
              title={
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 min-w-0 max-w-3/4">
                    <TruncateText
                      className="text-body-small"
                      content={titleContent ?? ""}
                      width="max-w-full"
                    />
                    {archivedAt !== null && (
                      <span className="shrink-0 rounded-sm bg-background-secondary px-1.5 py-0.5 text-body-small text-text-secondary">
                        Archived
                      </span>
                    )}
                  </div>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            aria-label={`Actions for ${name}`}
                            variant="secondary"
                            size="icon-sm"
                          >
                            <EllipsisVerticalIcon />
                          </Button>
                        }
                      />
                      <DropdownMenuContent
                        align="end"
                        className="flex flex-col gap-2 p-1"
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            baseUIStoreActions.setAccountID(id);
                            baseUIStoreActions.openDrawer("edit_account");
                          }}
                        >
                          Edit account
                        </DropdownMenuItem>
                        {archivedAt !== null && (
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setAccountToDelete(account)}
                          >
                            Delete account
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              }
            />
          );
        })}
      </OverviewItemsContainer>
      <AccountSelectionDialog
        account={accountToDelete}
        isPending={isPending}
        onCloseFn={() => setAccountToDelete(null)}
        onConfirmFn={handleDeleteAccount}
      />
    </>
  );
};
