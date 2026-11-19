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
import { queryKeys } from "@/utils/api/requests/queryKeys";
import {
  DEFAULT_STALE_TIME,
  DEFAULT_REFRESH_INTERVAL,
} from "@/utils/api/consts";

type QueryArgs<P = undefined> = BaseQueryArgs & { params?: P };

// Shared shape for every query: params are appended to the key so each filter set caches separately.
const createQuery = <T, P>(
  key: readonly unknown[],
  fetcher: (params?: P) => Promise<{ data: T }>,
  {
    params,
    refetchInterval = DEFAULT_REFRESH_INTERVAL,
    staleTime = DEFAULT_STALE_TIME,
  }: QueryArgs<P>,
) =>
  queryOptions({
    queryKey: [...key, params ?? {}],
    queryFn: async (): Promise<T> => (await fetcher(params)).data,
    refetchInterval,
    staleTime,
  });

export const createFetchAccount = (
  id: string,
  args: QueryArgs<{ asOf?: string }>,
) =>
  createQuery<Single<Account>, { asOf?: string }>(
    queryKeys.accounts.detail(id),
    (p) => api.fetchAccount(id, p),
    args,
  );

export const createFetchAccountBalance = (
  id: string,
  args: QueryArgs<{ asOf?: string }>,
) =>
  createQuery<Single<Balance>, { asOf?: string }>(
    queryKeys.accounts.balance(id),
    (p) => api.fetchAccountBalance(id, p),
    args,
  );

export const createFetchAccountsBalances = (
  args: QueryArgs<Parameters<typeof api.fetchAccountsBalances>[0]>,
) =>
  createQuery<
    Single<BalanceSnapshot>,
    Parameters<typeof api.fetchAccountsBalances>[0]
  >(queryKeys.accounts.balances(), api.fetchAccountsBalances, args);

export const createFetchBalanceHistory = (
  id: string,
  args: QueryArgs<Parameters<typeof api.fetchBalanceHistory>[1]>,
) =>
  createQuery<
    Single<BalanceHistory>,
    Parameters<typeof api.fetchBalanceHistory>[1]
  >(
    queryKeys.accounts.history(id),
    (p) => api.fetchBalanceHistory(id, p),
    args,
  );

export const createFetchCashFlow = (
  args: QueryArgs<Parameters<typeof api.fetchCashFlow>[0]>,
) =>
  createQuery<CashFlowReport, Parameters<typeof api.fetchCashFlow>[0]>(
    queryKeys.reports.cashFlow(),
    api.fetchCashFlow,
    args,
  );

export const createFetchCategories = (
  args: QueryArgs<Parameters<typeof api.fetchCategories>[0]>,
) =>
  createQuery<Collection<Category>, Parameters<typeof api.fetchCategories>[0]>(
    queryKeys.categories.list(),
    api.fetchCategories,
    args,
  );

export const createFetchCategory = (id: string, args: QueryArgs) =>
  createQuery<Single<Category>, undefined>(
    queryKeys.categories.detail(id),
    () => api.fetchCategory(id),
    args,
  );

export const createFetchCategoryBreakdown = (
  args: QueryArgs<Parameters<typeof api.fetchCategoryBreakdown>[0]>,
) =>
  createQuery<
    CategoryBreakdownReport,
    Parameters<typeof api.fetchCategoryBreakdown>[0]
  >(queryKeys.reports.categoryBreakdown(), api.fetchCategoryBreakdown, args);

export const createFetchAccounts = (args: QueryArgs<api.AccountsParams>) =>
  createQuery<Collection<Account>, api.AccountsParams>(
    queryKeys.accounts.list(),
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
  >(queryKeys.reports.monthlyExpenses(), api.fetchExpensesPerProject, args);

export const createFetchOccurrences = (
  args: QueryArgs<api.OccurrencesParams>,
) =>
  createQuery<UpcomingResponse, api.OccurrencesParams>(
    queryKeys.scheduledItems.occurrences(),
    api.fetchTransactionOccurrences,
    args,
  );

export const createFetchProject = (id: string, args: QueryArgs) =>
  createQuery<Single<Project>, undefined>(
    queryKeys.projects.detail(id),
    () => api.fetchProject(id),
    args,
  );

export const createFetchProjectSummary = (id: string, args: QueryArgs) =>
  createQuery<Single<ProjectSummary>, undefined>(
    queryKeys.projects.summary(id),
    () => api.fetchProjectedSpending(id),
    args,
  );

export const createFetchProjectedBudget = (
  args: QueryArgs<api.BudgetProjectionParams>,
) =>
  createQuery<BudgetProjection, api.BudgetProjectionParams>(
    queryKeys.reports.projectedBudget(),
    api.fetchProjectedBudget,
    args,
  );

export const createFetchProjects = (
  args: QueryArgs<Parameters<typeof api.fetchProjects>[0]>,
) =>
  createQuery<Collection<Project>, Parameters<typeof api.fetchProjects>[0]>(
    queryKeys.projects.list(),
    api.fetchProjects,
    args,
  );

export const createFetchRecentTransactions = (
  args: QueryArgs<api.TransactionsParams>,
) =>
  createQuery<Collection<Transaction>, api.TransactionsParams>(
    queryKeys.transactions.list(),
    api.fetchTransactions,
    args,
  );

export const createFetchScheduledItem = (id: string, args: QueryArgs) =>
  createQuery<Single<ScheduledItem>, undefined>(
    queryKeys.scheduledItems.detail(id),
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
    queryKeys.scheduledItems.itemOccurrences(id),
    (p) => api.fetchScheduledItemOccurrences(id, p),
    args,
  );

export const createFetchScheduledTransactions = (
  args: QueryArgs<api.ScheduledItemsParams>,
) =>
  createQuery<Collection<ScheduledItem>, api.ScheduledItemsParams>(
    queryKeys.scheduledItems.list(),
    api.fetchScheduledItems,
    args,
  );

export const createFetchTransaction = (
  id: string,
  args: QueryArgs<{ include?: string }>,
) =>
  createQuery<Single<Transaction>, { include?: string }>(
    queryKeys.transactions.detail(id),
    (p) => api.fetchTransaction(id, p),
    args,
  );

export const createFetchTransfer = (transferId: string, args: QueryArgs) =>
  createQuery<Single<Transfer>, undefined>(
    queryKeys.transfers.detail(transferId),
    () => api.fetchTransfer(transferId),
    args,
  );

export const createFetchTransfers = (args: QueryArgs) =>
  createQuery<Collection<Transfer>, undefined>(
    queryKeys.transfers.list(),
    api.fetchTransfers,
    args,
  );
