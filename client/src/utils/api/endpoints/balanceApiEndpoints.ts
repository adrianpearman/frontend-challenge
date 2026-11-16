import { baseApi } from "@/utils/api/baseApi";
import type { Granularity, IsoDate } from "@/utils/types";

export const fetchAccountsBalances = (params?: {
  asOf?: IsoDate;
  includeArchived?: boolean;
}) => baseApi("/api/accounts/balances", { params });

export const fetchAccountBalance = (id: string, params?: { asOf?: IsoDate }) =>
  baseApi(`/api/accounts/${id}/balance`, { params });

export const fetchBalanceHistory = (
  id: string,
  params?: { from?: IsoDate; to?: IsoDate; granularity?: Granularity },
) => baseApi(`/api/accounts/${id}/balance-history`, { params });
