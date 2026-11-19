import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Rectangle,
  XAxis,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import { MonthlyExpenseLabel } from "@/features/Expenses/components/ExpensesCharts/components/HistoricalMonthlyExpenseChart/components";
import type { BarShapeProps } from "recharts";
import type { ExpensesChartDataObject } from "@/features/Expenses/utils/types";

type HistoricalMonthlyExpenseChartProps = {
  data: ExpensesChartDataObject[];
};

export const HistoricalMonthlyExpenseChart = ({
  data,
}: HistoricalMonthlyExpenseChartProps) => {
  return (
    <div className="flex-1 flex flex-col gap-3 border border-neutral-border rounded-md p-4">
      <h2 className="text-h5">Last 6 months</h2>
      <BarChart
        barCategoryGap="10%"
        data={data}
        margin={{
          bottom: 5,
          left: 0,
          right: 0,
          top: 30,
        }}
        responsive
        style={{
          aspectRatio: 1.618,
          height: "100%",
          padding: "0.5rem",
          width: "100%",
        }}
      >
        <CartesianGrid vertical={false} stroke="transparent" />
        <XAxis
          dataKey="label"
          stroke="transparent"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-body-small)",
          }}
          tick={{ fill: "var(--color-text-primary)" }}
        />
        <Bar
          maxBarSize={30}
          dataKey="total"
          radius={[6, 6, 0, 0]}
          shape={(props: BarShapeProps) => (
            <Rectangle
              {...props}
              fill={
                props.index === data.length - 1
                  ? "var(--color-brand-slate-green)"
                  : "var(--color-brand-ghost-green)"
              }
            />
          )}
        >
          <LabelList
            content={MonthlyExpenseLabel}
            dataKey="total"
            position="top"
          />
        </Bar>
        {import.meta.env.DEV && <RechartsDevtools />}
      </BarChart>
    </div>
  );
};
