import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/vendors";
import { CategoryRow } from "@/features/Expenses/components/EditCategoriesDialog/components";
import { createFetchCategories } from "@/utils/api/requests";

type EditCategoriesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const EditCategoriesDialog = ({
  open,
  onOpenChange,
}: EditCategoriesDialogProps) => {
  const { data, isLoading, isError } = useQuery({
    ...createFetchCategories({}),
    enabled: open,
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit categories</AlertDialogTitle>
          <AlertDialogDescription>
            Rename or delete a category.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ul className="flex flex-col gap-2 max-h-96 overflow-y-auto px-4">
          {isLoading && <li className="text-body-small">Loading…</li>}
          {isError && (
            <li className="text-body-small text-text-error">
              Could not load categories.
            </li>
          )}
          {data?.data.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              // Only same-kind categories make sense as a new home for its transactions.
              reassignOptions={data.data
                .filter((c) => c.id !== category.id && c.kind === category.kind)
                .map((c) => ({ value: c.id, label: c.name }))}
            />
          ))}
        </ul>
        <AlertDialogFooter className="bg-background-secondary border-t-0">
          <AlertDialogCancel>Done</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
