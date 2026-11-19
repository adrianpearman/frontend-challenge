import { createFetchMonthlyExpenses } from "@/utils/api/requests";
import { shiftMonth } from "@/utils/functions";
import type { CurrencyCode } from "@/utils/types";

type ExpensesReportArgs = {
  currency?: CurrencyCode;
  currentMonth: string; // YYYY-MM
  earliestMonth?: string; // YYYY-MM, undefined while accounts load
  selectedAccount: string; // "all" = every account
};

// Shared by the overview and the charts so both read one cached request:
// up to six months ending at currentMonth, never before the earliest account opened.
export const expensesReportQuery = ({
  currency,
  currentMonth,
  earliestMonth,
  selectedAccount,
}: ExpensesReportArgs) => {
  const sixMonthsAgo = shiftMonth(currentMonth, -5);
  const from =
    earliestMonth && earliestMonth > sixMonthsAgo
      ? earliestMonth
      : sixMonthsAgo;

  return {
    ...createFetchMonthlyExpenses({
      params: {
        from,
        to: currentMonth,
        ...(selectedAccount !== "all" && {
          accountId: selectedAccount,
          currency,
        }),
      },
    }),
    enabled: earliestMonth !== undefined,
  };
};
