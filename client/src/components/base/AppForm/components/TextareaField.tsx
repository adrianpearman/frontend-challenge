import {
  type BaseFieldProps,
  useFieldShell,
} from "@/components/base/AppForm/appFormContext";
import { Textarea } from "@/components/vendors";

export const TextareaField = ({
  label,
  description,
  placeholder,
}: BaseFieldProps & { placeholder?: string }) => {
  const { field, isInvalid, shell } = useFieldShell();
  return shell(
    { label, description },
    <Textarea
      id={field.name}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      aria-invalid={isInvalid}
      placeholder={placeholder}
      rows={4}
      className="min-h-24 resize-none"
    />,
  );
};
