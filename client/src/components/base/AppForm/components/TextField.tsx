import type { ComponentProps } from "react";
import {
  type BaseFieldProps,
  useFieldShell,
} from "@/components/base/AppForm/appFormContext";
import { Input } from "@/components/vendors";

export const TextField = ({
  label,
  description,
  ...inputProps
}: BaseFieldProps &
  Pick<ComponentProps<"input">, "placeholder" | "type" | "inputMode">) => {
  const { field, isInvalid, shell } = useFieldShell();
  return shell(
    { label, description },
    <Input
      id={field.name}
      name={field.name}
      type="text"
      autoComplete="off"
      {...inputProps}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      aria-invalid={isInvalid}
    />,
  );
};
