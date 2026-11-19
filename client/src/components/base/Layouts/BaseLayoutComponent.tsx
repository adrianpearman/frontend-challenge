import { Navigation, RootDrawer } from "@/components/base";

type BaseLayoutComponent = {
  children: React.ReactNode;
};

// The QueryClient comes from main.tsx; a second provider here would give each page its own cache and defaults.
export const BaseLayoutComponent = ({ children }: BaseLayoutComponent) => {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row relative">
      <Navigation />
      <main className="flex-1 min-w-0">{children}</main>
      <RootDrawer />
    </div>
  );
};
