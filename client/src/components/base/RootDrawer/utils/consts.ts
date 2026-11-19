import { AccountTypeMap, CurrencyDenominationMap } from "@/utils/consts";
import type { DropdownOption } from "@/utils/types";

// Form ids
export const ADD_EXPENSE_FORM_ID = "add-expense-form";
export const CREATE_ACCOUNT_FORM_ID = "create-account-form";
export const CREATE_CATEGORY_FORM_ID = "create-category-form";
export const CREATE_SCHEDULED_ITEM_FORM_ID = "create-scheduled-item-form";
export const EDIT_ACCOUNT_FORM_ID = "edit-account-form";
export const EDIT_SCHEDULED_TRANSACTION_FORM_ID =
  "edit-scheduled-transaction-form";
export const EDIT_TRANSACTION_FORM_ID = "edit-transaction-form";

const opts = (values: string[]): DropdownOption[] =>
  values.map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }));

// Expense
export const EXPENSE_STATUS_OPTIONS = opts(["posted", "pending"]);

// Account
export const ACCOUNT_TYPE_OPTIONS = Object.entries(AccountTypeMap).map(
  ([value, label]) => ({ value, label }),
);
export const CURRENCY_OPTIONS = Object.keys(CurrencyDenominationMap).map(
  (code) => ({ value: code, label: code }),
);
export const ARCHIVED_OPTIONS = opts(["active", "archived"]);

export type AccountTextFieldName =
  "name" | "openingBalance" | "creditLimit" | "institution" | "openedAt";

export const ACCOUNT_TEXT_FIELDS: {
  name: AccountTextFieldName;
  label: string;
  placeholder?: string;
  type?: string;
  inputMode?: "decimal";
  description?: string;
}[] = [
  { name: "name", label: "Name", placeholder: "Everyday Chequing" },
  {
    name: "openingBalance",
    label: "Opening balance",
    placeholder: "0.00",
    inputMode: "decimal",
    description: "Use a negative amount for money owed.",
  },
  {
    name: "creditLimit",
    label: "Credit limit",
    placeholder: "5000.00",
    inputMode: "decimal",
  },
  { name: "institution", label: "Institution", placeholder: "RBC" },
  { name: "openedAt", label: "Opened on", type: "date" },
];

// Category
export const CATEGORY_KIND_OPTIONS = opts(["expense", "income"]);

// Scheduled items
export const SCHEDULED_KIND_OPTIONS = opts(["bill", "income"]);
export const FREQUENCY_OPTIONS = opts([
  "once",
  "weekly",
  "biweekly",
  "monthly",
  "quarterly",
  "yearly",
]);
export const SCHEDULED_STATUS_OPTIONS = opts(["active", "paused"]);
export const AUTO_PAY_OPTIONS = opts(["yes", "no"]);
