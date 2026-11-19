import { useAppForm } from "@/components/base/AppForm";
import { EDIT_TRANSACTION_FORM_ID } from "@/components/base/RootDrawer/utils/consts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { LoadingDetails } from "@/components/base/RootDrawer/components";
import { ErrorLoadingDrawerComponent } from "@/components/base/RootDrawer/components/ErrorLoadingDrawerComponent/ErrorLoadingDrawerComponent";
import { splitTags } from "@/components/base/RootDrawer/utils/functions";
import { formSchema } from "@/components/base/RootDrawer/components/EditTransaction/utils/formSchema";
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
  createFetchProjects,
  createFetchTransaction,
  updateTransactionMutation,
} from "@/utils/api/requests";
import type { DropdownOption, Transaction } from "@/utils/types";
import { networkErrorMessage } from "@/utils/functions";

export const EditTransaction = () => {
  const transactionID = useBaseUIStore((state) => state.transactionID);
  const { data, isLoading, isError } = useQuery({
    ...createFetchTransaction(transactionID ?? "", {}),
    enabled: !!transactionID,
  });

  if (!transactionID) return null;
  if (isError) return <ErrorLoadingDrawerComponent drawerName="transaction" />;
  if (isLoading || !data) return <LoadingDetails />;

  // Mounted only once the transaction has loaded so the form's defaultValues are the real values.
  return <EditTransactionForm transaction={data.data} />;
};

const EditTransactionForm = ({ transaction }: { transaction: Transaction }) => {
  const { data: categories } = useQuery(createFetchCategories({}));
  const { data: projects } = useQuery(createFetchProjects({}));
  const { mutateAsync, isPending } = useMutation(updateTransactionMutation());

  const categoryOptions: DropdownOption[] =
    categories?.data.map((c) => ({ value: c.id, label: c.name })) ?? [];
  const projectOptions: DropdownOption[] =
    projects?.data.map((p) => ({ value: p.id, label: p.name })) ?? [];

  const backToDetails = () =>
    baseUIStoreActions.setDisplayedDrawerOptions("show_transaction");

  const form = useAppForm({
    defaultValues: {
      categoryId: transaction.categoryId ?? "",
      projectId: transaction.projectId ?? "",
      notes: transaction.notes ?? "",
      tags: transaction.tags.join(", "),
    },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          id: transaction.id,
          body: {
            categoryId: value.categoryId || null,
            projectId: value.projectId || null,
            notes: value.notes.trim() || null,
            tags: splitTags(value.tags),
          },
        });
        toast.success("Transaction updated.");
        backToDetails();
      } catch (error) {
        toast.error(
          networkErrorMessage({
            error,
            fallback: "Could not update the transaction.",
          }),
        );
      }
    },
  });

  const selectFields = [
    ["categoryId", "Category", categoryOptions],
    ["projectId", "Project", projectOptions],
  ] as const;

  return (
    <Card className="w-full sm:max-w-md flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2 min-h-0 overflow-y-auto">
        <CardHeader>
          <CardTitle>Edit Transaction</CardTitle>
          <CardDescription>
            {transaction.description || "Update this transaction's details."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id={EDIT_TRANSACTION_FORM_ID}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              {selectFields.map(([name, label, options]) => (
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
                    placeholder="groceries, weekly"
                    description="Separate tags with commas."
                  />
                )}
              />
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
          <Button
            type="submit"
            form={EDIT_TRANSACTION_FORM_ID}
            disabled={isPending}
          >
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
