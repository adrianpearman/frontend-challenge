import { baseApi } from "@/utils/api/baseApi";
import type {
  CurrencyCode,
  Granularity,
  IsoDate,
  IsoMonth,
} from "@/utils/types";

export type ReportScopeParams = {
  currency?: CurrencyCode;
  accountId?: string;
  projectId?: string;
  includePending?: boolean;
  includeTransfers?: boolean;
};

export const fetchExpensesPerProject = (
  params?: ReportScopeParams & { from?: IsoMonth; to?: IsoMonth },
) => baseApi("/api/reports/monthly-expenses", { params });

export const fetchCategoryBreakdown = (
  params?: ReportScopeParams & { from?: IsoDate; to?: IsoDate },
) => baseApi("/api/reports/category-breakdown", { params });

export const fetchCashFlow = (
  params?: ReportScopeParams & {
    from?: IsoDate;
    to?: IsoDate;
    granularity?: Granularity;
  },
) => baseApi("/api/reports/cash-flow", { params });
