import { Skeleton } from "@/components/vendors";

export const LoadingOverviewItem = () => {
  return (
    <div className="flex-1 border border-neutral-border rounded-md p-4 flex flex-col gap-4 min-h-32">
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-9" />
      <Skeleton className="h-5 w-2/3" />
    </div>
  );
};
