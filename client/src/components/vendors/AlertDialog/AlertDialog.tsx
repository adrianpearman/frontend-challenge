import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";

export const AlertDialog = ({ ...props }: AlertDialogPrimitive.Root.Props) => {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
};
