import type { CSSProperties } from "react";
import { cn, formatCurrency } from "@/utils/functions";
import type { CurrencyCode } from "@/utils/types";

type OverviewItemProps = {
  className?: string;
  content: number | string;
  currency?: CurrencyCode;
  onClickFn?: () => void;
  subContent: React.ReactNode;
  style?: CSSProperties;
  tabIndex?: number;
  title: React.ReactNode;
};

export const OverviewItem = ({
  className = "",
  content,
  currency = "CAD",
  onClickFn,
  subContent,
  style,
  tabIndex = -1,
  title,
}: OverviewItemProps) => {
  const handleClick = () => {
    if (!onClickFn) {
      return;
    }

    onClickFn();
  };
  return (
    <div
      className={cn(
        `flex-1 border border-neutral-border rounded-md p-4 flex flex-col gap-2 min-h-32 ${className}`,
      )}
      onClick={handleClick}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        handleClick();
      }}
      style={style}
      tabIndex={tabIndex}
    >
      {title}
      <h2 className="text-h4">
        {typeof content === "number"
          ? formatCurrency({ amount: content, currency })
          : content}
      </h2>
      {subContent}
    </div>
  );
};
