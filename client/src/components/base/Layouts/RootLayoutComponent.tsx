import { lazy, Suspense } from "react";
import { Outlet } from "@tanstack/react-router";

// Dev-only: the null branch lets the devtools be dropped from the production build.
const TanStackRouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-router-devtools").then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    )
  : () => null;

export const RootLayoutComponent = () => (
  <>
    <Outlet />
    <Suspense>
      <TanStackRouterDevtools />
    </Suspense>
  </>
);
