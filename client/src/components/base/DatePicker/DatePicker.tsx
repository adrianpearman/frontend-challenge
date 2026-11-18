import { useState } from "react";
import { format, isValid, parse } from "date-fns";
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/vendors";

type DatePickerProps = {
  "aria-invalid"?: boolean;
  id?: string;
  onBlur?: () => void;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string; // YYYY-MM-DD
};

// Parse as a local date; `new Date("YYYY-MM-DD")` is UTC and can shift a day.
const toDate = (value: string) => {
  const date = parse(value, "yyyy-MM-dd", new Date());
  return isValid(date) ? date : undefined;
};

export const DatePicker = ({
  "aria-invalid": ariaInvalid,
  id,
  onBlur,
  onChange,
  placeholder = "Select date",
  value,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const selected = toDate(value);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) onBlur?.();
      }}
    >
      <PopoverTrigger
        render={
          <Button
            aria-invalid={ariaInvalid}
            className="w-full justify-start font-normal"
            id={id}
            type="button"
            variant="outline"
          >
            {selected ? format(selected, "MMM d, yyyy") : placeholder}
          </Button>
        }
      />
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          defaultMonth={selected}
          mode="single"
          onSelect={(date) => {
            if (!date) return;
            onChange(format(date, "yyyy-MM-dd"));
            setOpen(false);
            onBlur?.();
          }}
          selected={selected}
        />
      </PopoverContent>
    </Popover>
  );
};
