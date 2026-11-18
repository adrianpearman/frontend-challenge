import {
  type BaseFieldProps,
  useFieldShell,
} from "@/components/base/AppForm/appFormContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/vendors";
import type { DropdownOption } from "@/utils/types";

export const SelectField = ({
  label,
  description,
  options,
  placeholder,
  onValueChange,
}: BaseFieldProps & {
  options: readonly DropdownOption[];
  placeholder?: string;
  // Runs after the field updates, for side effects such as clearing a dependent field.
  onValueChange?: (value: string) => void;
}) => {
  const { field, isInvalid, shell } = useFieldShell();
  return shell(
    { label, description },
    <Select
      items={options}
      value={field.state.value || null}
      onValueChange={(v) => {
        field.handleChange(v ?? "");
        onValueChange?.(v ?? "");
      }}
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
    </Select>,
  );
};
