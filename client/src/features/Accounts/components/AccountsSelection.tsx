import type { Dispatch, SetStateAction } from "react";
import {
  OverviewItem,
  OverviewItemsContainer,
  LoadingOverviewItem,
} from "@/components/base";
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
      <OverviewItemsContainer>
        <LoadingOverviewItem />
        <LoadingOverviewItem />
        <LoadingOverviewItem />
      </OverviewItemsContainer>
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
    <OverviewItemsContainer className="flex-wrap overflow-x ">
      {accounts.map((account) => {
        const { balance, color, id, institution, name, openedAt } = account;

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
            title={titleContent}
          />
        );
      })}
    </OverviewItemsContainer>
  );
};
