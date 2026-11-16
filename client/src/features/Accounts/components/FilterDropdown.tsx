import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/vendors";

type FilterOption<T> = { label: string; value: T };

type FilterDropdownProps<T extends string | number> = {
  label: string;
  onChange: (value: T) => void;
  options: FilterOption<T>[];
  triggerLabel: string;
  value: T;
};

// Single-choice dropdown used by the transaction table controls.
export const FilterDropdown = <T extends string | number>({
  label,
  onChange,
  options,
  triggerLabel,
  value,
}: FilterDropdownProps<T>) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      render={<Button variant="secondary">{triggerLabel}</Button>}
    />
    <DropdownMenuContent className="w-48">
      <DropdownMenuGroup>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem
              closeOnClick
              key={`${label}-${option.value}`}
              value={option.value}
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);
