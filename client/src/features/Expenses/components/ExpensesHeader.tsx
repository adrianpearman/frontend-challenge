import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
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
import { useExpensesFilters } from "@/features/Expenses/utils/expensesSearch";
import { shiftMonth } from "@/utils/functions";

export const ExpensesHeader = () => {
  const {
    accounts,
    currentMonth,
    earliestMonth,
    selectedAccount,
    setAccount,
    setMonth,
    thisMonth,
  } = useExpensesFilters();
  const accountOptions = [
    { label: "All accounts", value: "all" },
    ...accounts.map(({ id, name }) => ({ label: name, value: id })),
  ];
  const [year, m] = currentMonth.split("-").map(Number);
  const monthLabel = new Date(year, m - 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const isCurrentMonth = currentMonth >= thisMonth;
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
            onClick={() => setMonth(shiftMonth(currentMonth, -1))}
          >
            <ChevronLeftIcon />
          </Button>
          <p className="text-body min-w-32 text-center">{monthLabel}</p>
          <Button
            aria-label="Next month"
            disabled={isCurrentMonth}
            variant="secondary"
            onClick={() => setMonth(shiftMonth(currentMonth, 1))}
          >
            <ChevronRightIcon />
          </Button>
          <FilterDropdown
            dropdownClassName=" w-52"
            label="Account"
            onChange={setAccount}
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
