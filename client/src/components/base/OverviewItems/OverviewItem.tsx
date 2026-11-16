import type { CSSProperties } from "react";
import { cn, formatCurrency } from "@/utils/functions";

type OverviewItemProps = {
  amount: number;
  className?: string;
  content: React.ReactNode;
  onClickFn?: () => void;
  style?: CSSProperties;
  title: string;
};

export const OverviewItem = ({
  amount,
  className = "",
  content,
  onClickFn,
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
      <h2 className="text-h4">{formatCurrency({ amount })}</h2>
      {content}
    </div>
  );
};
