import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/vendors/Tables/NonVirtualizedTables";
import { cn } from "@/utils/functions";

// The last column is right-aligned (amounts).
export type ClickableTableRow = { id: string; cells: ReactNode[] };

type ClickableTableProps = {
  caption?: string;
  onRowClick: (id: string) => void;
  tableHeader: string[];
  tableRows: ClickableTableRow[];
};

const cellClassName = "h-auto py-2 px-3 whitespace-normal";
const rowClassName = "border-b-0 hover:bg-transparent";

export const ClickableTable = ({
  caption,
  onRowClick,
  tableHeader,
  tableRows,
}: ClickableTableProps) => {
  const lastIndex = tableHeader.length - 1;

  return (
    <Table className="text-base">
      {caption && <TableCaption className="my-2">{caption}</TableCaption>}
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
        {tableRows.map(({ id, cells }) => (
          <TableRow
            className={rowClassName}
            key={id}
            tabIndex={0}
            onClick={() => onRowClick(id)}
            onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) =>
              e.key === "Enter" && onRowClick(id)
            }
          >
            {cells.map((cell, j) => (
              <TableCell
                className={cn(
                  cellClassName,
                  "text-left cursor-pointer text-body-small",
                  j === cells.length - 1 && "text-right",
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
