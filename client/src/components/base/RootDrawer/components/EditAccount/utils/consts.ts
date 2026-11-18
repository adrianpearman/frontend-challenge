export const FORM_ID = "edit-account-form";

export const toCents = (v: string) => Math.round(Number(v) * 100);
export const toDollars = (minor: number) => (minor / 100).toFixed(2);

export type TextFieldName =
  | "name"
  | "openingBalance"
  | "creditLimit"
  | "institution"
  | "openedAt"
  | "color";

export const TEXT_FIELDS: {
  name: TextFieldName;
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
  { name: "color", label: "Colour", placeholder: "#2563eb" },
];
