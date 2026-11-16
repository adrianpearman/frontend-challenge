import { createRootRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const RootLayoutComponent = () => (
  <>
    <Outlet />
  </>
);

export const Route = createRootRoute({ component: RootLayoutComponent });
