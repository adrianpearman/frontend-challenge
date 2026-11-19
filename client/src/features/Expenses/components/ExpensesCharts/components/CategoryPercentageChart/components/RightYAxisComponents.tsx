import type { YAxisTickContentProps } from "recharts";
import type { CategoryChartDataObject } from "@/features/Expenses/utils/types";
import { formatCurrency } from "@/utils/functions";

export const RightYAxisComponents = ({
  data,
  payload,
  width,
  x,
  y,
}: YAxisTickContentProps & { data: CategoryChartDataObject[] }) => {
  const row = data[payload.index];

  return (
    <foreignObject height={20} width={Number(width)} x={x} y={Number(y) - 10}>
      <div
        className="flex h-full items-center justify-end gap-3 pr-4 tabular-nums"
        style={{
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-body-small)",
        }}
      >
        <span>
          {formatCurrency({
            amount: row.total,
            currency: row.currency,
            showCurrency: false,
          })}
        </span>
        <span className="w-12 text-right max-[500px]:hidden">
          {`${(row.percentage * 100).toFixed(1)}%`}
        </span>
      </div>
    </foreignObject>
  );
};
