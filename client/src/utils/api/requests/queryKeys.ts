// Hierarchical query keys: [domain, scope, ...ids]. createQuery appends the params object.
// Invalidating a prefix clears everything under it, e.g. queryKeys.accounts.all
// matches every list, detail, balance and history query for accounts.
export const queryKeys = {
  accounts: {
    all: ["accounts"] as const,
    list: () => [...queryKeys.accounts.all, "list"] as const,
    detail: (id: string) => [...queryKeys.accounts.all, "detail", id] as const,
    balance: (id: string) =>
      [...queryKeys.accounts.all, "balance", id] as const,
    balances: () => [...queryKeys.accounts.all, "balances"] as const,
    history: (id: string) =>
      [...queryKeys.accounts.all, "history", id] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: () => [...queryKeys.categories.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.categories.all, "detail", id] as const,
  },
  projects: {
    all: ["projects"] as const,
    list: () => [...queryKeys.projects.all, "list"] as const,
    detail: (id: string) => [...queryKeys.projects.all, "detail", id] as const,
    summary: (id: string) =>
      [...queryKeys.projects.all, "summary", id] as const,
  },
  scheduledItems: {
    all: ["scheduledItems"] as const,
    list: () => [...queryKeys.scheduledItems.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.scheduledItems.all, "detail", id] as const,
    // Occurrences are generated from scheduled items, so they live under them.
    occurrences: () =>
      [...queryKeys.scheduledItems.all, "occurrences"] as const,
    itemOccurrences: (id: string) =>
      [...queryKeys.scheduledItems.all, "occurrences", id] as const,
  },
  transactions: {
    all: ["transactions"] as const,
    list: () => [...queryKeys.transactions.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.transactions.all, "detail", id] as const,
  },
  transfers: {
    all: ["transfers"] as const,
    list: () => [...queryKeys.transfers.all, "list"] as const,
    detail: (id: string) => [...queryKeys.transfers.all, "detail", id] as const,
  },
  // Reports aggregate transactions, accounts and scheduled items.
  reports: {
    all: ["reports"] as const,
    cashFlow: () => [...queryKeys.reports.all, "cashFlow"] as const,
    categoryBreakdown: () =>
      [...queryKeys.reports.all, "categoryBreakdown"] as const,
    monthlyExpenses: () =>
      [...queryKeys.reports.all, "monthlyExpenses"] as const,
    projectedBudget: () =>
      [...queryKeys.reports.all, "projectedBudget"] as const,
  },
};
