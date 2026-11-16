import * as React from "react";
import { cn } from "@/utils/functions";

export const TableHead = ({
  className,
  ...props
}: React.ComponentProps<"th">) => {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-0 py-3 text-left align-middle font-medium whitespace-nowrap text-text-primary text-h6 [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
};
