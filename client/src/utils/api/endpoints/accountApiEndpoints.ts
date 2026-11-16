import { baseApi } from "@/utils/api/baseApi";
import type {
  AccountType,
  CurrencyCode,
  Direction,
  IsoDate,
  TransactionStatus,
} from "@/utils/types";

// List params are comma-separated strings ("a,b"); the server splits on commas.
export type AccountsParams = {
  asOf?: IsoDate;
  includeBalances?: boolean;
  includeArchived?: boolean;
  type?: AccountType | string;
  currency?: CurrencyCode | string;
};

export type TransactionsParams = {
  page?: number;
  pageSize?: number;
  offset?: number;
  limit?: number;
  sort?: string;
  include?: string;
  accountId?: string;
  categoryId?: string;
  projectId?: string;
  scheduledItemId?: string;
  tag?: string;
  status?: TransactionStatus | string;
  from?: IsoDate;
  to?: IsoDate;
  minAmount?: number;
  maxAmount?: number;
  q?: string;
  uncategorised?: boolean;
  unassigned?: boolean;
  direction?: Direction;
  includeTransfers?: boolean;
  transfersOnly?: boolean;
  withRunningBalance?: boolean;
};

export const fetchAccounts = (params?: AccountsParams) =>
  baseApi("/api/accounts", { params });
export const fetchAccount = (id: string, params?: { asOf?: IsoDate }) =>
  baseApi(`/api/accounts/${id}`, { params });
export const fetchTransactions = (params?: TransactionsParams) =>
  baseApi("/api/transactions", { params });
export const fetchTransaction = (id: string, params?: { include?: string }) =>
  baseApi(`/api/transactions/${id}`, { params });
export const fetchTransfers = () => baseApi("/api/transfers");
export const fetchTransfer = (transferId: string) =>
  baseApi(`/api/transfers/${transferId}`);
export const fetchCategories = (params?: {
  kind?: string;
  includeArchived?: boolean;
  includeUsage?: boolean;
}) => baseApi("/api/categories", { params });
export const fetchCategory = (id: string) => baseApi(`/api/categories/${id}`);
export const fetchProjects = (params?: {
  status?: string;
  includeSummary?: boolean;
}) => baseApi("/api/projects", { params });
export const fetchProject = (id: string) => baseApi(`/api/projects/${id}`);
