import { type LabelProps } from "recharts";
import { formatCurrency } from "@/utils/functions";

export const MonthlyExpenseLabel = (props: LabelProps) => {
  const { x, y, width, value } = props;

  if (x == null || y == null || width == null) {
    return null;
  }
  const offset = 16;

  const displayedAmount =
    typeof value === "number"
      ? formatCurrency({ amount: value, format: "short" })
      : 0;

  return (
    <g>
      <text
        dominantBaseline="middle"
        style={{
          fill: "var(--color-neutral-base)",
          paddingBottom: "1rem",
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-body-small)",
        }}
        textAnchor="middle"
        x={Number(x) + Number(width) / 2}
        y={Number(y) - offset}
      >
        {displayedAmount}
      </text>
    </g>
  );
};
