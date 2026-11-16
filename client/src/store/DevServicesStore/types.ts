export type DevServicesState = {
  /** Delay added to every targeted request, in ms (server caps at 30,000). */
  latencyMs: number;
  /** Chance (0–1) that a targeted request is forced to fail with a 500. */
  errorRate: number;
  /** API path prefixes to affect, e.g. "/api/transactions". Empty means every endpoint. */
  targets: string[];
  /** Turns off React Query's automatic retries so simulated errors show straight away. */
  disableRetries: boolean;
};

type DevServicesActions = {
  updateSettings: (settings: Partial<DevServicesState>) => void;
  resetSettings: () => void;
};

export type DevServicesStore = DevServicesState & {
  actions: DevServicesActions;
};
