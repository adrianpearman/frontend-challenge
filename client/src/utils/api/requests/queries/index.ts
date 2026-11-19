import { queryOptions } from "@tanstack/react-query";
import type {
  Account,
  Balance,
  BalanceHistory,
  BalanceSnapshot,
  BaseQueryArgs,
  BudgetProjection,
  CashFlowReport,
  Category,
  CategoryBreakdownReport,
  Collection,
  MonthlyExpensesReport,
  Occurrence,
  Project,
  ProjectSummary,
  ScheduledItem,
  Single,
  Transaction,
  Transfer,
  UpcomingResponse,
} from "@/utils/types";
import * as api from "@/utils/api/endpoints";
import {
  DEFAULT_STALE_TIME,
  DEFAULT_REFRESH_INTERVAL,
} from "@/utils/api/consts";

type QueryArgs<P = undefined> = BaseQueryArgs & { params?: P };

// Shared shape for every query: params are part of the key so each filter set caches separately.
const createQuery = <T, P>(
  key: string,
  fetcher: (params?: P) => Promise<{ data: T }>,
  {
    params,
    refetchInterval = DEFAULT_REFRESH_INTERVAL,
    staleTime = DEFAULT_STALE_TIME,
  }: QueryArgs<P>,
) =>
  queryOptions({
    queryKey: [key, params ?? {}],
    queryFn: async (): Promise<T> => (await fetcher(params)).data,
    refetchInterval,
    staleTime,
  });

export const createFetchAccount = (
  id: string,
  args: QueryArgs<{ asOf?: string }>,
) =>
  createQuery<Single<Account>, { asOf?: string }>(
    `fetchAccount:${id}`,
    (p) => api.fetchAccount(id, p),
    args,
  );

export const createFetchAccountBalance = (
  id: string,
  args: QueryArgs<{ asOf?: string }>,
) =>
  createQuery<Single<Balance>, { asOf?: string }>(
    `fetchAccountBalance:${id}`,
    (p) => api.fetchAccountBalance(id, p),
    args,
  );

export const createFetchAccountsBalances = (
  args: QueryArgs<Parameters<typeof api.fetchAccountsBalances>[0]>,
) =>
  createQuery<
    Single<BalanceSnapshot>,
    Parameters<typeof api.fetchAccountsBalances>[0]
  >("fetchAccountsBalances", api.fetchAccountsBalances, args);

export const createFetchBalanceHistory = (
  id: string,
  args: QueryArgs<Parameters<typeof api.fetchBalanceHistory>[1]>,
) =>
  createQuery<
    Single<BalanceHistory>,
    Parameters<typeof api.fetchBalanceHistory>[1]
  >(`fetchBalanceHistory:${id}`, (p) => api.fetchBalanceHistory(id, p), args);

export const createFetchCashFlow = (
  args: QueryArgs<Parameters<typeof api.fetchCashFlow>[0]>,
) =>
  createQuery<CashFlowReport, Parameters<typeof api.fetchCashFlow>[0]>(
    "fetchCashFlow",
    api.fetchCashFlow,
    args,
  );

export const createFetchCategories = (
  args: QueryArgs<Parameters<typeof api.fetchCategories>[0]>,
) =>
  createQuery<Collection<Category>, Parameters<typeof api.fetchCategories>[0]>(
    "fetchCategories",
    api.fetchCategories,
    args,
  );

export const createFetchCategory = (id: string, args: QueryArgs) =>
  createQuery<Single<Category>, undefined>(
    `fetchCategory:${id}`,
    () => api.fetchCategory(id),
    args,
  );

export const createFetchCategoryBreakdown = (
  args: QueryArgs<Parameters<typeof api.fetchCategoryBreakdown>[0]>,
) =>
  createQuery<
    CategoryBreakdownReport,
    Parameters<typeof api.fetchCategoryBreakdown>[0]
  >("fetchCategoryBreakdown", api.fetchCategoryBreakdown, args);

export const createFetchAccounts = (
  args: QueryArgs<api.AccountsParams>,
) =>
  createQuery<Collection<Account>, api.AccountsParams>(
    "fetchAccounts",
    api.fetchAccounts,
    args,
  );

// Report/projection queries (MonthlyExpenses, Occurrences, CategoryBreakdown, CashFlow, ProjectedBudget) return the object unwrapped, not in `data`.
export const createFetchMonthlyExpenses = (
  args: QueryArgs<Parameters<typeof api.fetchExpensesPerProject>[0]>,
) =>
  createQuery<
    MonthlyExpensesReport,
    Parameters<typeof api.fetchExpensesPerProject>[0]
  >("fetchMonthlyExpenses", api.fetchExpensesPerProject, args);

export const createFetchOccurrences = (
  args: QueryArgs<api.OccurrencesParams>,
) =>
  createQuery<UpcomingResponse, api.OccurrencesParams>(
    "fetchOccurrences",
    api.fetchTransactionOccurrences,
    args,
  );

export const createFetchProject = (id: string, args: QueryArgs) =>
  createQuery<Single<Project>, undefined>(
    `fetchProject:${id}`,
    () => api.fetchProject(id),
    args,
  );

export const createFetchProjectSummary = (id: string, args: QueryArgs) =>
  createQuery<Single<ProjectSummary>, undefined>(
    `fetchProjectSummary:${id}`,
    () => api.fetchProjectedSpending(id),
    args,
  );

export const createFetchProjectedBudget = (
  args: QueryArgs<api.BudgetProjectionParams>,
) =>
  createQuery<BudgetProjection, api.BudgetProjectionParams>(
    "fetchProjectedBudget",
    api.fetchProjectedBudget,
    args,
  );

export const createFetchProjects = (
  args: QueryArgs<Parameters<typeof api.fetchProjects>[0]>,
) =>
  createQuery<Collection<Project>, Parameters<typeof api.fetchProjects>[0]>(
    "fetchProjects",
    api.fetchProjects,
    args,
  );

export const createFetchRecentTransactions = (
  args: QueryArgs<api.TransactionsParams>,
) =>
  createQuery<Collection<Transaction>, api.TransactionsParams>(
    "fetchTransactions",
    api.fetchTransactions,
    args,
  );

export const createFetchScheduledItem = (id: string, args: QueryArgs) =>
  createQuery<Single<ScheduledItem>, undefined>(
    `fetchScheduledItem:${id}`,
    () => api.fetchScheduledItem(id),
    args,
  );

export const createFetchScheduledItemOccurrences = (
  id: string,
  args: QueryArgs<Parameters<typeof api.fetchScheduledItemOccurrences>[1]>,
) =>
  createQuery<
    Collection<Occurrence>,
    Parameters<typeof api.fetchScheduledItemOccurrences>[1]
  >(
    `fetchScheduledItemOccurrences:${id}`,
    (p) => api.fetchScheduledItemOccurrences(id, p),
    args,
  );

export const createFetchScheduledTransactions = (
  args: QueryArgs<api.ScheduledItemsParams>,
) =>
  createQuery<Collection<ScheduledItem>, api.ScheduledItemsParams>(
    "fetchScheduledItems",
    api.fetchScheduledItems,
    args,
  );

export const createFetchTransaction = (
  id: string,
  args: QueryArgs<{ include?: string }>,
) =>
  createQuery<Single<Transaction>, { include?: string }>(
    `fetchTransaction:${id}`,
    (p) => api.fetchTransaction(id, p),
    args,
  );

export const createFetchTransfer = (transferId: string, args: QueryArgs) =>
  createQuery<Single<Transfer>, undefined>(
    `fetchTransfer:${transferId}`,
    () => api.fetchTransfer(transferId),
    args,
  );

export const createFetchTransfers = (args: QueryArgs) =>
  createQuery<Collection<Transfer>, undefined>(
    "fetchTransfers",
    api.fetchTransfers,
    args,
  );
