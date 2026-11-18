import type { AccountType, CurrencyCode } from "@/utils/types/apiTypes";

// Base Query Type
export type BaseQueryArgs = {
  refetchInterval?: number | false;
  staleTime?: number;
};

// Map Types
export type AccountTypeMapType = {
  [key in AccountType]?: string;
};
export type CurrencyConversionMapType = {
  [key in CurrencyCode]?: number;
};
export type CurrencyDenominationMapType = {
  [key in CurrencyCode]?: string;
};

// UI Types
export type NavigationItemProps = {
  to: string;
  name: string;
};

export type TableCellType = {
  cell: React.ReactNode;
  className: string;
};

export type TableRowItem = {
  id: string;
  data: TableCellType[];
};
