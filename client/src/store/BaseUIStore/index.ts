import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { BaseUIState, BaseUIStore } from "@/store/BaseUIStore/types";

const INITIAL_STATE: BaseUIState = {
  selectedCurrency: "CAD",
  showApplicationDrawer: false,
};

export const useBaseUIStore = create<BaseUIStore>()(
  devtools(
    (set) => ({
      ...INITIAL_STATE,
      actions: {
        setSelectedCurrency: (state) => {
          set({ selectedCurrency: state });
        },
        setShowApplicationDrawer: (state) => {
          set({ showApplicationDrawer: state });
        },
      },
    }),
    {
      name: "BaseUIStore",
    },
  ),
);

export const baseUIStoreActions = useBaseUIStore.getState().actions;
