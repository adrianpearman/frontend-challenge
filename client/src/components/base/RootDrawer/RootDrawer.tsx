import { Suspense } from "react";
import { XIcon } from "lucide-react";
import { useIsMobile } from "@/components/base/RootDrawer/hooks";
import { DRAWERS } from "@/components/base/RootDrawer/utils/drawerBarrels";
import { Button } from "@/components/vendors";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
} from "@/components/vendors/Drawer";
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
      <DrawerContent className="border-transparent rounded-md bg-background-primary [&_[data-slot=card-header]]:pr-12 [&_h2]:pr-10">
        {/* Visible close for touch and keyboard users; Escape and outside-click still work. */}
        <DrawerClose
          render={
            <Button
              aria-label="Close"
              className="absolute top-3 right-3 z-10"
              size="icon-sm"
              variant="ghost"
            >
              <XIcon />
            </Button>
          }
        />
        {showApplicationDrawer && ActiveDrawer && (
          <Suspense>
            <ActiveDrawer />
          </Suspense>
        )}
      </DrawerContent>
    </Drawer>
  );
};
