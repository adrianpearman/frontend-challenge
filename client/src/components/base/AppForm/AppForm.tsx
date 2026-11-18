import { createFormHook } from "@tanstack/react-form";

import {
  DatePickerField,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/base/AppForm/components";
import {
  fieldContext,
  formContext,
} from "@/components/base/AppForm/appFormContext";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, TextareaField, SelectField, DatePickerField },
  formComponents: {},
});
