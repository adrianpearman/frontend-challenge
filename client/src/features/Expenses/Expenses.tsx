import {
  BaseFeatureComponent,
  BaseLayoutComponent,
  SectionError,
} from "@/components/base";
import { Skeleton } from "@/components/vendors";
import {
  ExpensesCharts,
  ExpensesHeader,
  ExpensesOverview,
} from "@/features/Expenses/components";
import { useExpensesFilters } from "@/features/Expenses/utils/expensesSearch";

export const Expenses = () => {
  const { accountsQuery } = useExpensesFilters();

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
        <ExpensesHeader />
        <ExpensesOverview />
        <ExpensesCharts />
      </BaseFeatureComponent>
    </BaseLayoutComponent>
  );
};
