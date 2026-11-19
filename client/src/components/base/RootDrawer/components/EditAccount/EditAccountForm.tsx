import { useSelector } from "@tanstack/react-form";
import {
  ACCOUNT_TEXT_FIELDS,
  ACCOUNT_TYPE_OPTIONS,
  ARCHIVED_OPTIONS,
  EDIT_ACCOUNT_FORM_ID,
} from "@/components/base/RootDrawer/utils/consts";
import { useAppForm } from "@/components/base/AppForm";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { formSchema } from "@/components/base/RootDrawer/components/EditAccount/utils/formSchema";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/vendors";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import { updateAccountMutation } from "@/utils/api/requests";
import { toCents, toDollars } from "@/utils/functions";
import type { Account, AccountType } from "@/utils/types";

export const EditAccountForm = ({ account }: { account: Account }) => {
  const { mutateAsync, isPending } = useMutation(updateAccountMutation());

  const form = useAppForm({
    defaultValues: {
      name: account.name,
      type: account.type as AccountType,
      openingBalance: toDollars(account.openingBalance),
      creditLimit:
        account.creditLimit === null ? "" : toDollars(account.creditLimit),
      institution: account.institution ?? "",
      openedAt: account.openedAt ?? "",
      archived: account.archivedAt !== null,
    },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          id: account.id,
          body: {
            name: value.name.trim(),
            type: value.type,
            openingBalance: value.openingBalance
              ? toCents(value.openingBalance)
              : 0,
            // The server only uses a credit limit for credit cards; null clears it.
            creditLimit:
              value.type === "credit_card" && value.creditLimit
                ? toCents(value.creditLimit)
                : null,
            institution: value.institution.trim() || null,
            openedAt: value.openedAt || undefined,
            // Keep the original archive date if it was already archived.
            archivedAt: value.archived
              ? (account.archivedAt ?? new Date().toLocaleDateString("en-CA"))
              : null,
          },
        });
        toast.success("Account updated.");
        baseUIStoreActions.closeDrawer();
      } catch (error) {
        toast.error(
          (isAxiosError(error) && error.response?.data?.error?.message) ||
            "Could not update the account.",
        );
      }
    },
  });

  const accountType = useSelector(form.store, (s) => s.values.type);

  return (
    <Card className="w-full sm:max-w-md flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2 min-h-0 overflow-y-auto">
        <CardHeader>
          <CardTitle>Edit Account</CardTitle>
          <CardDescription>
            Currency ({account.currency}) can't be changed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id={EDIT_ACCOUNT_FORM_ID}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField
                name="type"
                children={(f) => (
                  <f.SelectField
                    label="Type"
                    options={ACCOUNT_TYPE_OPTIONS}
                    placeholder="Select a type"
                  />
                )}
              />
              {ACCOUNT_TEXT_FIELDS.filter(
                ({ name }) =>
                  name !== "creditLimit" || accountType === "credit_card",
              ).map(({ name, ...props }) => (
                <form.AppField
                  key={name}
                  name={name}
                  children={(f) => <f.TextField {...props} />}
                />
              ))}
              <form.Field
                name="archived"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                    <Select
                      items={ARCHIVED_OPTIONS}
                      value={field.state.value ? "archived" : "active"}
                      onValueChange={(v) =>
                        field.handleChange(v === "archived")
                      }
                    >
                      <SelectTrigger
                        id={field.name}
                        onBlur={field.handleBlur}
                        className="w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ARCHIVED_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      Archived accounts are left out of reports. Nothing is
                      deleted.
                    </FieldDescription>
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
      </div>
      <CardFooter className="bg-background-secondary">
        <Field orientation="horizontal" className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={baseUIStoreActions.closeDrawer}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={EDIT_ACCOUNT_FORM_ID}
            disabled={isPending}
          >
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
