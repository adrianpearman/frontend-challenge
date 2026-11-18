import { lazy, Suspense } from "react";
import { useIsMobile } from "@/components/base/RootDrawer/hooks";
import { Drawer, DrawerContent } from "@/components/vendors/Drawer";
import { baseUIStoreActions, useBaseUIStore } from "@/store/BaseUIStore";

const AddExpenseForm = lazy(() =>
  import("@/components/base/RootDrawer/components").then((m) => ({
    default: m.AddExpenseForm,
  })),
);

const CreateAccountForm = lazy(() =>
  import("@/components/base/RootDrawer/components").then((m) => ({
    default: m.CreateAccountForm,
  })),
);

const CreateCategoryForm = lazy(() =>
  import("@/components/base/RootDrawer/components").then((m) => ({
    default: m.CreateCategoryForm,
  })),
);

const EditScheduledTransaction = lazy(() =>
  import("@/components/base/RootDrawer/components").then((m) => ({
    default: m.EditScheduledTransaction,
  })),
);

const ShowAccountDetails = lazy(() =>
  import("@/components/base/RootDrawer/components").then((m) => ({
    default: m.ShowAccountDetails,
  })),
);

const ShowTransaction = lazy(() =>
  import("@/components/base/RootDrawer/components").then((m) => ({
    default: m.ShowTransaction,
  })),
);

const ShowUpcomingTransaction = lazy(() =>
  import("@/components/base/RootDrawer/components").then((m) => ({
    default: m.ShowUpcomingTransaction,
  })),
);

export const RootDrawer = () => {
  const displayedDrawer = useBaseUIStore(
    (state) => state.displayedDrawerOptions,
  );
  const showApplicationDrawer = useBaseUIStore(
    (state) => state.showApplicationDrawer,
  );
  const isMobile = useIsMobile();

  return (
    <Drawer
      open={showApplicationDrawer}
      onOpenChange={baseUIStoreActions.setShowApplicationDrawer}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerContent className="border-transparent rounded-md bg-background-primary">
        {/* will add state value to dynamically chose the component to render here */}
        {showApplicationDrawer && (
          <Suspense>
            {displayedDrawer === "add_account" && <CreateAccountForm />}
            {displayedDrawer === "add_category" && <CreateCategoryForm />}
            {displayedDrawer === "add_expense" && <AddExpenseForm />}
            {displayedDrawer === "edit_transaction" && (
              <EditScheduledTransaction />
            )}
            {displayedDrawer === "show_account" && <ShowAccountDetails />}
            {displayedDrawer === "show_transaction" && <ShowTransaction />}
            {displayedDrawer === "show_upcoming" && <ShowUpcomingTransaction />}
          </Suspense>
        )}
      </DrawerContent>
    </Drawer>
  );
};
