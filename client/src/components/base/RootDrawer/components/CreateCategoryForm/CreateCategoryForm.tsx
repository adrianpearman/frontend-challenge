import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import {
  FORM_ID,
  KIND_OPTIONS,
} from "@/components/base/RootDrawer/components/CreateCategoryForm/utils/consts";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/vendors";
import { formSchema } from "@/components/base/RootDrawer/components/CreateCategoryForm/utils/formSchema";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import {
  createCategoryMutation,
  createFetchCategories,
} from "@/utils/api/requests";
import type { DropdownOption } from "@/utils/types";

export const CreateCategoryForm = () => {
  const { mutateAsync, isPending } = useMutation(createCategoryMutation());

  const form = useForm({
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
          (isAxiosError(error) && error.response?.data?.error?.message) ||
            "Could not create the category.",
        );
      } finally {
        baseUIStoreActions.closeDrawer();
      }
    },
  });

  // A parent must be the same kind, so the options follow the selected kind.
  const kind = useStore(form.store, (s) => s.values.kind);
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
            id={FORM_ID}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Groceries"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="kind"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Kind</FieldLabel>
                      <Select
                        items={KIND_OPTIONS}
                        value={field.state.value || null}
                        onValueChange={(v) => {
                          field.handleChange((v ?? "") as never);
                          // The old parent belongs to the other kind.
                          form.setFieldValue("parentId", "");
                        }}
                      >
                        <SelectTrigger
                          id={field.name}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          className="w-full"
                        >
                          <SelectValue placeholder="Select a kind" />
                        </SelectTrigger>
                        <SelectContent>
                          {KIND_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="monthlyBudget"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Monthly budget
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        inputMode="decimal"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="250.00"
                        autoComplete="off"
                      />
                      <FieldDescription>
                        Leave empty for no budget.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <Accordion>
                <AccordionItem value="additional">
                  <AccordionTrigger>Additional</AccordionTrigger>
                  <AccordionContent>
                    <FieldGroup>
                      <form.Field
                        name="parentId"
                        children={(field) => (
                          <Field>
                            <FieldLabel htmlFor={field.name}>
                              Parent category
                            </FieldLabel>
                            <Select
                              items={parentOptions}
                              value={field.state.value || null}
                              onValueChange={(v) => field.handleChange(v ?? "")}
                            >
                              <SelectTrigger
                                id={field.name}
                                onBlur={field.handleBlur}
                                className="w-full"
                              >
                                <SelectValue placeholder="No parent" />
                              </SelectTrigger>
                              <SelectContent>
                                {parentOptions.map((o) => (
                                  <SelectItem key={o.value} value={o.value}>
                                    {o.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                        )}
                      />
                      <form.Field
                        name="color"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Colour
                              </FieldLabel>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                aria-invalid={isInvalid}
                                placeholder="#16a34a"
                                autoComplete="off"
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
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
          <Button type="submit" form={FORM_ID} disabled={isPending}>
            {isPending ? "Saving…" : "Create category"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
