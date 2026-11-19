import type { Dispatch, SetStateAction } from "react";
import { FilterDropdown, PageHeader } from "@/components/base";
import { Button } from "@/components/vendors";
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

  return (
    <PageHeader
      title="Expense Report"
      description="Spending by category per month"
      actions={
        <>
          <div>
            <Button
              onClick={() => baseUIStoreActions.openDrawer("add_category")}
              variant="secondary"
            >
              Add Category
            </Button>
          </div>
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
