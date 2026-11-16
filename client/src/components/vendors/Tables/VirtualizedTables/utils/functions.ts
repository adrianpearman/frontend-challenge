import type { Column, RowData } from "@tanstack/react-table";
import { cn } from "@/utils/functions";
import type { VirtualizedTableFeatures } from "@/components/vendors/Tables/VirtualizedTables/utils/types";

// One template shared by header and body rows keeps their columns aligned.
// `size` is each column's minimum width and its share of leftover space; unsized columns use the 150px default.
export const getGridTemplateColumns = <TData extends RowData>(
  columns: Column<VirtualizedTableFeatures, TData>[],
) =>
  columns
    .map((column) => {
      const size = column.getSize();
      return `minmax(${size}px, ${size}fr)`;
    })
    .join(" ");

// min-w-0 lets long content wrap instead of widening its grid track.
export const getCellClassName = (className?: string) =>
  cn("flex items-start min-w-0", className);
