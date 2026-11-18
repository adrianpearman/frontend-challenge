import { isValidElement, type ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/vendors/Tables/NonVirtualizedTables";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import { cn } from "@/utils/functions";

type AccountsAndBillingTableProps = {
  table: "accounts" | "billing";
  tableHeader: string[];
  tableRows: React.ReactNode[][];
};

const cellClassName = "h-auto py-2 px-3 whitespace-normal";
const rowClassName = "border-b-0 hover:bg-transparent";

export const AccountsAndBillingTable = ({
  table,
  tableHeader,
  tableRows,
}: AccountsAndBillingTableProps) => {
  const lastIndex = tableHeader.length - 1;

  const handleSelectedRow = (row: ReactNode[]) => {
    if (!row) {
      return;
    }

    const categoryRow =
      isValidElement<{ "data-row-category-id"?: string }>(row[0]) &&
      row[0].props["data-row-category-id"];
    if (!categoryRow) return;

    const tableType = table === "accounts";

    if (tableType) {
      baseUIStoreActions.setAccountID(categoryRow);
    } else {
      baseUIStoreActions.setTransactionID(categoryRow);
    }

    baseUIStoreActions.openDrawer(tableType ? "show_account" : "show_upcoming");
  };

  return (
    <Table className="text-base">
      <TableHeader className="[&_tr]:border-b-0">
        <TableRow
          className={cn(
            rowClassName,
            "bg-brand-slate-green text-accent hover:bg-brand-slate-green",
          )}
        >
          {tableHeader.map((cell, i) => (
            <TableHead
              className={cn(
                cellClassName,
                "text-base font-bold text-accent",
                i === lastIndex && "text-right",
              )}
              key={`table-header-cell-${i}`}
            >
              <span className="text-h6">{cell}</span>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableRows.map((row, i) => (
          <TableRow
            className={rowClassName}
            key={`table-row-item-${i}`}
            tabIndex={0}
            onClick={() => handleSelectedRow(row)}
            onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) =>
              e.key === "Enter" && handleSelectedRow(row)
            }
          >
            {row.map((cell, j) => (
              <TableCell
                className={cn(
                  cellClassName,
                  "text-left cursor-pointer text-body-small",
                  j === row.length - 1 && "text-right",
                )}
                key={`table-row-cell-item-${j}`}
              >
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
