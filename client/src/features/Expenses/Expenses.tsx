import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BaseFeatureComponent, BaseLayoutComponent } from "@/components/base";
import {
  ExpensesCharts,
  ExpensesHeader,
  ExpensesOverview,
} from "@/features/Expenses/components";
import {
  createFetchCategories,
  createFetchDashboardMetrics,
} from "@/utils/api/requests";

export const Expenses = () => {
  const [currentMonth, setCurrentMonth] = useState<string>(() =>
    new Date().toISOString().slice(0, 7),
  );
  // "all" = no account filter
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const {
    data: accountData,
    isError: accountsDataError,
    isLoading: accountsDataLoading,
  } = useQuery(createFetchDashboardMetrics({}));

  const {
    data: categoriesData,
    isError: categoriesDataError,
    isLoading: categoriesDataLoading,
  } = useQuery(createFetchCategories({}));

  const accountOptions = [
    { label: "All accounts", value: "all" },
    ...(accountData?.data ?? []).map(({ id, name }) => ({
      label: name,
      value: id,
    })),
  ];

  // Earliest month the user can navigate to: the selected account's opening
  // month, or the oldest account's when "all" is selected. ISO strings sort lexically.
  const getEarliestMonth = (accountId: string) =>
    (accountData?.data ?? [])
      .filter(({ id }) => accountId === "all" || id === accountId)
      .map(({ openedAt }) => openedAt.slice(0, 7))
      .sort()[0] as string | undefined;
  const earliestMonth = getEarliestMonth(selectedAccount);

  // Snap forward if the newly selected account opened after the viewed month.
  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId);
    const opened = getEarliestMonth(accountId);
    setCurrentMonth((month) => (opened && month < opened ? opened : month));
  };

  const accountsMap = new Map(
    (accountData === undefined ? [] : accountData.data).map(({ id, name }) => [
      id,
      name,
    ]),
  );

  const categoryMap = new Map(
    (categoriesData === undefined ? [] : categoriesData.data).map(
      (category) => [category.id, category],
    ),
  );

  const isError = accountsDataError || categoriesDataError;
  const isLoading = accountsDataLoading || categoriesDataLoading;

  console.log({
    accountData,
    // categoriesData,
    // accountsMap,
  });

  const selectedAccountCurrency = accountData?.data.find(
    ({ id }) => id === selectedAccount,
  )?.currency;

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
