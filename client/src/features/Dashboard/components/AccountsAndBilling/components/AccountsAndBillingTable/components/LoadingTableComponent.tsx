import { Skeleton } from "@/components/vendors/Skeleton";

export const LoadingTableComponent = () => {
  return (
    <div className="min-h-90 border border-neutral-border flex-1 flex flex-col gap-4 p-6">
      <Skeleton className="h-7 w-1/2 bg-background-tertiary"></Skeleton>
      <Skeleton className="flex-1 w-full bg-background-tertiary"></Skeleton>
    </div>
  );
};
