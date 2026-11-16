import { cn } from "@/utils/functions";

type RenderedBillTableCellProps = {
  className?: string;
  content: string;
  pill?: boolean;
};

export const RenderedBillTableCell = ({
  className = "",
  content,
  pill = false,
}: RenderedBillTableCellProps) => {
  return (
    <span
      className={cn(
        `px-3 py-1.5 text-body-small`,
        className,
        pill && "bg-neutral-surface rounded-xl",
      )}
    >
      {content}
    </span>
  );
};
