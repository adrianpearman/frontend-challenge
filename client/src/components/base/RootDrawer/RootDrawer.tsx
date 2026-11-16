import { lazy, Suspense } from "react";
import { useIsMobile } from "@/components/base/RootDrawer/hooks";
import { Drawer, DrawerContent } from "@/components/vendors/Drawer";
import { baseUIStoreActions, useBaseUIStore } from "@/store/BaseUIStore";

// Loaded on first open so react-form/zod/Select stay off the initial page load.
const AddExpenseForm = lazy(() =>
  import("@/components/base/RootDrawer/components/AddExpenseForm").then(
    (m) => ({
      default: m.AddExpenseForm,
    }),
  ),
);

export const RootDrawer = () => {
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
            <AddExpenseForm />
          </Suspense>
        )}
      </DrawerContent>
    </Drawer>
  );
};
