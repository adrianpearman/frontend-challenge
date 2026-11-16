import { useBaseUIStore } from "@/store/BaseUIStore";
import { CurrencyDenominationMap } from "@/utils/consts";
import type { CurrencyCode } from "@/utils/types";

type FormatCurrencyArgs = {
  amount: number;
  currency?: CurrencyCode;
  format?: "short" | "long";
  showCurrency?: boolean;
};

export const formatCurrency = ({
  amount,
  currency = useBaseUIStore.getState().selectedCurrency,
  format = "long",
  showCurrency = true,
}: FormatCurrencyArgs) => {
  if (format === "short") {
    // Compact form for tight spaces like chart labels: 234900 -> "$2.3K". No currency code.
    return `${CurrencyDenominationMap[currency]}${(amount / 100).toLocaleString(
      "en-US",
      { notation: "compact", maximumFractionDigits: 1 },
    )}`;
  }

  return `${CurrencyDenominationMap[currency]}${(amount / 100).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}${showCurrency ? ` ${currency}` : ""}`;
};
