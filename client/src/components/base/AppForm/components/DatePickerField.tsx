import { DatePicker } from "@/components/base/DatePicker";
import {
  type BaseFieldProps,
  useFieldShell,
} from "@/components/base/AppForm/appFormContext";

export const DatePickerField = (props: BaseFieldProps) => {
  const { field, isInvalid, shell } = useFieldShell();
  return shell(
    props,
    <DatePicker
      id={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={field.handleChange}
      aria-invalid={isInvalid}
    />,
  );
};
