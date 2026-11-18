import type * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { Button } from "@/components/vendors/Buttons";
import { cn } from "@/utils/functions";

export const AlertDialogCancel = ({
  className,
  variant = "outline",
  size = "default",
  ...props
}: AlertDialogPrimitive.Close.Props &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) => {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={cn(className)}
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  );
};
