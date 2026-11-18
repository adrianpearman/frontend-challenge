import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BaseFeatureComponent, BaseLayoutComponent } from "@/components/base";
import {
  ExpensesCharts,
  ExpensesHeader,
  ExpensesOverview,
} from "@/features/Expenses/components";
import { createFetchDashboardMetrics } from "@/utils/api/requests";
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
    new Date().toISOString().slice(0, 7),
  );
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const { data, isError, isLoading } = useQuery(
    createFetchDashboardMetrics({}),
  );

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
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>isError</div>;
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
