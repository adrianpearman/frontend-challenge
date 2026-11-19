import { useSelector } from "@tanstack/react-form";
import {
  CATEGORY_KIND_OPTIONS,
  CREATE_CATEGORY_FORM_ID,
} from "@/components/base/RootDrawer/utils/consts";
import { useAppForm } from "@/components/base/AppForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldGroup,
} from "@/components/vendors";
import { formSchema } from "@/components/base/RootDrawer/components/CreateCategoryForm/utils/formSchema";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import {
  createCategoryMutation,
  createFetchCategories,
} from "@/utils/api/requests";
import type { DropdownOption } from "@/utils/types";
import { networkErrorMessage } from "@/utils/functions";

export const CreateCategoryForm = () => {
  const { mutateAsync, isPending } = useMutation(createCategoryMutation());

  const form = useAppForm({
    defaultValues: {
      name: "",
      kind: "expense" as "expense" | "income",
      parentId: "",
      monthlyBudget: "",
      color: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          name: value.name.trim(),
          kind: value.kind,
          parentId: value.parentId || undefined,
          monthlyBudget: value.monthlyBudget
            ? Math.round(Number(value.monthlyBudget) * 100)
            : undefined,
          color: value.color.trim() || undefined,
        });
        toast.success("Category created.");
        form.reset();
      } catch (error) {
        toast.error(
          networkErrorMessage({
            error,
            fallback: "Could not create the category.",
          }),
        );
      } finally {
        baseUIStoreActions.closeDrawer();
      }
    },
  });

  // A parent must be the same kind, so the options follow the selected kind.
  const kind = useSelector(form.store, (s) => s.values.kind);
  const { data: categories } = useQuery(
    createFetchCategories({ params: { kind } }),
  );
  const parentOptions: DropdownOption[] =
    categories?.data.map((c) => ({ value: c.id, label: c.name })) ?? [];

  const handleResetButton = () => {
    form.reset();
    baseUIStoreActions.closeDrawer();
  };

  return (
    <Card className="w-full sm:max-w-md flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2 min-h-0 overflow-y-auto">
        <CardHeader>
          <CardTitle>Create Category</CardTitle>
          <CardDescription>
            Group your income or expenses and set a monthly budget.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id={CREATE_CATEGORY_FORM_ID}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField
                name="name"
                children={(f) => (
                  <f.TextField label="Name" placeholder="Groceries" />
                )}
              />
              <form.AppField
                name="kind"
                children={(f) => (
                  <f.SelectField
                    label="Kind"
                    options={CATEGORY_KIND_OPTIONS}
                    placeholder="Select a kind"
                    // The old parent belongs to the other kind.
                    onValueChange={() => form.setFieldValue("parentId", "")}
                  />
                )}
              />
              <form.AppField
                name="monthlyBudget"
                children={(f) => (
                  <f.TextField
                    label="Monthly budget"
                    inputMode="decimal"
                    placeholder="250.00"
                    description="Leave empty for no budget."
                  />
                )}
              />

              <Accordion>
                <AccordionItem value="additional">
                  <AccordionTrigger>Additional</AccordionTrigger>
                  <AccordionContent>
                    <FieldGroup>
                      <form.AppField
                        name="parentId"
                        children={(f) => (
                          <f.SelectField
                            label="Parent category"
                            options={parentOptions}
                            placeholder="No parent"
                          />
                        )}
                      />
                      <form.AppField
                        name="color"
                        children={(f) => (
                          <f.TextField label="Colour" placeholder="#16a34a" />
                        )}
                      />
                    </FieldGroup>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </FieldGroup>
          </form>
        </CardContent>
      </div>
      <CardFooter className="bg-background-secondary">
        <Field orientation="horizontal" className="flex justify-end">
          <Button type="button" variant="outline" onClick={handleResetButton}>
            Reset
          </Button>
          <Button
            type="submit"
            form={CREATE_CATEGORY_FORM_ID}
            disabled={isPending}
          >
            {isPending ? "Saving…" : "Create category"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
