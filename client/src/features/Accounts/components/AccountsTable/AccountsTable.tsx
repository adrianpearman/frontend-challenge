import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { FilterDropdown } from "@/components/base";
import { LoadingDetails } from "@/components/base/LoadingDetails";
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  VirtualizedTable,
} from "@/components/vendors";
import { AccountsTableColumns } from "@/features/Accounts/components/AccountsTable/AccountsTableColumns";
import {
  createFetchCategories,
  createFetchRecentTransactions,
} from "@/utils/api/requests";
import type { TransactionStatus } from "@/utils/types";
import { formatDate } from "@/utils/functions";

type PageSize = 50 | 100 | 150;

const PAGE_SIZE_OPTIONS = [50, 100, 150].map((size) => ({
  label: String(size),
  value: size as PageSize,
}));

// "all" is a UI-only value; it is sent as no filter.
const ALL = "all";

const STATUS_OPTIONS: {
  label: string;
  value: TransactionStatus | typeof ALL;
}[] = [
  { label: "All statuses", value: ALL },
  { label: "Posted", value: "posted" },
  { label: "Pending", value: "pending" },
];

const toIsoDate = (date: Date) => format(date, "yyyy-MM-dd"); // local date, not UTC

type AccountsTableProps = {
  accountsMap: Map<string, string>;
  currentAccount: string;
  numberOfAccounts: number;
};

export const AccountsTable = ({
  accountsMap,
  currentAccount,
  numberOfAccounts,
}: AccountsTableProps) => {
  const [pageSize, setPageSize] = useState<PageSize>(50);
  const [status, setStatus] = useState<TransactionStatus | typeof ALL>(ALL);
  const [categoryId, setCategoryId] = useState<string>(ALL);
  // Default: the two weeks ending today.
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const today = new Date();
    return { from: subDays(today, 13), to: today };
  });

  // While a new range is half-picked (only `from`), query that single day.
  const from = dateRange?.from ? toIsoDate(dateRange.from) : undefined;
  const to = dateRange?.to ? toIsoDate(dateRange.to) : from;

  // The page is remembered per filter combination, so any filter change (including the account) starts at page 1.
  const filterKey = [
    currentAccount,
    categoryId,
    status,
    pageSize,
    from,
    to,
  ].join("|");
  const [paging, setPaging] = useState({ filterKey, page: 1 });
  const page = paging.filterKey === filterKey ? paging.page : 1;
  const goToPage = (nextPage: number) =>
    setPaging({ filterKey, page: nextPage });

  const { data, isError, isLoading } = useQuery({
    ...createFetchRecentTransactions({
      params: {
        accountId: currentAccount || undefined,
        categoryId: categoryId === ALL ? undefined : categoryId,
        from,
        include: "account,category",
        page,
        pageSize,
        sort: "-date",
        status: status === ALL ? undefined : status,
        to,
      },
    }),
    placeholderData: keepPreviousData, // keep rows on screen while filters change
  });

  const { data: categories } = useQuery(createFetchCategories({}));

  const categoryOptions = [
    { label: "All categories", value: ALL },
    ...(categories?.data ?? []).map(({ id, name }) => ({
      label: name,
      value: id,
    })),
  ];

  return (
    <div className="border border-neutral-border rounded-md flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 p-3">
        <p>
          {currentAccount === ""
            ? `Transactions for all ${numberOfAccounts} account(s)`
            : `Transactions for: ${accountsMap.get(currentAccount)}`}
        </p>
        <div className="flex gap-2 items-center">
          <FilterDropdown
            label="Status"
            onChange={setStatus}
            options={STATUS_OPTIONS}
            triggerLabel={
              STATUS_OPTIONS.find((o) => o.value === status)?.label ??
              "All statuses"
            }
            value={status}
          />
          <FilterDropdown
            label="Category"
            onChange={setCategoryId}
            options={categoryOptions}
            triggerLabel={
              categoryOptions.find((o) => o.value === categoryId)?.label ??
              "All categories"
            }
            value={categoryId}
          />
          <FilterDropdown
            label="Results per page"
            onChange={setPageSize}
            options={PAGE_SIZE_OPTIONS}
            triggerLabel={`${pageSize} per page`}
            value={pageSize}
          />
          <Popover>
            <PopoverTrigger
              render={
                <Button variant="default">
                  {from
                    ? `${formatDate({ date: from, showYear: true })} – ${formatDate({ date: to ?? from, showYear: true })}`
                    : "Select dates"}
                </Button>
              }
            />
            <PopoverContent align="end" className="w-auto p-0">
              <Calendar
                defaultMonth={dateRange?.from}
                disabled={{ after: new Date() }}
                mode="range"
                numberOfMonths={2}
                onSelect={setDateRange}
                selected={dateRange}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {data && <p className="p-3">{data.meta.count} transaction(s)</p>}
      {isLoading && (
        <div className="flex flex-col gap-2 p-3">
          <LoadingDetails overrideLength={5} />
        </div>
      )}
      {!isLoading && !isError && (
        <VirtualizedTable
          columns={AccountsTableColumns}
          data={data?.data ?? []}
        />
      )}
      {data && (
        <div className="flex items-center justify-end gap-3 p-3">
          <Button
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            variant="secondary"
          >
            Previous
          </Button>
          <span className="text-body-small tabular-nums">
            {data.meta.page} / {data.meta.totalPages}
          </span>
          <Button
            disabled={!data.meta.hasMore}
            onClick={() => goToPage(page + 1)}
            variant="secondary"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
