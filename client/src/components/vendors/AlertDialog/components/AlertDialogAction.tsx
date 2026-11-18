import type * as React from "react";
import { Button } from "@/components/vendors/Buttons";
import { cn } from "@/utils/functions";

export const AlertDialogAction = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => {
  return (
    <Button
      data-slot="alert-dialog-action"
      className={cn(className)}
      {...props}
    />
  );
};
