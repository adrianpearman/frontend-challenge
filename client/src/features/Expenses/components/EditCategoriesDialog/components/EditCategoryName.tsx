import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button, Input } from "@/components/vendors";
import { formSchema } from "@/components/base/RootDrawer/components/CreateCategoryForm/utils/formSchema";
import { networkErrorMessage } from "@/utils/functions";
import { updateCategoryMutation } from "@/utils/api/requests";
import type { Category } from "@/utils/types";

type EditCategoryNameProps = {
  category: Category;
  onDone: () => void;
};

export const EditCategoryName = ({
  category,
  onDone,
}: EditCategoryNameProps) => {
  const [name, setName] = useState(category.name);
  const [nameError, setNameError] = useState<string>();
  const { mutateAsync, isPending } = useMutation(updateCategoryMutation());

  const handleSave = async () => {
    const parsed = formSchema.shape.name.safeParse(name);
    if (!parsed.success) return setNameError(parsed.error.issues[0].message);
    try {
      await mutateAsync({ id: category.id, body: { name: parsed.data } });
      toast.success("Category updated.");
      onDone();
    } catch (error) {
      toast.error(networkErrorMessage(error, "Could not update the category."));
    }
  };

  return (
    <li className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <Input
          aria-label={`Name for ${category.name}`}
          aria-invalid={!!nameError}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          autoFocus
        />
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
      </div>
      {nameError && (
        <p className="text-body-small text-text-error">{nameError}</p>
      )}
    </li>
  );
};
