import { cn } from "@/utils/functions";

type OverviewItemsContainer = {
  className?: string;
  children: React.ReactNode;
};

export const OverviewItemsContainer = ({
  className = "",
  children,
}: OverviewItemsContainer) => {
  return <div className={cn("flex gap-2", className)}>{children}</div>;
};
