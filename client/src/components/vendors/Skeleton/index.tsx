import { cn } from "@/utils/functions";

export const Skeleton = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-background-tertiary/50",
        className,
      )}
      {...props}
    />
  );
};
