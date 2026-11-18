import React from "react";
import ReactDOM from "react-dom/client";
import { routeTree } from "@/routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDevServicesStore } from "@/store/DevServicesStore";
import { Global } from "recharts";
import { Toaster } from "sonner";

// Each Recharts chart is its own Redux store; stop it streaming chart state into Redux DevTools.
Global.devToolsEnabled = false;

import "@/assets/styles/styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Same as the default of 3 retries, unless switched off on the Settings page.
      retry: (failureCount) =>
        !useDevServicesStore.getState().disableRetries && failureCount < 3,
    },
  },
});

const router = createRouter({ routeTree });

declare module "react" {
  interface CSSProperties {
    "--content-color"?: string;
  }
}
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
