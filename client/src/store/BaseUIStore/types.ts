import type { CurrencyCode } from "@/utils/types";

type DisplayedDrawerOptions =
  | "add_account"
  | "add_category"
  | "add_expense"
  | "show_account"
  | "show_transaction"
  | "show_upcoming"
  | null;

type BaseUIActions = {
  closeDrawer: () => void;
  openDrawer: (drawer: DisplayedDrawerOptions) => void;
  setAccountID: (transaction: string) => void;
  setDisplayedDrawerOptions: (transaction: DisplayedDrawerOptions) => void;
  setSelectedCurrency: (currency: CurrencyCode) => void;
  setShowApplicationDrawer: (state: boolean) => void;
  setTransactionID: (transaction: string) => void;
};

export type BaseUIState = {
  accountID: string | null;
  displayedDrawerOptions: DisplayedDrawerOptions;
  selectedCurrency: CurrencyCode;
  showApplicationDrawer: boolean;
  transactionID: string | null;
};

export type BaseUIStore = BaseUIState & {
  actions: BaseUIActions;
};
