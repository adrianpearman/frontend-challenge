import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { BaseUIState, BaseUIStore } from "@/store/BaseUIStore/types";

const INITIAL_STATE: BaseUIState = {
  accountID: null,
  displayedDrawerOptions: null,
  selectedCurrency: "CAD",
  showApplicationDrawer: false,
  transactionID: null,
};

export const useBaseUIStore = create<BaseUIStore>()(
  devtools(
    (set) => ({
      ...INITIAL_STATE,
      actions: {
        closeDrawer: () => {
          set({
            accountID: null,
            displayedDrawerOptions: null,
            showApplicationDrawer: false,
            transactionID: null,
          });
        },
        openDrawer: (drawer) => {
          set({
            displayedDrawerOptions: drawer,
            showApplicationDrawer: true,
          });
        },
        setAccountID: (state) => {
          set({ accountID: state });
        },
        setSelectedCurrency: (state) => {
          set({ selectedCurrency: state });
        },
        setShowApplicationDrawer: (state) => {
          set({ showApplicationDrawer: state });
        },
        setTransactionID: (transaction) => {
          set({ transactionID: transaction });
        },
      },
    }),
    {
      name: "BaseUIStore",
    },
  ),
);

export const baseUIStoreActions = useBaseUIStore.getState().actions;
