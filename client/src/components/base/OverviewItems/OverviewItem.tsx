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
  title: string;
};

export const OverviewItem = ({
  className = "",
  content,
  currency = "CAD",
  onClickFn,
  subContent,
  style,
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
      style={style}
    >
      <p className="text-body-small">{title}</p>
      <h2 className="text-h4">
        {typeof content === "number"
          ? formatCurrency({ amount: content, currency })
          : content}
      </h2>
      {subContent}
    </div>
  );
};
