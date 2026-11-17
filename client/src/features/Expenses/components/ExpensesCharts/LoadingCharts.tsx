import { Skeleton } from "@/components/vendors";
import { cn } from "@/utils/functions";

type LoadingChartsProps = {
  className?: string;
};

export const LoadingCharts = ({ className }: LoadingChartsProps) => {
  return (
    <div className={cn("flex flex-col min-h-95 gap-3", className)}>
      <Skeleton className="w-1/3 h-7" />
      <Skeleton className="w-full flex-1" />
    </div>
  );
};
