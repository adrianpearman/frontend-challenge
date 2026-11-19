import { useQuery } from "@tanstack/react-query";
import { SectionError } from "@/components/base";
import { LoadingDetails } from "@/components/base/LoadingDetails";
import {
  projectedBudgetQuery,
  upcomingOccurrencesQuery,
} from "@/features/Projections/utils/projectionQueries";
import { useProjectionsFilters } from "@/features/Projections/utils/projectionsSearch";
import { cn, formatCurrency, formatDate } from "@/utils/functions";

const cell = "py-3 px-0 text-body-small text-text-primary";

export const UpcomingEvents = () => {
  const filters = useProjectionsFilters();
  const projection = useQuery(projectedBudgetQuery(filters));
  const upcoming = useQuery(upcomingOccurrencesQuery(filters));

  const isLoading = projection.isLoading || upcoming.isLoading;
  const isError = projection.isError || upcoming.isError;
  const currency = projection.data?.currency;
  const series = projection.data?.series ?? [];
  // Same rows the projection counts: still scheduled, in the projection's currency.
  const events = (upcoming.data?.occurrences ?? []).filter(
    (o) => o.status === "scheduled" && o.currency === currency,
  );

  return (
    <div className="flex flex-col gap-4 border border-neutral-border rounded-md p-6">
      <h2 className="text-h5">Upcoming events</h2>
      {isLoading ? (
        <LoadingDetails overrideLength={5} />
      ) : isError ? (
        <SectionError className="border-0" message="Could not load upcoming events." />
      ) : events.length === 0 ? (
        <p className="text-body-small text-neutral-base">
          No scheduled bills or income in this period.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-xl">
            <thead>
              <tr className="border-b border-neutral-border text-left text-h6 text-neutral-base">
                <th className="py-3 w-28 font-bold">Date</th>
                <th className="py-3 font-bold">Item</th>
                <th className="py-3 w-36 text-right font-bold">Change</th>
                <th className="py-3 w-44 text-right font-bold">Projected balance</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  className="border-b border-neutral-border"
                  key={`${event.scheduledItemId}-${event.date}`}
                >
                  <td className={cell}>{formatDate({ date: event.date })}</td>
                  <td className={cell}>{event.name}</td>
                  <td
                    className={cn(
                      cell,
                      "text-right",
                      event.amount < 0 ? "text-text-error" : "text-text-success",
                    )}
                  >
                    {event.amount < 0 ? "-" : "+"}
                    {formatCurrency({
                      amount: Math.abs(event.amount),
                      currency,
                      showCurrency: false,
                    })}
                  </td>
                  <td className={cn(cell, "text-right")}>
                    {/* shortcut: end-of-day balance, so same-day events share a figure; compute per-row if that matters. */}
                    {formatCurrency({
                      amount:
                        series.find((day) => day.key === event.date)?.closingBalance ?? 0,
                      currency,
                      showCurrency: false,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
