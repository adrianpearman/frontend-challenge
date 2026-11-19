import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  type YAxisTickContentProps,
  Rectangle,
  type BarShapeProps,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import {
  LeftYAxisComponent,
  RightYAxisComponents,
} from "@/features/Expenses/components/ExpensesCharts/components/CategoryPercentageChart/components";
import type { CategoryChartDataObject } from "@/features/Expenses/utils/types";

const ROW_HEIGHT = 32; // bar (16) + gap

type CategoryPercentageChartProps = {
  data: CategoryChartDataObject[];
};

export const CategoryPercentageChart = ({
  data,
}: CategoryPercentageChartProps) => {
  return (
    <div className="w-3/5 flex flex-col gap-3 border border-neutral-border rounded-md p-4 max-lg:w-full">
      <h2 className="text-h5">By category</h2>
      <div className="max-h-80 overflow-y-auto">
        <BarChart
          data={data}
          layout="vertical"
          responsive
          style={{
            height: data.length * ROW_HEIGHT + ROW_HEIGHT, // additional ro height to address collapsed rows
            width: "100%",
          }}
          margin={{
            bottom: 5,
            left: 0,
            right: 0,
            top: 5,
          }}
        >
          <XAxis
            domain={[0, (dataMax: number) => dataMax * 1.25]}
            axisLine={false}
            tick={false}
            type="number"
          />
          <YAxis
            axisLine={false}
            dataKey="label"
            orientation="left"
            tick={(props: YAxisTickContentProps) => (
              <LeftYAxisComponent {...props} />
            )}
            tickLine={false}
            type="category"
            width={140}
            yAxisId="left"
          />

          <YAxis
            dataKey="label"
            orientation="right"
            stroke="transparent"
            tick={(props: YAxisTickContentProps) => (
              <RightYAxisComponents {...props} data={data} />
            )}
            type="category"
            width={140}
            yAxisId="right"
          />
          <Bar
            dataKey="total"
            maxBarSize={16}
            radius={[10, 10, 10, 10]}
            yAxisId="left"
            shape={(props: BarShapeProps) => (
              <Rectangle {...props} fill={props.payload.color} />
            )}
          />
          {import.meta.env.DEV && <RechartsDevtools />}
        </BarChart>
      </div>
    </div>
  );
};
