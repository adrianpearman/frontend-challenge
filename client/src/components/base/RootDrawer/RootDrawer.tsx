import { Suspense } from "react";
import { useIsMobile } from "@/components/base/RootDrawer/hooks";
import { DRAWERS } from "@/components/base/RootDrawer/utils/drawerBarrels";
import { Drawer, DrawerContent } from "@/components/vendors/Drawer";
import { baseUIStoreActions, useBaseUIStore } from "@/store/BaseUIStore";

export const RootDrawer = () => {
  const displayedDrawer = useBaseUIStore(
    (state) => state.displayedDrawerOptions,
  );
  const showApplicationDrawer = useBaseUIStore(
    (state) => state.showApplicationDrawer,
  );
  const isMobile = useIsMobile();
  const ActiveDrawer = displayedDrawer ? DRAWERS[displayedDrawer] : null;

  return (
    <Drawer
      open={showApplicationDrawer}
      onOpenChange={baseUIStoreActions.setShowApplicationDrawer}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerContent className="border-transparent rounded-md bg-background-primary">
        {showApplicationDrawer && ActiveDrawer && (
          <Suspense>
            <ActiveDrawer />
          </Suspense>
        )}
      </DrawerContent>
    </Drawer>
  );
};
