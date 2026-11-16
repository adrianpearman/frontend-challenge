import * as React from "react";
import { cn } from "@/utils/functions";

export const TableCell = ({
  className,
  ...props
}: React.ComponentProps<"td">) => {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-0 py-3 align-middle whitespace-nowrap text-body-small [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
};
