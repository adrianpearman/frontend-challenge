import { useBaseUIStore } from "@/store/BaseUIStore";
import { CurrencyDenominationMap } from "@/utils/consts";
import type { CurrencyCode } from "@/utils/types";

type FormatCurrencyArgs = {
  amount: number;
  currency?: CurrencyCode;
  showCurrency?: boolean;
};

export const formatCurrency = ({
  amount,
  currency = useBaseUIStore.getState().selectedCurrency,
  showCurrency = true,
}: FormatCurrencyArgs) =>
  `${CurrencyDenominationMap[currency]}${(amount / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}${showCurrency ? ` ${currency}` : ""}`;
