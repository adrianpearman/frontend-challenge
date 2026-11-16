import { baseApi } from "@/utils/api/baseApi";
import type {
  CurrencyCode,
  Granularity,
  IsoDate,
  ScheduledItemStatus,
} from "@/utils/types";

export type BudgetProjectionParams = {
  from?: IsoDate;
  to?: IsoDate;
  asOf?: IsoDate;
  granularity?: Granularity;
  currency?: CurrencyCode;
  accountId?: string;
  includeScheduled?: boolean;
  includeCategoryBudgets?: boolean;
};

export type ScheduledItemsParams = {
  kind?: string;
  status?: ScheduledItemStatus | string;
  accountId?: string;
  projectId?: string;
};

export type OccurrencesParams = ScheduledItemsParams & {
  from?: IsoDate;
  to?: IsoDate;
};

export const fetchProjectedBudget = (params?: BudgetProjectionParams) =>
  baseApi("/api/projections/budget", { params });
export const fetchScheduledItems = (params?: ScheduledItemsParams) =>
  baseApi("/api/scheduled-items", { params });
export const fetchScheduledItem = (id: string) =>
  baseApi(`/api/scheduled-items/${id}`);
export const fetchTransactionOccurrences = (params?: OccurrencesParams) =>
  baseApi("/api/scheduled-items/occurrences", { params });
export const fetchScheduledItemOccurrences = (
  id: string,
  params?: { from?: IsoDate; to?: IsoDate },
) => baseApi(`/api/scheduled-items/${id}/occurrences`, { params });
