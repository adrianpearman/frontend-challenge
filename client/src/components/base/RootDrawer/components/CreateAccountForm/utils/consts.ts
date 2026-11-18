import { AccountTypeMap, CurrencyDenominationMap } from "@/utils/consts";

export const FORM_ID = "create-account-form";
export const ACCOUNT_TYPE_OPTIONS = Object.entries(AccountTypeMap).map(
  ([value, label]) => ({ value, label }),
);
export const CURRENCY_OPTIONS = Object.keys(CurrencyDenominationMap).map(
  (code) => ({ value: code, label: code }),
);
