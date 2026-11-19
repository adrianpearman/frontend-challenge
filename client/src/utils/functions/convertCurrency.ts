import { CurrencyConversionMap } from "@/utils/consts";
import type { CurrencyCode } from "@/utils/types";

// Rates are units per 1 CAD, so go through CAD: divide out the source, multiply in the target.
export const convertCurrency = (
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
) => {
  if (from === to) return amount;
  const fromRate = CurrencyConversionMap[from];
  const toRate = CurrencyConversionMap[to];
  // shortcut: unknown currency is summed unconverted, swap for live rates if more currencies are added
  if (!fromRate || !toRate) return amount;
  return Math.round((amount / fromRate) * toRate);
};
