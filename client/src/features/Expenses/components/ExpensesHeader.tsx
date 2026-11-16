import type { Dispatch, SetStateAction } from "react";
import { FilterDropdown } from "@/components/base";
import { Button } from "@/components/vendors";

type ExpensesHeaderProps = {
  accountOptions: { label: string; value: string }[];
  currentMonth: string; // YYYY-MM
  selectedAccount: string;
  setCurrentMonth: Dispatch<SetStateAction<string>>;
  setSelectedAccount: (id: string) => void;
};

// Local date math so month rollover (Jan -> Dec) is handled by Date.
const shiftMonth = (month: string, delta: number) => {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(year, m - 1 + delta);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export const ExpensesHeader = ({
  currentMonth,
  setCurrentMonth,
  accountOptions,
  selectedAccount,
  setSelectedAccount,
}: ExpensesHeaderProps) => {
  const [year, m] = currentMonth.split("-").map(Number);
  const monthLabel = new Date(year, m - 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  // Same source as the initial state in Expenses, so they always agree.
  const isCurrentMonth = currentMonth >= new Date().toISOString().slice(0, 7);

  return (
    <div className="flex justify-between p-3">
      <div className="flex flex-col">
        <h1 className="text-h4">Expense Report</h1>
        <p className="text-body-small">Spending by category per month</p>
      </div>
      <div className="flex gap-2 items-center">
        <Button
          aria-label="Previous month"
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
      </div>
    </div>
  );
};
