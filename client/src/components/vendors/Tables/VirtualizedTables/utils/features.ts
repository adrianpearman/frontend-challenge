import {
  columnSizingFeature,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table";
import type { VirtualizedTableColumnMeta } from "@/components/vendors/Tables/VirtualizedTables/utils/types";

export const virtualizedTableFeatures = tableFeatures({
  columnSizingFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  columnMeta: {} as VirtualizedTableColumnMeta, // type-only: types `columnDef.meta`
});
