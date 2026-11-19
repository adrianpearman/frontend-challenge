import {
  createFetchOccurrences,
  createFetchProjectedBudget,
} from "@/utils/api/requests";
import type { CurrencyCode } from "@/utils/types";

type ProjectionQueryArgs = {
  currency?: CurrencyCode;
  from: string;
  selectedAccount: string; // "all" = every account
  to: string;
};

const accountParams = ({ currency, selectedAccount }: ProjectionQueryArgs) =>
  selectedAccount === "all"
    ? {}
    : { accountId: selectedAccount, ...(currency && { currency }) };

// Daily buckets so the overview can read the balance on any exact day; the chart rolls them up per month.
// Shared by the overview, chart and events table so they read one cached request.
export const projectedBudgetQuery = (args: ProjectionQueryArgs) =>
  createFetchProjectedBudget({
    params: {
      from: args.from,
      to: args.to,
      granularity: "day",
      ...accountParams(args),
    },
  });

export const upcomingOccurrencesQuery = (args: ProjectionQueryArgs) =>
  createFetchOccurrences({
    params: { from: args.from, to: args.to, ...accountParams(args) },
  });
