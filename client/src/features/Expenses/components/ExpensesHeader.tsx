import { useState, type Dispatch, type SetStateAction } from "react";
import { FilterDropdown, PageHeader } from "@/components/base";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/vendors";
import { EditCategoriesDialog } from "@/features/Expenses/components/EditCategoriesDialog";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import { shiftMonth, toLocalMonth } from "@/utils/functions";

type ExpensesHeaderProps = {
  accountOptions: { label: string; value: string }[];
  currentMonth: string;
  earliestMonth: string | undefined;
  selectedAccount: string;
  setCurrentMonth: Dispatch<SetStateAction<string>>;
  setSelectedAccount: (id: string) => void;
};

export const ExpensesHeader = ({
  accountOptions,
  currentMonth,
  earliestMonth,
  selectedAccount,
  setCurrentMonth,
  setSelectedAccount,
}: ExpensesHeaderProps) => {
  const [year, m] = currentMonth.split("-").map(Number);
  const monthLabel = new Date(year, m - 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  // Same source as the initial state in Expenses, so they always agree.
  const isCurrentMonth = currentMonth >= toLocalMonth();
  const [isEditCategoriesOpen, setIsEditCategoriesOpen] = useState(false);

  return (
    <PageHeader
      title="Expense Report"
      description="Spending by category per month"
      actions={
        <>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="secondary">Categories</Button>}
            />
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={() => baseUIStoreActions.openDrawer("add_category")}
              >
                Add category
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditCategoriesOpen(true)}>
                Edit categories
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <EditCategoriesDialog
            open={isEditCategoriesOpen}
            onOpenChange={setIsEditCategoriesOpen}
          />
          <Button
            aria-label="Previous month"
            disabled={
              earliestMonth === undefined || currentMonth <= earliestMonth
            }
            variant="secondary"
            onClick={() => setCurrentMonth((month) => shiftMonth(month, -1))}
          >
            {"<"}
          </Button>
          <p className="text-body min-w-32 text-center">{monthLabel}</p>
          <Button
            aria-label="Next month"
            disabled={isCurrentMonth}
            variant="secondary"
            onClick={() => setCurrentMonth((month) => shiftMonth(month, +1))}
          >
            {">"}
          </Button>
          <FilterDropdown
            dropdownClassName=" w-52"
            label="Account"
            onChange={setSelectedAccount}
            options={accountOptions}
            triggerLabel={
              accountOptions.find(({ value }) => value === selectedAccount)
                ?.label ?? "All accounts"
            }
            value={selectedAccount}
          />
        </>
      }
    />
  );
};
