import { useAppForm } from "@/components/base/AppForm";
import {
  AUTO_PAY_OPTIONS,
  CREATE_SCHEDULED_ITEM_FORM_ID,
  FREQUENCY_OPTIONS,
  SCHEDULED_KIND_OPTIONS,
  SCHEDULED_STATUS_OPTIONS,
} from "@/components/base/RootDrawer/utils/consts";
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
import { formSchema } from "@/components/base/RootDrawer/components/CreateScheduledItemForm/utils/formSchema";
import {
  createFetchAccounts,
  createFetchCategories,
  createFetchProjects,
  createScheduledItemMutation,
} from "@/utils/api/requests";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import { toLocalDate, toMinor } from "@/utils/functions";
import type { DropdownOption } from "@/utils/types";

export const CreateScheduledItemForm = () => {
  const { data: accounts } = useQuery(createFetchAccounts({}));
  const { data: categories } = useQuery(createFetchCategories({}));
  const { data: projects } = useQuery(createFetchProjects({}));
  const { mutateAsync, isPending } = useMutation(createScheduledItemMutation());

  const accountOptions: DropdownOption[] =
    accounts?.data.map((a) => ({ value: a.id, label: a.name })) ?? [];
  const categoryOptions: DropdownOption[] =
    categories?.data.map((c) => ({ value: c.id, label: c.name })) ?? [];
  const projectOptions: DropdownOption[] =
    projects?.data.map((p) => ({ value: p.id, label: p.name })) ?? [];

  const form = useAppForm({
    defaultValues: {
      name: "",
      kind: "bill" as "bill" | "income",
      accountId: "",
      categoryId: "",
      projectId: "",
      amount: "",
      frequency: "monthly" as
        "once" | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly",
      startDate: toLocalDate(),
      endDate: "",
      autoPay: "no" as "yes" | "no",
      status: "active" as "active" | "paused",
      variance: "0.00",
      notes: "",
    },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          name: value.name.trim(),
          kind: value.kind,
          accountId: value.accountId,
          categoryId: value.categoryId || null,
          projectId: value.projectId || null,
          // Server expects signed cents: bills are money out (negative), income positive.
          amount:
            value.kind === "bill"
              ? -toMinor(value.amount)
              : toMinor(value.amount),
          frequency: value.frequency,
          startDate: value.startDate,
          endDate: value.endDate || null,
          autoPay: value.autoPay === "yes",
          status: value.status,
          variance: toMinor(value.variance),
          notes: value.notes.trim() || null,
        });
        toast.success("Scheduled item added.");
        form.reset();
        baseUIStoreActions.closeDrawer();
      } catch (error) {
        toast.error(
          (isAxiosError(error) && error.response?.data?.error?.message) ||
            "Could not add the scheduled item.",
        );
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
          <CardTitle>Add Bill or Income</CardTitle>
          <CardDescription>
            Schedule a recurring or one-off transaction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id={CREATE_SCHEDULED_ITEM_FORM_ID}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField
                name="name"
                children={(f) => (
                  <f.TextField label="Name" placeholder="Rent" />
                )}
              />
              {(
                [
                  ["kind", "Kind", SCHEDULED_KIND_OPTIONS],
                  ["accountId", "Account", accountOptions],
                  ["frequency", "Frequency", FREQUENCY_OPTIONS],
                ] as const
              ).map(([name, label, options]) => (
                <form.AppField
                  key={name}
                  name={name}
                  children={(f) => (
                    <f.SelectField
                      label={label}
                      options={options}
                      placeholder={`Select ${label.toLowerCase()}`}
                    />
                  )}
                />
              ))}
              <form.AppField
                name="amount"
                children={(f) => (
                  <f.TextField
                    label="Amount"
                    inputMode="decimal"
                    placeholder="1200.00"
                    description="Positive number; the sign comes from the kind."
                  />
                )}
              />
              <form.AppField
                name="startDate"
                children={(f) => <f.DatePickerField label="Start date" />}
              />

              <Accordion>
                <AccordionItem value="additional">
                  <AccordionTrigger>Additional</AccordionTrigger>
                  <AccordionContent>
                    <FieldGroup>
                      <form.AppField
                        name="endDate"
                        children={(f) => (
                          <f.DatePickerField
                            label="End date"
                            description="Leave empty to repeat indefinitely."
                          />
                        )}
                      />
                      <form.AppField
                        name="variance"
                        children={(f) => (
                          <f.TextField
                            label="Variance"
                            inputMode="decimal"
                            placeholder="0.00"
                          />
                        )}
                      />
                      {(
                        [
                          ["categoryId", "Category", categoryOptions],
                          ["projectId", "Project", projectOptions],
                          ["status", "Status", SCHEDULED_STATUS_OPTIONS],
                          ["autoPay", "Auto pay", AUTO_PAY_OPTIONS],
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
                        name="notes"
                        children={(f) => <f.TextareaField label="Notes" />}
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
            form={CREATE_SCHEDULED_ITEM_FORM_ID}
            disabled={isPending}
          >
            {isPending ? "Saving…" : "Add scheduled item"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
