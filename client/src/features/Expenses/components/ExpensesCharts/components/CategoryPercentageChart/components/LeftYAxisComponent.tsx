import { Text, type YAxisTickContentProps } from "recharts";

export const LeftYAxisComponent = ({
  width,
  x,
  y,
  payload,
}: YAxisTickContentProps) => (
  <Text
    maxLines={2}
    style={{
      fill: "var(--color-text-secondary)",
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-body-small)",
    }}
    textAnchor="start"
    verticalAnchor="middle"
    width={Number(width) - 16}
    x={Number(x) - Number(width) + 8}
    y={y}
  >
    {payload.value}
  </Text>
);
