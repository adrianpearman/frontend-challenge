import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/vendors/Tables/NonVirtualizedTables";
import { cn } from "@/utils/functions";

type AccountsAndBillingTableProps = {
  tableHeader: string[];
  tableRows: React.ReactNode[][];
};

const cellClassName = "h-auto py-2 px-3 whitespace-normal";
const rowClassName = "border-b-0 hover:bg-transparent";

export const AccountsAndBillingTable = ({
  tableHeader,
  tableRows,
}: AccountsAndBillingTableProps) => {
  const lastIndex = tableHeader.length - 1;

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
          <TableRow className={rowClassName} key={`table-row-item-${i}`}>
            {row.map((cell, j) => (
              <TableCell
                className={cn(
                  cellClassName,
                  "text-left",
                  typeof cell === "string" ? "text-body-small" : "text-base",
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
