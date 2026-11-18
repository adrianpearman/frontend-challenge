import { useState } from "react";
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
            <strong>{transaction}</strong>. This cannot be undone. and will
            delete this upcoming transfer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="bg-background-secondary border-t-0">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              console.log(`delete transaction ${transactionID}`);
              setIsDeleteOpen(false);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
