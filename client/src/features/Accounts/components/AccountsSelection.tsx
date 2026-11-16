import type { Dispatch, SetStateAction } from "react";
import { BaseOverviewItem, LoadingOverviewItem } from "@/components/base";
import type { Account } from "@/utils/types";
import { cn, formatDate } from "@/utils/functions";

type AccountSelectionProps = {
  accounts: Account[];
  currentAccount: string;
  isError: boolean;
  isLoading: boolean;
  updateStateFn: Dispatch<SetStateAction<string>>;
};

export const AccountSelection = ({
  accounts,
  currentAccount,
  isError,
  isLoading,
  updateStateFn,
}: AccountSelectionProps) => {
  if (isLoading) {
    return (
      <div className="flex gap-2">
        <LoadingOverviewItem />
        <LoadingOverviewItem />
        <LoadingOverviewItem />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-body-small text-text-error">
        Could not load accounts.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap overflow-x gap-2">
      {accounts.map((account) => {
        const { balance, color, id, institution, name, openedAt } = account;

        const isSelected = currentAccount === id;

        const titleContent = `${institution ? `${institution} - ${name}` : name}`;

        return (
          <BaseOverviewItem
            amount={balance?.posted ?? 0}
            className={cn(
              "cursor-pointer min-w-[calc(33%-16px)]",
              color && "bg-(--account-color)/10",
              isSelected && "bg-brand-ghost-green border-brand-slate-green",
            )}
            content={
              <p className="text-body-small">
                Opened:{" "}
                {formatDate({
                  date: openedAt,
                  showYear: true,
                })}
              </p>
            }
            key={account.id}
            onClickFn={() => updateStateFn(id)}
            style={color ? { "--account-color": color } : undefined}
            title={titleContent}
          />
        );
      })}
    </div>
  );
};
