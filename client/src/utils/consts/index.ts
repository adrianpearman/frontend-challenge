import type {
  AccountTypeMapType,
  CurrencyConversionMapType,
  CurrencyDenominationMapType,
} from "@/utils/types";

export const AccountTypeMap: AccountTypeMapType = {
  cash: "Cash",
  checking: "Checking",
  credit_card: "Credit Card",
  savings: "Savings",
  investment: "Investment",
};

export const CurrencyConversionMap: CurrencyConversionMapType = {
  CAD: 1,
  USD: 0.7,
  EUR: 0.63,
};

export const CurrencyDenominationMap: CurrencyDenominationMapType = {
  CAD: "$",
  USD: "$",
  EUR: "€",
};
