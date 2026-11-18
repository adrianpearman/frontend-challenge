import { useAppForm } from "@/components/base/AppForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
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
import {
  FORM_ID,
  STATUS_OPTIONS,
} from "@/components/base/RootDrawer/components/AddExpenseForm/utils/consts";
import { formSchema } from "@/components/base/RootDrawer/components/AddExpenseForm/utils/formSchema";
import { splitTags } from "@/components/base/RootDrawer/components/AddExpenseForm/utils/functions";
import {
  createFetchCategories,
  createFetchDashboardMetrics,
  createFetchProjects,
  createTransactionMutation,
} from "@/utils/api/requests";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import type { DropdownOption } from "@/utils/types";

const today = () => new Date().toLocaleDateString("en-CA"); // local YYYY-MM-DD

export const AddExpenseForm = () => {
  const { data: accounts } = useQuery(createFetchDashboardMetrics({}));
  const { data: categories } = useQuery(
    createFetchCategories({ params: { kind: "expense" } }),
  );
  const { data: projects } = useQuery(createFetchProjects({}));
  const { mutateAsync, isPending } = useMutation(createTransactionMutation());

  const accountOptions: DropdownOption[] =
    accounts?.data.map((a) => ({ value: a.id, label: a.name })) ?? [];
  const categoryOptions: DropdownOption[] =
    categories?.data.map((c) => ({ value: c.id, label: c.name })) ?? [];
  const projectOptions: DropdownOption[] =
    projects?.data.map((p) => ({ value: p.id, label: p.name })) ?? [];

  const form = useAppForm({
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
        baseUIStoreActions.closeDrawer();
      }
    },
  });

  const handleResetButton = () => {
    form.reset();
    baseUIStoreActions.closeDrawer();
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
              <form.AppField
                name="accountId"
                children={(f) => (
                  <f.SelectField
                    label="Account"
                    options={accountOptions}
                    placeholder="Select an account"
                  />
                )}
              />
              <form.AppField
                name="amount"
                children={(f) => (
                  <f.TextField
                    label="Amount"
                    inputMode="decimal"
                    placeholder="45.99"
                    description="In the account's currency."
                  />
                )}
              />
              <form.AppField
                name="date"
                children={(f) => <f.DatePickerField label="Date" />}
              />
              <form.AppField
                name="description"
                children={(f) => (
                  <f.TextField
                    label="Description"
                    placeholder="Weekly groceries"
                  />
                )}
              />

              <Accordion>
                <AccordionItem value="additional">
                  <AccordionTrigger>Additional</AccordionTrigger>
                  <AccordionContent>
                    <FieldGroup>
                      <form.AppField
                        name="merchant"
                        children={(f) => (
                          <f.TextField label="Merchant" placeholder="Loblaws" />
                        )}
                      />
                      {(
                        [
                          ["categoryId", "Category", categoryOptions],
                          ["projectId", "Project", projectOptions],
                          ["status", "Status", STATUS_OPTIONS],
                        ] as const
                      ).map(([name, label, options]) => (
                        <form.AppField
                          key={name}
                          name={name}
                          children={(f) => (
                            <f.SelectField
                              label={label}
                              options={options}
                              placeholder={`No ${label.toLowerCase()}`}
                            />
                          )}
                        />
                      ))}
                      <form.AppField
                        name="tags"
                        children={(f) => (
                          <f.TextField
                            label="Tags"
                            placeholder="food, weekly"
                            description="Separate tags with commas."
                          />
                        )}
                      />
                      <form.AppField
                        name="notes"
                        children={(f) => (
                          <f.TextareaField
                            label="Notes"
                            placeholder="Anything worth remembering about this expense"
                          />
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
          <Button type="submit" form={FORM_ID} disabled={isPending}>
            {isPending ? "Saving…" : "Add expense"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
