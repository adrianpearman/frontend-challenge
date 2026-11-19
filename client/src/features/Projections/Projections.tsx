import {
  BaseFeatureComponent,
  BaseLayoutComponent,
  SectionError,
} from "@/components/base";
import { Skeleton } from "@/components/vendors";
import {
  ProjectionChart,
  ProjectionsHeader,
  ProjectionsOverview,
  UpcomingEvents,
} from "@/features/Projections/components";
import { useProjectionsFilters } from "@/features/Projections/utils/projectionsSearch";

export const Projections = () => {
  const { accountsQuery } = useProjectionsFilters();

  if (accountsQuery.isLoading) {
    return (
      <BaseLayoutComponent>
        <BaseFeatureComponent>
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-32" />
          <Skeleton className="h-72" />
        </BaseFeatureComponent>
      </BaseLayoutComponent>
    );
  }

  if (accountsQuery.isError) {
    return (
      <BaseLayoutComponent>
        <BaseFeatureComponent>
          <SectionError message="Could not load accounts." />
        </BaseFeatureComponent>
      </BaseLayoutComponent>
    );
  }

  return (
    <BaseLayoutComponent>
      <BaseFeatureComponent>
        <ProjectionsHeader />
        <ProjectionsOverview />
        <ProjectionChart />
        <UpcomingEvents />
      </BaseFeatureComponent>
    </BaseLayoutComponent>
  );
};
