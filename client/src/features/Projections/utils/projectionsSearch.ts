import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { createFetchAccounts } from "@/utils/api/requests";
import { shiftMonth, toLocalDate, toLocalMonth } from "@/utils/functions";

export const HORIZONS = [3, 6, 12] as const;
export type Horizon = (typeof HORIZONS)[number];
const DEFAULT_HORIZON: Horizon = 6;

// Both optional: no `account` = all accounts, no `horizon` = 6 months.
export type ProjectionsSearch = {
  account?: string;
  horizon?: Horizon;
};

// The URL is user input: anything malformed is dropped.
export const validateProjectionsSearch = (
  search: Record<string, unknown>,
): ProjectionsSearch => ({
  account:
    typeof search.account === "string" && search.account
      ? search.account
      : undefined,
  horizon: HORIZONS.find((h) => h === Number(search.horizon)),
});

// Last day of the month `monthsAhead` after this one, as YYYY-MM-DD.
const endOfMonthAhead = (monthsAhead: number) => {
  const [year, month] = shiftMonth(toLocalMonth(), monthsAhead + 1)
    .split("-")
    .map(Number);
  return toLocalDate(new Date(year, month - 1, 0));
};

// Every Projections component reads its filters from here; the accounts request is cached and shared.
export const useProjectionsFilters = () => {
  const search = useSearch({ from: "/projections" });
  const navigate = useNavigate({ from: "/projections" });
  const accountsQuery = useQuery(createFetchAccounts({}));
  const accounts = accountsQuery.data?.data ?? [];

  const selectedAccount = search.account ?? "all";
  const horizon = search.horizon ?? DEFAULT_HORIZON;

  return {
    accounts,
    accountsQuery,
    currency: accounts.find(({ id }) => id === selectedAccount)?.currency,
    from: toLocalDate(),
    horizon,
    selectedAccount,
    to: endOfMonthAhead(horizon),
    setAccount: (id: string) =>
      navigate({
        search: (prev) => ({ ...prev, account: id === "all" ? undefined : id }),
      }),
    setHorizon: (value: Horizon) =>
      navigate({
        search: (prev) => ({
          ...prev,
          horizon: value === DEFAULT_HORIZON ? undefined : value,
        }),
      }),
  };
};
