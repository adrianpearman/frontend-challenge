import { baseApi } from "@/utils/api/baseApi";
import type {
  Account,
  Category,
  IsoDate,
  Minor,
  Project,
  ScheduledItem,
  Transaction,
  TransactionStatus,
} from "@/utils/types";

// shortcut: bodies are Partial<entity>; the server validates exact shape and returns 422.
type Body<T> = Partial<Omit<T, "id" | "createdAt" | "updatedAt">>;

export const createAccount = (body: Body<Account>) =>
  baseApi.post("/api/accounts", body);
export const updateAccount = (id: string, body: Body<Account>) =>
  baseApi.patch(`/api/accounts/${id}`, body);
export const deleteAccount = (id: string, force = false) =>
  baseApi.delete(`/api/accounts/${id}`, { params: { force } });

export const createTransaction = (body: Body<Transaction>) =>
  baseApi.post("/api/transactions", body);
export const createTransactionsBulk = (transactions: Body<Transaction>[]) =>
  baseApi.post("/api/transactions/bulk", { transactions });
export const updateTransactionsBulk = (
  ids: string[],
  patch: Partial<
    Pick<Transaction, "categoryId" | "projectId" | "status" | "tags">
  >,
) => baseApi.post("/api/transactions/bulk-update", { ids, patch });
export const updateTransaction = (id: string, body: Body<Transaction>) =>
  baseApi.patch(`/api/transactions/${id}`, body);
export const deleteTransaction = (id: string, force = false) =>
  baseApi.delete(`/api/transactions/${id}`, { params: { force } });

export const createTransfer = (body: {
  fromAccountId: string;
  toAccountId: string;
  amount: Minor;
  date: IsoDate;
  description?: string;
  notes?: string;
  status?: TransactionStatus;
}) => baseApi.post("/api/transfers", body);
export const deleteTransfer = (transferId: string) =>
  baseApi.delete(`/api/transfers/${transferId}`);

export const createCategory = (body: Body<Category>) =>
  baseApi.post("/api/categories", body);
export const updateCategory = (id: string, body: Body<Category>) =>
  baseApi.patch(`/api/categories/${id}`, body);
export const deleteCategory = (
  id: string,
  params?: { force?: boolean; reassignTo?: string },
) => baseApi.delete(`/api/categories/${id}`, { params });

export const createProject = (body: Body<Project>) =>
  baseApi.post("/api/projects", body);
export const updateProject = (id: string, body: Body<Project>) =>
  baseApi.patch(`/api/projects/${id}`, body);
export const deleteProject = (id: string) =>
  baseApi.delete(`/api/projects/${id}`);

export const createScheduledItem = (body: Body<ScheduledItem>) =>
  baseApi.post("/api/scheduled-items", body);
export const updateScheduledItem = (id: string, body: Body<ScheduledItem>) =>
  baseApi.patch(`/api/scheduled-items/${id}`, body);
export const deleteScheduledItem = (id: string) =>
  baseApi.delete(`/api/scheduled-items/${id}`);
export const postScheduledOccurrence = (
  id: string,
  body: {
    date: IsoDate;
    amount?: Minor;
    status?: TransactionStatus;
    description?: string;
    notes?: string;
  },
) => baseApi.post(`/api/scheduled-items/${id}/post`, body);
export const skipScheduledOccurrence = (id: string, date: IsoDate) =>
  baseApi.post(`/api/scheduled-items/${id}/skip`, { date });
export const unskipScheduledOccurrence = (id: string, date: IsoDate) =>
  baseApi.post(`/api/scheduled-items/${id}/unskip`, { date });
