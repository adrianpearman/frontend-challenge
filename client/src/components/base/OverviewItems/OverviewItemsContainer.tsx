import { cn } from "@/utils/functions";

type OverviewItemsContainer = {
  className?: string;
  children: React.ReactNode;
};

export const OverviewItemsContainer = ({
  className = "",
  children,
}: OverviewItemsContainer) => {
  return <div className={cn("flex flex-col lg:flex-row gap-2", className)}>{children}</div>;
};
