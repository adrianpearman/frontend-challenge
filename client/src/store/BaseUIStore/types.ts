import type { CurrencyCode } from "@/utils/types";

type BaseUIActions = {
  setSelectedCurrency: (currency: CurrencyCode) => void;
  setShowApplicationDrawer: (state: boolean) => void;
};

export type BaseUIState = {
  selectedCurrency: CurrencyCode;
  showApplicationDrawer: boolean;
};

export type BaseUIStore = BaseUIState & {
  actions: BaseUIActions;
};
