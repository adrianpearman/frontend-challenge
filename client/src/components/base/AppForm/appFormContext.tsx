import type { ReactNode } from "react";
import { createFormHookContexts } from "@tanstack/react-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/vendors";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export type BaseFieldProps = { label: string; description?: ReactNode };

export const useFieldShell = () => {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const shell = (
    { label, description }: BaseFieldProps,
    control: ReactNode,
  ) => (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      {control}
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
  return { field, isInvalid, shell };
};
