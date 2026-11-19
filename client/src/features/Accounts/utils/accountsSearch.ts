import type { TransactionStatus } from "@/utils/types";

export const PAGE_SIZES = [50, 100, 150] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

// Every field is optional: a missing param means the default (all accounts, all
// statuses, 50 per page, last two weeks, page 1), so default URLs stay clean.
export type AccountsSearch = {
  account?: string;
  archived?: boolean;
  category?: string;
  from?: string; // YYYY-MM-DD
  page?: number;
  pageSize?: PageSize;
  status?: TransactionStatus;
  to?: string; // YYYY-MM-DD
};

const STATUSES: TransactionStatus[] = ["posted", "pending"];
const isDate = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

// The URL is user input: anything malformed is dropped rather than sent to the API.
export const validateAccountsSearch = (
  search: Record<string, unknown>,
): AccountsSearch => {
  const page = Number(search.page);
  const pageSize = Number(search.pageSize);
  return {
    account: str(search.account),
    archived:
      search.archived === true || search.archived === "true" || undefined,
    category: str(search.category),
    from: isDate(search.from) ? search.from : undefined,
    page: Number.isInteger(page) && page > 1 ? page : undefined,
    pageSize: PAGE_SIZES.includes(pageSize as PageSize)
      ? (pageSize as PageSize)
      : undefined,
    status: STATUSES.includes(search.status as TransactionStatus)
      ? (search.status as TransactionStatus)
      : undefined,
    to: isDate(search.to) ? search.to : undefined,
  };
};
