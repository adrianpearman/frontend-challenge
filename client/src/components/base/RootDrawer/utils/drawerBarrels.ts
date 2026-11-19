import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { BaseUIState } from "@/store/BaseUIStore/types";

// Each entry imports its own file (not the barrel) so every drawer is a separate chunk.
export const DRAWERS: Record<
  NonNullable<BaseUIState["displayedDrawerOptions"]>,
  LazyExoticComponent<ComponentType>
> = {
  add_account: lazy(() =>
    import("@/components/base/RootDrawer/components/CreateAccountForm/CreateAccountForm").then(
      (m) => ({ default: m.CreateAccountForm }),
    ),
  ),
  add_category: lazy(() =>
    import("@/components/base/RootDrawer/components/CreateCategoryForm/CreateCategoryForm").then(
      (m) => ({ default: m.CreateCategoryForm }),
    ),
  ),
  add_expense: lazy(() =>
    import("@/components/base/RootDrawer/components/AddExpenseForm/AddExpenseForm").then(
      (m) => ({ default: m.AddExpenseForm }),
    ),
  ),
  edit_account: lazy(() =>
    import("@/components/base/RootDrawer/components/EditAccount/EditAccount").then(
      (m) => ({ default: m.EditAccount }),
    ),
  ),
  edit_transaction: lazy(() =>
    import("@/components/base/RootDrawer/components/EditTransaction/EditTransaction").then(
      (m) => ({ default: m.EditTransaction }),
    ),
  ),
  edit_upcoming: lazy(() =>
    import("@/components/base/RootDrawer/components/EditScheduledTransaction/EditScheduledTransaction").then(
      (m) => ({ default: m.EditScheduledTransaction }),
    ),
  ),
  show_account: lazy(() =>
    import("@/components/base/RootDrawer/components/ShowAccountDetails").then(
      (m) => ({ default: m.ShowAccountDetails }),
    ),
  ),
  show_transaction: lazy(() =>
    import("@/components/base/RootDrawer/components/ShowTransaction/ShowTransaction").then(
      (m) => ({ default: m.ShowTransaction }),
    ),
  ),
  show_upcoming: lazy(() =>
    import("@/components/base/RootDrawer/components/ShowUpcomingTransaction/ShowUpcomingTransaction").then(
      (m) => ({ default: m.ShowUpcomingTransaction }),
    ),
  ),
};
