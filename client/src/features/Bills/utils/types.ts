import type { Occurrence } from "@/utils/types";

export type BillRow = Occurrence & {
  accountName: string;
  categoryName: string;
};
