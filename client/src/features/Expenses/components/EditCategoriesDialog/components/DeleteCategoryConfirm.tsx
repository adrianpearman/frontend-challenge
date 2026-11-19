import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/vendors";
import { networkErrorMessage } from "@/utils/functions";
import { deleteCategoryMutation } from "@/utils/api/requests";
import type { Category, DropdownOption } from "@/utils/types";

type DeleteCategoryConfirmProps = {
  category: Category;
  reassignOptions: DropdownOption[];
  onCancel: () => void;
};

const NO_REASSIGN = "__none__";

export const DeleteCategoryConfirm = ({
  category,
  reassignOptions,
  onCancel,
}: DeleteCategoryConfirmProps) => {
  const [reassignTo, setReassignTo] = useState(NO_REASSIGN);
  const { mutateAsync, isPending } = useMutation(deleteCategoryMutation());

  const handleDelete = async () => {
    try {
      // Without reassignTo the server refuses in-use categories, so force leaves them uncategorised.
      await mutateAsync(
        reassignTo === NO_REASSIGN
          ? { id: category.id, force: true }
          : { id: category.id, reassignTo },
      );
      toast.success("Category deleted.");
    } catch (error) {
      toast.error(
        networkErrorMessage({
          error,
          fallback: "Could not delete the category.",
        }),
      );
    }
  };

  return (
    <li className="flex flex-col gap-2 py-2 border-b border-b-border-secondary/50">
      <p className="text-body-small">
        Delete <strong>{category.name}</strong>? Choose where its transactions
        and scheduled items go. This cannot be undone.
      </p>
      <Select
        items={[
          { value: NO_REASSIGN, label: "Leave uncategorised" },
          ...reassignOptions,
        ]}
        value={reassignTo}
        onValueChange={(v) => setReassignTo(v ?? NO_REASSIGN)}
      >
        <SelectTrigger
          aria-label={`Reassign ${category.name} to`}
          className="w-full"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NO_REASSIGN}>Leave uncategorised</SelectItem>
          {reassignOptions.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              Move to {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? "Deleting…" : "Delete"}
        </Button>
      </div>
    </li>
  );
};
