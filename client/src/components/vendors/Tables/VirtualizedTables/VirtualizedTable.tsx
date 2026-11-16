import { useState } from "react";
import { flexRender, useTable, type RowData } from "@tanstack/react-table";
import { TableBody } from "@/components/vendors/Tables/VirtualizedTables/components";
import { virtualizedTableFeatures } from "@/components/vendors/Tables/VirtualizedTables/utils/features";
import type { VirtualizedTableProps } from "@/components/vendors/Tables/VirtualizedTables/utils/types";
import {
  getCellClassName,
  getGridTemplateColumns,
} from "@/components/vendors/Tables/VirtualizedTables/utils/functions";
import { cn } from "@/utils/functions";

const SORT_INDICATOR: Record<string, string> = { asc: " 🔼", desc: " 🔽" };

export const VirtualizedTable = <TData extends RowData>({
  columns,
  data,
}: VirtualizedTableProps<TData>) => {
  "use no memo";

  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(
    null,
  );

  const table = useTable({
    features: virtualizedTableFeatures,
    data,
    columns,
  });

  return (
    <div>
      <div
        ref={setScrollElement}
        style={{
          maxHeight: "500px",
          minHeight: "100px",
          overflow: "auto",
          position: "relative",
        }}
      >
        <table style={{ display: "grid" }}>
          <thead
            style={{ display: "grid", position: "sticky", top: 0, zIndex: 1 }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                className="bg-brand-slate-green text-accent py-3"
                key={headerGroup.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: getGridTemplateColumns(
                    table.getAllLeafColumns(),
                  ),
                }}
              >
                {headerGroup.headers.map((header, i) => (
                  <th
                    key={header.id}
                    className={getCellClassName(
                      header.column.columnDef.meta?.headerClassName,
                    )}
                  >
                    <div
                      className={cn(
                        `flex-1 text-left px-3`,
                        headerGroup.headers.length - 1 === i && "text-right",
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {SORT_INDICATOR[header.column.getIsSorted() || ""]}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <TableBody table={table} scrollElement={scrollElement} />
        </table>
      </div>
    </div>
  );
};
