import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BaseLayoutComponent, BaseFeatureComponent } from "@/components/base";
import {
  AccountsHeader,
  AccountSelection,
  AccountTable,
} from "@/features/Accounts/components";
import { createFetchDashboardMetrics } from "@/utils/api/requests";

export const Accounts = () => {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const { data, isError, isLoading } = useQuery(
    createFetchDashboardMetrics({}),
  );

  const accountsMap = new Map(
    (data === undefined ? [] : data.data).map(({ id, name }) => [id, name]),
  );

  const handleResetSelectedAccounts = () => setCurrentAccount("");
  return (
    <BaseLayoutComponent>
      <BaseFeatureComponent>
        <AccountsHeader
          currentAccount={currentAccount}
          resetStateFn={handleResetSelectedAccounts}
        />
        <AccountSelection
          accounts={(data && data.data) ?? []}
          currentAccount={currentAccount}
          isError={isError}
          isLoading={isLoading}
          updateStateFn={setCurrentAccount}
        />
        <AccountTable
          accountsMap={accountsMap}
          currentAccount={currentAccount}
          numberOfAccounts={data?.meta.total ?? 0}
        />
      </BaseFeatureComponent>
    </BaseLayoutComponent>
  );
};
