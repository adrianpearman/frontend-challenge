import { useAppForm } from "@/components/base/AppForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { LoadingDetails } from "@/components/base/RootDrawer/components";
import { ErrorLoadingDrawerComponent } from "@/components/base/RootDrawer/components/ErrorLoadingDrawerComponent";
import { formSchema } from "@/components/base/RootDrawer/components/EditScheduledTransaction/utils/formSchema";
import { Button } from "@/components/vendors/Buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/vendors/Cards";
import { Field, FieldGroup } from "@/components/vendors/Field";
import { baseUIStoreActions, useBaseUIStore } from "@/store/BaseUIStore";
import {
  createFetchCategories,
  createFetchAccounts,
  createFetchProjects,
  createFetchScheduledItem,
  updateScheduledItemMutation,
} from "@/utils/api/requests";
import { toDollars, toMinor } from "@/utils/functions";
import type { DropdownOption, ScheduledItem } from "@/utils/types";

const FORM_ID = "edit-scheduled-transaction-form";

const opts = (values: string[]): DropdownOption[] =>
  values.map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }));

const KIND_OPTIONS = opts(["bill", "income"]);
const FREQUENCY_OPTIONS = opts([
  "once",
  "weekly",
  "biweekly",
  "monthly",
  "quarterly",
  "yearly",
]);
const STATUS_OPTIONS = opts(["active", "paused"]);
const AUTO_PAY_OPTIONS = opts(["yes", "no"]);

export const EditScheduledTransaction = () => {
  const transactionID = useBaseUIStore((state) => state.transactionID);
  const { data, isLoading, isError } = useQuery({
    ...createFetchScheduledItem(transactionID ?? "", {}),
    enabled: !!transactionID,
  });

  if (!transactionID) return null;
  if (isError)
    return <ErrorLoadingDrawerComponent drawerName="scheduled transaction" />;
  if (isLoading || !data) return <LoadingDetails />;

  // Mounted only once the item has loaded so the form's defaultValues are the real values.
  return <EditScheduledTransactionForm item={data.data} />;
};

const EditScheduledTransactionForm = ({ item }: { item: ScheduledItem }) => {
  const { data: accounts } = useQuery(createFetchAccounts({}));
  const { data: categories } = useQuery(createFetchCategories({}));
  const { data: projects } = useQuery(createFetchProjects({}));
  const { mutateAsync, isPending } = useMutation(updateScheduledItemMutation());

  const accountOptions: DropdownOption[] =
    accounts?.data.map((a) => ({ value: a.id, label: a.name })) ?? [];
  const categoryOptions: DropdownOption[] =
    categories?.data.map((c) => ({ value: c.id, label: c.name })) ?? [];
  const projectOptions: DropdownOption[] =
    projects?.data.map((p) => ({ value: p.id, label: p.name })) ?? [];

  const backToDetails = () =>
    baseUIStoreActions.setDisplayedDrawerOptions("show_upcoming");

  const form = useAppForm({
    defaultValues: {
      name: item.name,
      kind: item.kind,
      accountId: item.accountId,
      categoryId: item.categoryId ?? "",
      projectId: item.projectId ?? "",
      amount: toDollars(item.amount),
      frequency: item.frequency,
      startDate: item.startDate,
      endDate: item.endDate ?? "",
      autoPay: (item.autoPay ? "yes" : "no") as "yes" | "no",
      status: item.status,
      variance: toDollars(item.variance),
      notes: item.notes ?? "",
    },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          id: item.id,
          body: {
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
          },
        });
        toast.success("Scheduled transaction updated.");
        backToDetails();
      } catch (error) {
        toast.error(
          (isAxiosError(error) && error.response?.data?.error?.message) ||
            "Could not update the scheduled transaction.",
        );
      }
    },
  });

  const textFields = [
    { name: "name", label: "Name", placeholder: "Rent" },
    {
      name: "amount",
      label: "Amount",
      inputMode: "decimal",
      placeholder: "1200.00",
      description: "Positive number; the sign comes from the kind.",
    },
    { name: "startDate", label: "Start date", type: "date" },
    {
      name: "endDate",
      label: "End date",
      type: "date",
      description: "Leave empty to repeat indefinitely.",
    },
    {
      name: "variance",
      label: "Variance",
      inputMode: "decimal",
      placeholder: "0.00",
    },
  ] as const;

  const selectFields = [
    ["kind", "Kind", KIND_OPTIONS, true],
    ["accountId", "Account", accountOptions, true],
    ["frequency", "Frequency", FREQUENCY_OPTIONS, true],
    ["categoryId", "Category", categoryOptions, false],
    ["projectId", "Project", projectOptions, false],
    ["status", "Status", STATUS_OPTIONS, true],
    ["autoPay", "Auto pay", AUTO_PAY_OPTIONS, true],
  ] as const;

  return (
    <Card className="w-full sm:max-w-md flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2 min-h-0 overflow-y-auto">
        <CardHeader>
          <CardTitle>Edit Scheduled Transaction</CardTitle>
          <CardDescription>
            Update this upcoming bill or income.
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
              {textFields.map(({ name, ...props }) => (
                <form.AppField
                  key={name}
                  name={name}
                  children={(f) => <f.TextField {...props} />}
                />
              ))}
              {selectFields.map(([name, label, options, required]) => (
                <form.AppField
                  key={name}
                  name={name}
                  children={(f) => (
                    <f.SelectField
                      label={label}
                      options={options}
                      placeholder={`${required ? "Select" : "No"} ${label.toLowerCase()}`}
                    />
                  )}
                />
              ))}
              <form.AppField
                name="notes"
                children={(f) => <f.TextareaField label="Notes" />}
              />
            </FieldGroup>
          </form>
        </CardContent>
      </div>
      <CardFooter className="bg-background-secondary">
        <Field orientation="horizontal" className="flex justify-end">
          <Button type="button" variant="outline" onClick={backToDetails}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isPending}>
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
