import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type {
  DevServicesState,
  DevServicesStore,
} from "@/store/DevServicesStore/types";

export const DEV_SERVICES_INITIAL_STATE: DevServicesState = {
  latencyMs: 0,
  errorRate: 0,
  targets: [],
  disableRetries: false,
};

export const useDevServicesStore = create<DevServicesStore>()(
  devtools(
    persist(
      (set) => ({
        ...DEV_SERVICES_INITIAL_STATE,
        actions: {
          updateSettings: (settings) => set(settings),
          resetSettings: () => set(DEV_SERVICES_INITIAL_STATE),
        },
      }),
      {
        name: "dev-services-settings",
        // Persist values only; actions are recreated on load.
        partialize: ({ actions: _actions, ...state }) => state,
      },
    ),
    { name: "DevServicesStore" },
  ),
);

export const devServicesStoreActions = useDevServicesStore.getState().actions;
