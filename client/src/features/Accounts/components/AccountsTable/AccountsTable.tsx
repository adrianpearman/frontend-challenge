import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { format, parseISO, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { FilterDropdown } from "@/components/base";
import { LoadingDetails } from "@/components/base/RootDrawer/components";
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
import {
  type AccountsSearch,
  PAGE_SIZES,
} from "@/features/Accounts/utils/accountsSearch";
import type { TransactionStatus } from "@/utils/types";
import { formatDate } from "@/utils/functions";

const PAGE_SIZE_OPTIONS = PAGE_SIZES.map((size) => ({
  label: String(size),
  value: size,
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
  const search = useSearch({ from: "/accounts" });
  const navigate = useNavigate({ from: "/accounts" });

  const pageSize = search.pageSize ?? 50;
  const status = search.status ?? ALL;
  const categoryId = search.category ?? ALL;
  const page = search.page ?? 1;

  // No dates in the URL means the default: the two weeks ending today.
  const today = new Date();
  const dateRange: DateRange | undefined =
    search.from || search.to
      ? {
          from: search.from ? parseISO(search.from) : undefined,
          to: search.to ? parseISO(search.to) : undefined,
        }
      : { from: subDays(today, 13), to: today };

  // While a new range is half-picked (only `from`), query that single day.
  const from = dateRange?.from ? toIsoDate(dateRange.from) : undefined;
  const to = dateRange?.to ? toIsoDate(dateRange.to) : from;

  // Any filter change starts at page 1, so `page` is dropped from the URL.
  const setFilters = (patch: Partial<AccountsSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch, page: undefined }) });
  const goToPage = (nextPage: number) =>
    navigate({
      search: (prev) => ({
        ...prev,
        page: nextPage > 1 ? nextPage : undefined,
      }),
    });

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
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 max-[600px]:flex-col">
        <p>
          {currentAccount === ""
            ? `Transactions for all ${numberOfAccounts} account(s)`
            : `Transactions for: ${accountsMap.get(currentAccount)}`}
        </p>
        <div className="flex gap-2 flex-wrap  items-center max-[600px]:flex-1 max-[600px]:flex-col max-[600px]:items-stretch  max-[600px]:w-full">
          <FilterDropdown
            label="Status"
            onChange={(value) =>
              setFilters({ status: value === ALL ? undefined : value })
            }
            options={STATUS_OPTIONS}
            triggerLabel={
              STATUS_OPTIONS.find((o) => o.value === status)?.label ??
              "All statuses"
            }
            value={status}
          />
          <FilterDropdown
            label="Category"
            onChange={(value) =>
              setFilters({ category: value === ALL ? undefined : value })
            }
            options={categoryOptions}
            triggerLabel={
              categoryOptions.find((o) => o.value === categoryId)?.label ??
              "All categories"
            }
            value={categoryId}
          />
          <FilterDropdown
            label="Results per page"
            onChange={(value) =>
              setFilters({ pageSize: value === 50 ? undefined : value })
            }
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
                onSelect={(range) =>
                  setFilters({
                    from: range?.from ? toIsoDate(range.from) : undefined,
                    to: range?.to ? toIsoDate(range.to) : undefined,
                  })
                }
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
