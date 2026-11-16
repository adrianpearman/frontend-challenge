import { useVirtualizer } from "@tanstack/react-virtual";
import { TableBodyRow } from "@/components/vendors/Tables/VirtualizedTables/components/TableBodyRow";
import type { RowData } from "@tanstack/react-table";
import type { TableBodyProps } from "@/components/vendors/Tables/VirtualizedTables/utils/types";
import { getGridTemplateColumns } from "@/components/vendors/Tables/VirtualizedTables/utils/functions";

// Firefox measures table border height incorrectly, so fall back to estimateSize there.
const measureElement = navigator.userAgent.includes("Firefox")
  ? undefined
  : (element: Element) => element.getBoundingClientRect().height;

export const TableBody = <TData extends RowData>({
  table,
  scrollElement,
}: TableBodyProps<TData>) => {
  "use no memo"; // TanStack Table/Virtual mutate stable objects; the React Compiler would cache stale output.
  const { rows } = table.getRowModel();
  const gridTemplateColumns = getGridTemplateColumns(table.getAllLeafColumns());

  // Keep the virtualizer in the lowest component possible to avoid unnecessary re-renders.
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 33,
    getScrollElement: () => scrollElement,
    measureElement,
    overscan: 5,
  });

  return (
    <tbody
      style={{
        display: "grid",
        height: `${rowVirtualizer.getTotalSize()}px`, // tells the scrollbar how big the table is
        position: "relative",
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index]!;
        return (
          <TableBodyRow
            key={row.id}
            row={row}
            virtualRow={virtualRow}
            rowVirtualizer={rowVirtualizer}
            gridTemplateColumns={gridTemplateColumns}
          />
        );
      })}
    </tbody>
  );
};
