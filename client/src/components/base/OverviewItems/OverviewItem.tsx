import type { CSSProperties } from "react";
import { cn, formatCurrency } from "@/utils/functions";
import type { CurrencyCode } from "@/utils/types";

type OverviewItemProps = {
  className?: string;
  content: number | string;
  currency?: CurrencyCode;
  onClickFn?: () => void;
  pressed?: boolean;
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
  pressed,
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
      aria-pressed={onClickFn ? pressed : undefined}
      onClick={handleClick}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        handleClick();
      }}
      role={onClickFn ? "button" : undefined}
      style={style}
      tabIndex={tabIndex}
    >
      {title}
      <h2 className="text-h4">
        {typeof content === "number"
          ? formatCurrency({
              amount: Number.isFinite(content) ? content : 0,
              currency,
            })
          : content}
      </h2>
      {subContent}
    </div>
  );
};
