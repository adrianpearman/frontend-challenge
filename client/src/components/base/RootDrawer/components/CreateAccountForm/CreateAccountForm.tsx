import { DatePicker } from "@/components/base";
import { useForm, useSelector } from "@tanstack/react-form";
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
import { formSchema } from "@/components/base/RootDrawer/components/CreateAccountForm/utils/formSchema";
import {
  ACCOUNT_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
  FORM_ID,
} from "@/components/base/RootDrawer/components/CreateAccountForm/utils/consts";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import { createAccountMutation } from "@/utils/api/requests";
import type { AccountType, CurrencyCode } from "@/utils/types";

const toCents = (v: string) => Math.round(Number(v) * 100);

export const CreateAccountForm = () => {
  const { mutateAsync, isPending } = useMutation(createAccountMutation());

  const form = useForm({
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
                        placeholder="Everyday Chequing"
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
                  ["type", "Type", ACCOUNT_TYPE_OPTIONS, "Select a type"],
                  [
                    "currency",
                    "Currency",
                    CURRENCY_OPTIONS,
                    "Select a currency",
                  ],
                ] as const
              ).map(([name, label, options, placeholder]) => (
                <form.Field
                  key={name}
                  name={name}
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
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
                            aria-invalid={isInvalid}
                            className="w-full"
                          >
                            <SelectValue placeholder={placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {name === "currency" && (
                          <FieldDescription>
                            Can't be changed after the account is created.
                          </FieldDescription>
                        )}
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              ))}
              <form.Field
                name="openingBalance"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Opening balance
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
                        placeholder="0.00"
                        autoComplete="off"
                      />
                      <FieldDescription>
                        Use a negative amount for money owed.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              {accountType === "credit_card" && (
                <form.Field
                  name="creditLimit"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Credit limit
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
                          placeholder="5000.00"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              )}

              <Accordion>
                <AccordionItem value="additional">
                  <AccordionTrigger>Additional</AccordionTrigger>
                  <AccordionContent>
                    <FieldGroup>
                      <form.Field
                        name="institution"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Institution
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
                                placeholder="RBC"
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
                        name="openedAt"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Opened on
                              </FieldLabel>
                              <DatePicker
                                id={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={field.handleChange}
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
                                placeholder="#2563eb"
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
            {isPending ? "Saving…" : "Create account"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
