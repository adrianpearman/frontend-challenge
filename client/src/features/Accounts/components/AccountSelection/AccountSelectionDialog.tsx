import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from "@/components/vendors";
import type { Account } from "@/utils/types";

type AccountSelectionDialogProps = {
  account: Account | null;
  isPending: boolean;
  onCloseFn: () => void;
  onConfirmFn: () => void;
};

export const AccountSelectionDialog = ({
  account,
  isPending,
  onCloseFn,
  onConfirmFn,
}: AccountSelectionDialogProps) => (
  <AlertDialog
    open={account !== null}
    onOpenChange={(open) => !open && !isPending && onCloseFn()}
  >
    <AlertDialogContent className="rounded-sm">
      <AlertDialogHeader>
        <AlertDialogTitle>Delete account</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete <strong>{account?.name}</strong>. This
          cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="bg-background-secondary border-t-0">
        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
        <Button
          variant="destructive"
          disabled={isPending}
          onClick={onConfirmFn}
        >
          {isPending ? "Deleting…" : "Delete"}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
