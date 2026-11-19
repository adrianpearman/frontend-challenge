import { RenderedBillTableCell } from "@/features/Bills/components/BillsTable/components/RenderedBillTableCell";
import type { VirtualizedTableColumn } from "@/components/vendors/Tables/VirtualizedTables";
import type { Occurrence } from "@/utils/types";
import { cn, formatCurrency, formatDate } from "@/utils/functions";

// An occurrence with its account and category ids resolved to display names.
export type BillRow = Occurrence & {
  accountName: string;
  categoryName: string;
};

// Module scope keeps references stable between renders.
export const RenderedBillTableColumns: VirtualizedTableColumn<BillRow>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => <RenderedBillTableCell content={row.original.name} />,
    header: "Name",
    size: 250,
  },
  {
    accessorKey: "kind",
    cell: ({ row }) => (
      <RenderedBillTableCell
        className={cn(
          "capitalize",
          row.original.kind === "income" &&
            "bg-background-success text-text-success",
        )}
        content={row.original.kind}
        pill
      />
    ),
    header: "Type",
    size: 100,
  },
  {
    accessorKey: "categoryName",
    cell: ({ row }) => (
      <RenderedBillTableCell content={row.original.categoryName || "N/A"} />
    ),
    header: "Category",
    size: 110,
  },
  {
    accessorKey: "accountName",
    cell: ({ row }) => (
      <RenderedBillTableCell content={row.original.accountName} />
    ),
    header: "Account",
    size: 200,
  },
  {
    accessorKey: "date",
    cell: ({ row }) => (
      <RenderedBillTableCell
        content={formatDate({ date: row.original.date, showYear: true })}
      />
    ),
    header: "Next Due Date",
    size: 150,
  },
  {
    accessorKey: "amount",
    cell: ({ row }) => (
      <RenderedBillTableCell
        className={cn(
          "",
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
