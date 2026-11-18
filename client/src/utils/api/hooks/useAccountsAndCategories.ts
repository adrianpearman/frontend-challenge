import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createFetchCategories,
  createFetchDashboardMetrics,
} from "@/utils/api/requests";

export const useAccountsAndCategories = () => {
  const accounts = useQuery(createFetchDashboardMetrics({}));
  const categories = useQuery(createFetchCategories({ params: {} }));

  const accountsMap = useMemo(
    () => new Map((accounts.data?.data ?? []).map((a) => [a.id, a.name])),
    [accounts.data],
  );
  const categoriesMap = useMemo(
    () => new Map((categories.data?.data ?? []).map((c) => [c.id, c.name])),
    [categories.data],
  );

  return {
    accountsMap,
    categoriesMap,
    isLoading: accounts.isLoading || categories.isLoading,
    isError: accounts.isError || categories.isError,
  };
};
