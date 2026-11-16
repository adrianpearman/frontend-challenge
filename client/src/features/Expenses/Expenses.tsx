import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BaseFeatureComponent, BaseLayoutComponent } from "@/components/base";
import {
  ExpensesCharts,
  ExpensesHeader,
  ExpensesOverview,
} from "@/features/Expenses/components";
import { createFetchDashboardMetrics } from "@/utils/api/requests";

export const Expenses = () => {
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const { data, isError, isLoading } = useQuery(
    createFetchDashboardMetrics({}),
  );

  const accountsMap = new Map(
    (data === undefined ? [] : data.data).map(({ id, name }) => [id, name]),
  );

  console.log({
    data,
    accountsMap,
  });

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
