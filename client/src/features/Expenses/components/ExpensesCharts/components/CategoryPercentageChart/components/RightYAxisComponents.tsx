import type { YAxisTickContentProps } from "recharts";
import type { CategoryChartDataObject } from "@/features/Expenses/utils/types";

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
          color: "#666",
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-body-small)",
        }}
      >
        <span>{`$${row.total}`}</span>
        <span className="w-12 text-right">
          {`${(row.percentage * 100).toFixed(1)}%`}
        </span>
      </div>
    </foreignObject>
  );
};
