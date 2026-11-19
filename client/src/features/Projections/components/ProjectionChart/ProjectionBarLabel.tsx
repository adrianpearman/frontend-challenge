import type { LabelProps } from "recharts";
import { formatCurrency } from "@/utils/functions";

const OFFSET = 16;

// Above positive bars, below negative ones, so the label never sits on the zero line.
export const ProjectionBarLabel = ({ x, y, width, height, value }: LabelProps) => {
  if (x == null || y == null || width == null || typeof value !== "number") {
    return null;
  }
  const isNegative = value < 0;
  // Recharts may hand a negative bar a negative height; its bottom edge is the larger y.
  const bottom = Math.max(Number(y), Number(y) + Number(height ?? 0));
  const top = Math.min(Number(y), Number(y) + Number(height ?? 0));

  return (
    <text
      dominantBaseline="middle"
      style={{
        fill: isNegative ? "var(--color-text-error)" : "var(--color-neutral-base)",
        fontFamily: "var(--font-display)",
        fontSize: "var(--text-body-small)",
      }}
      textAnchor="middle"
      x={Number(x) + Number(width) / 2}
      y={isNegative ? bottom + OFFSET : top - OFFSET}
    >
      {formatCurrency({ amount: value, format: "short" })}
    </text>
  );
};
