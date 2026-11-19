import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BaseFeatureComponent,
  BaseLayoutComponent,
  SectionError,
} from "@/components/base";
import { Skeleton } from "@/components/vendors";
import {
  ExpensesCharts,
  ExpensesHeader,
  ExpensesOverview,
} from "@/features/Expenses/components";
import { createFetchAccounts } from "@/utils/api/requests";
import { toLocalMonth } from "@/utils/functions";
import type { Account } from "@/utils/types";

const getEarliestMonth = ({
  accountId,
  data,
}: {
  accountId: string;
  data: Account[];
}) =>
  data
    .filter(({ id }) => accountId === "all" || id === accountId)
    .map(({ openedAt }) => openedAt.slice(0, 7))
    .sort()[0] as string | undefined;

export const Expenses = () => {
  const [currentMonth, setCurrentMonth] = useState<string>(() =>
    toLocalMonth(),
  );
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const { data, isError, isLoading } = useQuery(createFetchAccounts({}));

  const accountOptions = [
    { label: "All accounts", value: "all" },
    ...(data?.data ?? []).map(({ id, name }) => ({
      label: name,
      value: id,
    })),
  ];

  const earliestMonth = getEarliestMonth({
    accountId: selectedAccount,
    data: data?.data ?? [],
  });

  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId);
    const opened = getEarliestMonth({
      accountId,
      data: data?.data ?? [],
    });
    setCurrentMonth((month) => (opened && month < opened ? opened : month));
  };

  const selectedAccountCurrency = data?.data.find(
    ({ id }) => id === selectedAccount,
  )?.currency;

  if (isLoading) {
    return (
      <BaseLayoutComponent>
        <BaseFeatureComponent>
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-32" />
          <Skeleton className="h-72" />
        </BaseFeatureComponent>
      </BaseLayoutComponent>
    );
  }

  if (isError) {
    return (
      <BaseLayoutComponent>
        <BaseFeatureComponent>
          <SectionError message="Could not load accounts." />
        </BaseFeatureComponent>
      </BaseLayoutComponent>
    );
  }

  return (
    <BaseLayoutComponent>
      <BaseFeatureComponent>
        <ExpensesHeader
          accountOptions={accountOptions}
          currentMonth={currentMonth}
          earliestMonth={earliestMonth}
          selectedAccount={selectedAccount}
          setCurrentMonth={setCurrentMonth}
          setSelectedAccount={handleAccountChange}
        />
        <ExpensesOverview
          currentMonth={currentMonth}
          earliestMonth={earliestMonth}
          selectedAccount={selectedAccount}
          currency={selectedAccountCurrency}
        />
        <ExpensesCharts
          currency={selectedAccountCurrency}
          currentMonth={currentMonth}
          earliestMonth={earliestMonth}
          selectedAccount={selectedAccount}
        />
      </BaseFeatureComponent>
    </BaseLayoutComponent>
  );
};
