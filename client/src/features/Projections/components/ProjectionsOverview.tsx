import { useQuery } from "@tanstack/react-query";
import {
  LoadingOverviewItems,
  OverviewItem,
  OverviewItemsContainer,
  SectionError,
} from "@/components/base";
import {
  projectedBudgetQuery,
  upcomingOccurrencesQuery,
} from "@/features/Projections/utils/projectionQueries";
import { useProjectionsFilters } from "@/features/Projections/utils/projectionsSearch";
import { addDays, cn, formatCurrency, formatDate, toLocalDate } from "@/utils/functions";
import type { CurrencyCode } from "@/utils/types";

const ChangeText = ({
  change,
  currency,
}: {
  change: number;
  currency: CurrencyCode;
}) => (
  <p
    className={cn(
      "text-body-small",
      change >= 0 ? "text-text-success" : "text-text-error",
    )}
  >
    {change >= 0 ? "+" : "-"}
    {formatCurrency({ amount: Math.abs(change), currency, showCurrency: false })}
  </p>
);

export const ProjectionsOverview = () => {
  const filters = useProjectionsFilters();
  const { data, isError, isLoading } = useQuery(projectedBudgetQuery(filters));
  // Only used to name what causes the lowest point; the cards still render without it.
  const { data: upcoming } = useQuery(upcomingOccurrencesQuery(filters));

  if (isLoading) {
    return <LoadingOverviewItems />;
  }

  if (isError || !data) {
    return (
      <OverviewItemsContainer>
        <SectionError message="Could not load the projection summary." />
      </OverviewItemsContainer>
    );
  }

  const { currency, lowestPoint, series, startingBalance } = data;
  // Closing balance of the last day on or before `date`; the series is sorted by day.
  const balanceOn = (date: string) =>
    series.findLast((day) => day.key <= date)?.closingBalance ??
    startingBalance;
  const in30 = balanceOn(toLocalDate(addDays(30)));
  const in90 = balanceOn(toLocalDate(addDays(90)));
  const lowestCauses = (upcoming?.occurrences ?? [])
    .filter(
      (o) => o.date === lowestPoint?.date && o.amount < 0 && o.status === "scheduled",
    )
    .map((o) => o.name);

  return (
    <OverviewItemsContainer>
      <OverviewItem
        content={startingBalance}
        currency={currency}
        subContent={<p className="text-body-small">As of today</p>}
        title={<p className="text-body-small">Current total balance</p>}
      />
      <OverviewItem
        content={in30}
        currency={currency}
        subContent={<ChangeText change={in30 - startingBalance} currency={currency} />}
        title={<p className="text-body-small">In 30 days</p>}
      />
      <OverviewItem
        content={in90}
        currency={currency}
        subContent={<ChangeText change={in90 - startingBalance} currency={currency} />}
        title={<p className="text-body-small">In 90 days</p>}
      />
      <OverviewItem
        content={lowestPoint?.balance ?? startingBalance}
        currency={currency}
        subContent={
          <p
            className={cn(
              "text-body-small",
              lowestPoint && lowestPoint.balance < startingBalance && "text-text-error",
            )}
          >
            {lowestPoint
              ? `${formatDate({ date: lowestPoint.date })}${
                  lowestCauses.length ? ` · after ${lowestCauses.join(" + ")}` : ""
                }`
              : "No projection"}
          </p>
        }
        title={<p className="text-body-small">Lowest point</p>}
      />
    </OverviewItemsContainer>
  );
};
