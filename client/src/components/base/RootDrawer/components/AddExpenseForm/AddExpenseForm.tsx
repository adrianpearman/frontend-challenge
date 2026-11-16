import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/vendors/Accordion";
import { Button } from "@/components/vendors/Buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/vendors/Cards";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/vendors/Field";
import { Input } from "@/components/vendors/Inputs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/vendors/Select";
import { Textarea } from "@/components/vendors/Textarea";
import {
  createFetchCategories,
  createFetchDashboardMetrics,
  createFetchProjects,
  createTransactionMutation,
} from "@/utils/api/requests";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import {
  FORM_ID,
  STATUS_OPTIONS,
} from "@/components/base/RootDrawer/components/AddExpenseForm/utils/consts";
import { formSchema } from "@/components/base/RootDrawer/components/AddExpenseForm/utils/formSchema";
import { splitTags } from "@/components/base/RootDrawer/components/AddExpenseForm/utils/functions";

const today = () => new Date().toLocaleDateString("en-CA"); // local YYYY-MM-DD

type Option = {
  value: string;
  label: string;
};

export const AddExpenseForm = () => {
  const { data: accounts } = useQuery(createFetchDashboardMetrics({}));
  const { data: categories } = useQuery(
    createFetchCategories({ params: { kind: "expense" } }),
  );
  const { data: projects } = useQuery(createFetchProjects({}));
  const { mutateAsync, isPending } = useMutation(createTransactionMutation());

  const accountOptions: Option[] =
    accounts?.data.map((a) => ({ value: a.id, label: a.name })) ?? [];
  const categoryOptions: Option[] =
    categories?.data.map((c) => ({ value: c.id, label: c.name })) ?? [];
  const projectOptions: Option[] =
    projects?.data.map((p) => ({ value: p.id, label: p.name })) ?? [];

  const form = useForm({
    defaultValues: {
      accountId: "",
      date: today(),
      amount: "",
      description: "",
      merchant: "",
      categoryId: "",
      projectId: "",
      status: "posted" as "posted" | "pending",
      notes: "",
      tags: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          accountId: value.accountId,
          date: value.date,
          // An expense is money out, so the server expects a negative amount in cents.
          amount: -Math.round(Number(value.amount) * 100),
          description: value.description.trim(),
          merchant: value.merchant.trim() || undefined,
          categoryId: value.categoryId || undefined,
          projectId: value.projectId || undefined,
          status: value.status,
          notes: value.notes.trim() || undefined,
          tags: splitTags(value.tags),
        });
        toast.success("Expense added.");
        form.reset();
      } catch (error) {
        toast.error(
          (isAxiosError(error) && error.response?.data?.error?.message) ||
            "Could not add the expense.",
        );
      } finally {
        baseUIStoreActions.setShowApplicationDrawer(false);
      }
    },
  });

  const handleResetButton = () => {
    form.reset();
    baseUIStoreActions.setShowApplicationDrawer(false);
  };

  return (
    <Card className="w-full sm:max-w-md flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2 min-h-0 overflow-y-auto">
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
          <CardDescription>
            Record money spent from one of your accounts.
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
                name="accountId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Account</FieldLabel>
                      <Select
                        items={accountOptions}
                        value={field.state.value || null}
                        onValueChange={(v) => field.handleChange(v ?? "")}
                      >
                        <SelectTrigger
                          id={field.name}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          className="w-full"
                        >
                          <SelectValue placeholder="Select an account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountOptions.map((o) => (
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
                name="amount"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        inputMode="decimal"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="45.99"
                        autoComplete="off"
                      />
                      <FieldDescription>
                        In the account's currency.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="date"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="date"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="description"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Weekly groceries"
                        autoComplete="off"
                      />
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
                        name="merchant"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Merchant
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
                                placeholder="Loblaws"
                                autoComplete="off"
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      />
                      {(
                        [
                          ["categoryId", "Category", categoryOptions],
                          ["projectId", "Project", projectOptions],
                          ["status", "Status", STATUS_OPTIONS],
                        ] as const
                      ).map(([name, label, options]) => (
                        <form.Field
                          key={name}
                          name={name}
                          children={(field) => (
                            <Field>
                              <FieldLabel htmlFor={field.name}>
                                {label}
                              </FieldLabel>
                              <Select
                                items={options}
                                value={field.state.value || null}
                                onValueChange={(v) =>
                                  field.handleChange((v ?? "") as never)
                                }
                              >
                                <SelectTrigger
                                  id={field.name}
                                  onBlur={field.handleBlur}
                                  className="w-full"
                                >
                                  <SelectValue
                                    placeholder={`No ${label.toLowerCase()}`}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {options.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>
                                      {o.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </Field>
                          )}
                        />
                      ))}
                      <form.Field
                        name="tags"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>Tags</FieldLabel>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                aria-invalid={isInvalid}
                                placeholder="food, weekly"
                                autoComplete="off"
                              />
                              <FieldDescription>
                                Separate tags with commas.
                              </FieldDescription>
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      />
                      <form.Field
                        name="notes"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Notes
                              </FieldLabel>
                              <Textarea
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                aria-invalid={isInvalid}
                                placeholder="Anything worth remembering about this expense"
                                rows={4}
                                className="min-h-24 resize-none"
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
            {isPending ? "Saving…" : "Add expense"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
