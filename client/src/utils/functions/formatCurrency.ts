import { CurrencyDenominationMap } from "@/utils/consts";
import type { CurrencyCode } from "@/utils/types";

type FormatCurrencyArgs = {
  amount: number;
  currency?: CurrencyCode;
};

export const formatCurrency = ({
  amount,
  currency = "CAD",
}: FormatCurrencyArgs) =>
  `${CurrencyDenominationMap[currency]}${(amount / 100).toFixed(2)} ${currency}`;
