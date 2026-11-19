import { useState } from "react";
import { Button } from "@/components/vendors";
import { DeleteCategoryConfirm } from "@/features/Expenses/components/EditCategoriesDialog/components/DeleteCategoryConfirm";
import { EditCategoryName } from "@/features/Expenses/components/EditCategoriesDialog/components/EditCategoryName";
import type { Category, DropdownOption } from "@/utils/types";

type CategoryRowProps = {
  category: Category;
  reassignOptions: DropdownOption[];
};

export const CategoryRow = ({
  category,
  reassignOptions,
}: CategoryRowProps) => {
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const showView = () => setMode("view");

  if (mode === "edit") {
    return <EditCategoryName category={category} onDone={showView} />;
  }

  if (mode === "delete") {
    return (
      <DeleteCategoryConfirm
        category={category}
        reassignOptions={reassignOptions}
        onCancel={showView}
      />
    );
  }

  return (
    <li className="flex gap-2 items-center justify-between py-1 border-b border-b-border-secondary/50">
      <span className="flex items-center gap-2 min-w-0">
        <span
          aria-hidden
          className="size-3 rounded-full shrink-0"
          style={{ backgroundColor: category.color }}
        />
        <span className="truncate">{category.name}</span>
        <span className="text-body-small capitalize">({category.kind})</span>
      </span>
      <span className="flex gap-1 shrink-0">
        <Button
          aria-label={`Edit ${category.name}`}
          variant="secondary"
          onClick={() => setMode("edit")}
        >
          Edit
        </Button>
        <Button
          aria-label={`Delete ${category.name}`}
          variant="destructive"
          onClick={() => setMode("delete")}
        >
          Delete
        </Button>
      </span>
    </li>
  );
};
