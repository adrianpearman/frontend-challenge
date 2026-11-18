import { useForm, useSelector } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { ACCOUNT_TYPE_OPTIONS } from "@/components/base/RootDrawer/components/CreateAccountForm/utils/consts";
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
import { baseUIStoreActions } from "@/store/BaseUIStore";
import { updateAccountMutation } from "@/utils/api/requests";
import {
  FORM_ID,
  TEXT_FIELDS,
  toCents,
  toDollars,
} from "@/components/base/RootDrawer/components/EditAccount/utils/consts";
import type { Account, AccountType } from "@/utils/types";

export const EditAccountForm = ({ account }: { account: Account }) => {
  const { mutateAsync, isPending } = useMutation(updateAccountMutation());

  const form = useForm({
    defaultValues: {
      name: account.name,
      type: account.type as AccountType,
      openingBalance: toDollars(account.openingBalance),
      creditLimit:
        account.creditLimit === null ? "" : toDollars(account.creditLimit),
      institution: account.institution ?? "",
      openedAt: account.openedAt ?? "",
      color: account.color ?? "",
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
            color: value.color.trim() || undefined,
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
            id={FORM_ID}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="type"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                      <Select
                        items={ACCOUNT_TYPE_OPTIONS}
                        value={field.state.value || null}
                        onValueChange={(v) =>
                          field.handleChange((v ?? "") as AccountType)
                        }
                      >
                        <SelectTrigger
                          id={field.name}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          className="w-full"
                        >
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          {ACCOUNT_TYPE_OPTIONS.map((o) => (
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
              {TEXT_FIELDS.filter(
                ({ name }) =>
                  name !== "creditLimit" || accountType === "credit_card",
              ).map(
                ({
                  name,
                  label,
                  placeholder,
                  type,
                  inputMode,
                  description,
                }) => (
                  <form.Field
                    key={name}
                    name={name}
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            type={type ?? "text"}
                            inputMode={inputMode}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder={placeholder}
                            autoComplete="off"
                          />
                          {description && (
                            <FieldDescription>{description}</FieldDescription>
                          )}
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                ),
              )}
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
          <Button type="submit" form={FORM_ID} disabled={isPending}>
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
