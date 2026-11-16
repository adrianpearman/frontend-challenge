import type {
  ColumnDef,
  ReactTable,
  Row,
  RowData,
} from "@tanstack/react-table";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import type { virtualizedTableFeatures } from "@/components/vendors/Tables/VirtualizedTables/utils/features";

export type VirtualizedTableFeatures = typeof virtualizedTableFeatures;

// Callers type their columns with this so they match the table's features.
export type VirtualizedTableColumn<TData extends RowData> = ColumnDef<
  VirtualizedTableFeatures,
  TData
>;

export type VirtualizedTableProps<TData extends RowData> = {
  columns: VirtualizedTableColumn<TData>[];
  data: TData[];
};

export type TableBodyProps<TData extends RowData> = {
  table: ReactTable<VirtualizedTableFeatures, TData>;
  // Element (not a ref) so the body re-renders once the container mounts.
  scrollElement: HTMLDivElement | null;
};

export type TableBodyRowProps<TData extends RowData> = {
  gridTemplateColumns: string;
  row: Row<VirtualizedTableFeatures, TData>;
  virtualRow: VirtualItem;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
};

// Set via `meta` on a column def; merged into that column's <th>/<td> classes.
export type VirtualizedTableColumnMeta = {
  headerClassName?: string;
  cellClassName?: string;
};
