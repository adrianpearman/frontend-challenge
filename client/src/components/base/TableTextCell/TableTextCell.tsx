import { cn } from "@/utils/functions";

type TableTextCellProps = {
  className?: string;
  content: string;
  pill?: boolean;
};

export const TableTextCell = ({
  className = "",
  content,
  pill = false,
}: TableTextCellProps) => {
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
