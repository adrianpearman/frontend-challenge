import * as React from "react";
import { cn } from "@/utils/functions";

export const TableRow = ({
  className,
  ...props
}: React.ComponentProps<"tr">) => {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b  border-b-neutral-border transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className,
      )}
      {...props}
    />
  );
};
