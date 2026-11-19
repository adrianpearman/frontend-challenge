import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { createFetchAccounts } from "@/utils/api/requests";
import { toLocalMonth } from "@/utils/functions";
import type { Account } from "@/utils/types";

// Both optional: no `account` = all accounts, no `month` = this month.
export type ExpensesSearch = {
  account?: string;
  month?: string; // YYYY-MM
};

// The URL is user input: anything malformed is dropped.
export const validateExpensesSearch = (
  search: Record<string, unknown>,
): ExpensesSearch => ({
  account:
    typeof search.account === "string" && search.account
      ? search.account
      : undefined,
  month:
    typeof search.month === "string" &&
    /^\d{4}-(0[1-9]|1[0-2])$/.test(search.month)
      ? search.month
      : undefined,
});

export const getEarliestMonth = (accounts: Account[], accountId: string) =>
  accounts
    .filter(({ id }) => accountId === "all" || id === accountId)
    .map(({ openedAt }) => openedAt.slice(0, 7))
    .sort()[0] as string | undefined;

// Clamp to [earliest, thisMonth] so a hand-edited or stale URL still shows real data.
export const clampMonth = (
  month: string,
  earliest: string | undefined,
  latest: string,
) => {
  if (month > latest) return latest;
  if (earliest && month < earliest) return earliest;
  return month;
};

// Every Expenses component reads its filters from here; the accounts request is cached and shared.
export const useExpensesFilters = () => {
  const search = useSearch({ from: "/expenses" });
  const navigate = useNavigate({ from: "/expenses" });
  const accountsQuery = useQuery(createFetchAccounts({}));
  const accounts = accountsQuery.data?.data ?? [];

  const thisMonth = toLocalMonth();
  const selectedAccount = search.account ?? "all";
  const earliestMonth = accountsQuery.data
    ? getEarliestMonth(accounts, selectedAccount)
    : undefined;
  const currentMonth = clampMonth(
    search.month ?? thisMonth,
    earliestMonth,
    thisMonth,
  );

  return {
    accounts,
    accountsQuery,
    currency: accounts.find(({ id }) => id === selectedAccount)?.currency,
    currentMonth,
    earliestMonth,
    selectedAccount,
    thisMonth,
    setMonth: (month: string) =>
      navigate({
        search: (prev) => ({
          ...prev,
          month: month === thisMonth ? undefined : month,
        }),
      }),
    // The month is clamped on read, so switching to a newer account needs no fix-up here.
    setAccount: (id: string) =>
      navigate({
        search: (prev) => ({
          ...prev,
          account: id === "all" ? undefined : id,
        }),
      }),
  };
};
