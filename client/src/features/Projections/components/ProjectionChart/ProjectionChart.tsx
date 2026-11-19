import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  LabelList,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import type { BarShapeProps } from "recharts";
import { SectionError } from "@/components/base";
import { Skeleton } from "@/components/vendors";
import { ProjectionBarLabel } from "@/features/Projections/components/ProjectionChart/ProjectionBarLabel";
import { projectedBudgetQuery } from "@/features/Projections/utils/projectionQueries";
import { useProjectionsFilters } from "@/features/Projections/utils/projectionsSearch";
import { formatDate, toLocalMonth } from "@/utils/functions";
import type { ProjectionChartDataObject } from "@/features/Projections/utils/types";

const LEGEND = [
  { label: "Actual", className: "bg-brand-slate-green" },
  { label: "Projected", className: "bg-brand-ghost-green" },
];

export const ProjectionChart = () => {
  const filters = useProjectionsFilters();
  const { data = [], isError, isLoading } = useQuery({
    ...projectedBudgetQuery(filters),
    // Roll the daily series up to one bar per month: the balance at the month's last day.
    select: ({ series }) => {
      const thisMonth = toLocalMonth();
      const byMonth = new Map<string, number>();
      for (const day of series) byMonth.set(day.key.slice(0, 7), day.closingBalance);
      return [...byMonth].map(
        ([month, total]): ProjectionChartDataObject => ({
          isActual: month === thisMonth,
          label: formatDate({ date: month, showDay: false }).trim(),
          total,
        }),
      );
    },
  });

  if (isLoading) {
    return <Skeleton className="min-h-95" />;
  }

  if (isError) {
    return (
      <SectionError
        className="min-h-95 flex items-center justify-center"
        message="Could not load the projected balance."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 border border-neutral-border rounded-md p-6">
      <h2 className="text-h5">Projected total balance</h2>
      <BarChart
        barCategoryGap="10%"
        data={data}
        // Room above and below the bars for labels on positive and negative values.
        margin={{ bottom: 30, left: 0, right: 0, top: 30 }}
        responsive
        style={{ height: 360, width: "100%" }}
      >
        {/* Hidden axis still sets the scale; keeping 0 in range draws bars from the zero line both ways. */}
        <YAxis domain={[(min: number) => Math.min(min, 0), "auto"]} hide />
        {data.some(({ total }) => total < 0) && (
          <ReferenceLine y={0} stroke="var(--color-neutral-border)" />
        )}
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
          dataKey="total"
          maxBarSize={56}
          radius={[6, 6, 0, 0]}
          shape={(props: BarShapeProps) => {
            const bar = data[props.index];
            const isNegative = (bar?.total ?? 0) < 0;
            const solid = isNegative
              ? "var(--color-text-error)"
              : "var(--color-brand-slate-green)";
            return bar?.isActual ? (
              <Rectangle {...props} fill={solid} />
            ) : (
              <Rectangle
                {...props}
                fill={
                  isNegative
                    ? "var(--color-background-error)"
                    : "var(--color-brand-ghost-green)"
                }
                stroke={solid}
                strokeDasharray="4 3"
              />
            );
          }}
        >
          <LabelList content={ProjectionBarLabel} dataKey="total" />
        </Bar>
      </BarChart>
      <ul className="flex gap-4">
        {LEGEND.map(({ label, className }) => (
          <li className="flex items-center gap-1.5 text-body-small text-neutral-base" key={label}>
            <span className={`size-3 rounded-[3px] ${className}`} />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};
