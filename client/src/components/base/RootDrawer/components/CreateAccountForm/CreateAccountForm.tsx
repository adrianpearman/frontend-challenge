import { useSelector } from "@tanstack/react-form";
import {
  ACCOUNT_TYPE_OPTIONS,
  CREATE_ACCOUNT_FORM_ID,
  CURRENCY_OPTIONS,
} from "@/components/base/RootDrawer/utils/consts";
import { useAppForm } from "@/components/base/AppForm";
import { useMutation } from "@tanstack/react-query";
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
import { formSchema } from "@/components/base/RootDrawer/components/CreateAccountForm/utils/formSchema";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import { createAccountMutation } from "@/utils/api/requests";
import { toCents } from "@/utils/functions";
import type { AccountType, CurrencyCode } from "@/utils/types";

export const CreateAccountForm = () => {
  const { mutateAsync, isPending } = useMutation(createAccountMutation());

  const form = useAppForm({
    defaultValues: {
      name: "",
      type: "" as AccountType,
      currency: "CAD" as CurrencyCode,
      openingBalance: "",
      creditLimit: "",
      institution: "",
      openedAt: "",
      color: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          name: value.name.trim(),
          type: value.type,
          currency: value.currency,
          openingBalance: value.openingBalance
            ? toCents(value.openingBalance)
            : 0,
          // The server only uses a credit limit for credit cards.
          creditLimit:
            value.type === "credit_card" && value.creditLimit
              ? toCents(value.creditLimit)
              : undefined,
          institution: value.institution.trim() || undefined,
          openedAt: value.openedAt || undefined,
          color: value.color.trim() || undefined,
        });
        toast.success("Account created.");
        form.reset();
      } catch (error) {
        toast.error(
          (isAxiosError(error) && error.response?.data?.error?.message) ||
            "Could not create the account.",
        );
      } finally {
        baseUIStoreActions.closeDrawer();
      }
    },
  });

  const accountType = useSelector(form.store, (s) => s.values.type);

  const handleResetButton = () => {
    form.reset();
    baseUIStoreActions.closeDrawer();
  };

  return (
    <Card className="w-full sm:max-w-md flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2 min-h-0 overflow-y-auto">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Add a bank account, card or wallet to track.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id={CREATE_ACCOUNT_FORM_ID}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField
                name="name"
                children={(f) => (
                  <f.TextField label="Name" placeholder="Everyday Chequing" />
                )}
              />
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
              <form.AppField
                name="currency"
                children={(f) => (
                  <f.SelectField
                    label="Currency"
                    options={CURRENCY_OPTIONS}
                    placeholder="Select a currency"
                    description="Can't be changed after the account is created."
                  />
                )}
              />
              <form.AppField
                name="openingBalance"
                children={(f) => (
                  <f.TextField
                    label="Opening balance"
                    inputMode="decimal"
                    placeholder="0.00"
                    description="Use a negative amount for money owed."
                  />
                )}
              />
              {accountType === "credit_card" && (
                <form.AppField
                  name="creditLimit"
                  children={(f) => (
                    <f.TextField
                      label="Credit limit"
                      inputMode="decimal"
                      placeholder="5000.00"
                    />
                  )}
                />
              )}

              <Accordion>
                <AccordionItem value="additional">
                  <AccordionTrigger>Additional</AccordionTrigger>
                  <AccordionContent>
                    <FieldGroup>
                      <form.AppField
                        name="institution"
                        children={(f) => (
                          <f.TextField label="Institution" placeholder="RBC" />
                        )}
                      />
                      <form.AppField
                        name="openedAt"
                        children={(f) => (
                          <f.DatePickerField label="Opened on" />
                        )}
                      />
                      <form.AppField
                        name="color"
                        children={(f) => (
                          <f.TextField label="Colour" placeholder="#2563eb" />
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
            form={CREATE_ACCOUNT_FORM_ID}
            disabled={isPending}
          >
            {isPending ? "Saving…" : "Create account"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
