import { RenderedBillTableCell } from "@/features/Bills/components/BillsTable/components/RenderedBillTableCell";
import type { VirtualizedTableColumn } from "@/components/vendors/Tables/VirtualizedTables";
import type { Transaction } from "@/utils/types";
import { cn, formatCurrency, formatDate } from "@/utils/functions";

// Module scope keeps references stable between renders.
export const AccountsTableColumns: VirtualizedTableColumn<Transaction>[] = [
  {
    accessorKey: "description",
    cell: ({ row }) => (
      <RenderedBillTableCell content={row.original.description} />
    ),
    header: "Description",
    size: 250,
  },
  {
    accessorKey: "status",
    cell: ({ row }) => (
      <RenderedBillTableCell
        className="capitalize"
        content={row.original.status}
        pill
      />
    ),
    header: "Status",
    size: 100,
  },
  {
    // Names come from `include=account,category` on the request.
    accessorFn: (row) => row.category?.name ?? "N/A",
    cell: ({ getValue }) => (
      <RenderedBillTableCell content={getValue<string>()} />
    ),
    header: "Category",
    id: "category",
    size: 110,
  },
  {
    accessorFn: (row) => row.account?.name ?? "",
    cell: ({ getValue }) => (
      <RenderedBillTableCell content={getValue<string>()} />
    ),
    header: "Account",
    id: "account",
    size: 200,
  },
  {
    accessorKey: "date",
    cell: ({ row }) => (
      <RenderedBillTableCell
        content={formatDate({ date: row.original.date, showYear: true })}
      />
    ),
    header: "Date",
    size: 150,
  },
  {
    accessorKey: "amount",
    cell: ({ row }) => (
      <RenderedBillTableCell
        className={cn(
          row.original.amount < 0 ? "text-text-error" : "text-text-success",
        )}
        content={formatCurrency({
          amount: row.original.amount,
          currency: row.original.currency,
        })}
      />
    ),
    header: "Amount",
    meta: { headerClassName: "justify-end", cellClassName: "justify-end" },
    size: 130,
  },
];
