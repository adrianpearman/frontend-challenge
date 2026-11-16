import { flexRender } from "@tanstack/react-table";
import type { RowData } from "@tanstack/react-table";
import type { TableBodyRowProps } from "@/components/vendors/Tables/VirtualizedTables/utils/types";
import { getCellClassName } from "@/components/vendors/Tables/VirtualizedTables/utils/functions";

export const TableBodyRow = <TData extends RowData>({
  gridTemplateColumns,
  row,
  virtualRow,
  rowVirtualizer,
}: TableBodyRowProps<TData>) => {
  "use no memo"; // see TableBody
  return (
    <tr
      className="py-4"
      data-index={virtualRow.index} // needed for dynamic row height measurement
      ref={(node) => rowVirtualizer.measureElement(node)}
      style={{
        display: "grid",
        gridTemplateColumns,
        position: "absolute",
        transform: `translateY(${virtualRow.start}px)`, // changes on scroll, so keep it inline
        width: "100%",
      }}
    >
      {row.getAllCells().map((cell) => (
        <td
          key={cell.id}
          className={getCellClassName(
            cell.column.columnDef.meta?.cellClassName,
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};
