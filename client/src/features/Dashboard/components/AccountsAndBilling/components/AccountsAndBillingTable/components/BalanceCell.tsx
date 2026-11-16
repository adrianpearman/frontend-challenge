import { cn, formatCurrency } from "@/utils/functions";
import type { CurrencyCode } from "@/utils/types";

type BalanceCellProps = {
  amount: number;
  className?: string;
  currency: CurrencyCode;
};

export const BalanceCell = ({
  amount,
  className = "",
  currency,
}: BalanceCellProps) => {
  return (
    <span
      className={cn(
        `text-text-primary ${className}`,
        amount < 0 && "text-text-error",
      )}
    >
      {formatCurrency({ amount, currency })}
    </span>
  );
};
