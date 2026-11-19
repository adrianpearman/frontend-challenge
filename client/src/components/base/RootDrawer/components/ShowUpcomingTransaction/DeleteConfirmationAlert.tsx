import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import { deleteScheduledItemMutation } from "@/utils/api/requests";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@/components/vendors";

type DeleteConfirmationAlertProps = {
  transaction: string;
  transactionID: string;
};

export const DeleteConfirmationAlert = ({
  transaction,
  transactionID,
}: DeleteConfirmationAlertProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutateAsync, isPending } = useMutation(deleteScheduledItemMutation());

  const handleDelete = async () => {
    try {
      await mutateAsync(transactionID);
      toast.success("Upcoming transaction deleted.");
      setIsDeleteOpen(false);
      baseUIStoreActions.closeDrawer();
    } catch (error) {
      toast.error(
        (isAxiosError(error) && error.response?.data?.error?.message) ||
          "Could not delete the upcoming transaction.",
      );
    }
  };

  return (
    <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <AlertDialogTrigger
        render={<Button variant="destructive">Delete Transaction</Button>}
      />
      <AlertDialogContent className="rounded-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm delete</AlertDialogTitle>
          <AlertDialogDescription>
            This action will delete the upcoming transaction for{" "}
            <strong>{transaction}</strong>. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="bg-background-secondary border-t-0">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending || !transactionID}
            onClick={handleDelete}
          >
            {isPending ? "Deleting…" : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
