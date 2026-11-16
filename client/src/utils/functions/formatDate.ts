import type { IsoDate } from "@/utils/types";

type FormatDateArgs = {
  date: IsoDate | number | null;
  format?: "short" | "long";
  showDay?: boolean;
  showTime?: boolean;
  showYear?: boolean;
};

export const formatDate = ({
  date,
  format = "short",
  showDay = true,
  showTime = false,
  showYear = false,
}: FormatDateArgs) => {
  if (date === null) {
    return "";
  }

  // A bare "YYYY-MM-DD" parses as UTC midnight (the previous day west of UTC); "T00:00" makes it local.
  const newDate = new Date(
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? `${date}T00:00`
      : date,
  );
  const month = newDate.toLocaleString("en-US", { month: format });
  const day = newDate.getDate();
  const year = newDate.getFullYear();
  const timeStamp = newDate.toLocaleTimeString();

  return `${month} ${showDay ? day : ""}${showYear ? `, ${year}` : ""}${showTime ? `- ${timeStamp}` : ""}`;
};
