import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
import { addDays, formatDate, toLocalDate } from "@/utils/functions";
import { createFetchOccurrences } from "@/utils/api/requests";
import { RenderedBillTable } from "@/features/Bills/components/BillsTable/components";
import type { ScheduledItemKind } from "@/utils/types";

type DateRanges = 30 | 60 | 90;

type ScheduledItems = "all" | ScheduledItemKind;

const DATE_RANGES: DateRanges[] = [30, 60, 90];

const SCHEDULED_ITEM_KINDS: ScheduledItems[] = ["all", "bill", "income"];

export const BillsTable = () => {
  const [dateRangeValue, setDateRangeValue] = useState<DateRanges>(30);
  const [selectedScheduleItem, setSelectedScheduleItem] =
    useState<ScheduledItems>("all");

  const formattedDate = toLocalDate();
  const formattedEndDate = toLocalDate(addDays(dateRangeValue));

  const { data, isError, isLoading } = useQuery({
    ...createFetchOccurrences({
      params: {
        from: formattedDate,
        kind: selectedScheduleItem === "all" ? undefined : selectedScheduleItem,
        to: formattedEndDate,
      },
    }),
    placeholderData: keepPreviousData, // keep the old rows on screen while the new range loads
  });

  return (
    <div className="flex flex-col flex-1 border border-neutral-border rounded-md">
      <div className="flex justify-between p-3">
        <div className="flex gap-2">
          {SCHEDULED_ITEM_KINDS.map((item, i) => {
            const isSelected = item === selectedScheduleItem;
            return (
              <Button
                className="capitalize"
                key={`scheduled-item-button-${i}`}
                onClick={() => setSelectedScheduleItem(item)}
                variant={isSelected ? "default" : "secondary"}
              >
                {item}
              </Button>
            );
          })}
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="secondary">
            <span>{formatDate({ date: formattedDate, showYear: true })}</span>{" "}
            to{" "}
            <span>
              {formatDate({ date: formattedEndDate, showYear: true })}
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="default">Select Timeframe</Button>}
            />
            <DropdownMenuContent className="w-40">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Timeframe</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={dateRangeValue}
                  onValueChange={setDateRangeValue}
                >
                  {DATE_RANGES.map((date, i) => {
                    return (
                      <DropdownMenuRadioItem
                        closeOnClick
                        key={`date-range-item-${i}`}
                        value={date}
                      >
                        {date} days
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-col p-3 text-body">
        <p>{data?.totals.occurrenceCount ?? 0} Results</p>
      </div>
      <RenderedBillTable
        data={data?.occurrences ?? []}
        isError={isError}
        isLoading={isLoading}
      />
    </div>
  );
};
