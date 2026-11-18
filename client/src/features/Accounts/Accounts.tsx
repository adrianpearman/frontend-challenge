import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BaseLayoutComponent, BaseFeatureComponent } from "@/components/base";
import {
  AccountsHeader,
  AccountSelection,
  AccountsTable,
} from "@/features/Accounts/components";
import { createFetchDashboardMetrics } from "@/utils/api/requests";

export const Accounts = () => {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [showArchived, setShowArchived] = useState(false);
  const { data, isError, isLoading } = useQuery(
    createFetchDashboardMetrics({
      params: showArchived ? { includeArchived: true } : undefined,
    }),
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
          showArchived={showArchived}
          toggleShowArchivedFn={() => {
            // A selected archived account would vanish when hiding, so clear the selection.
            setShowArchived((v) => !v);
            setCurrentAccount("");
          }}
        />
        <AccountSelection
          accounts={(data && data.data) ?? []}
          currentAccount={currentAccount}
          isError={isError}
          isLoading={isLoading}
          updateStateFn={setCurrentAccount}
        />
        <AccountsTable
          accountsMap={accountsMap}
          currentAccount={currentAccount}
          numberOfAccounts={data?.meta.total ?? 0}
        />
      </BaseFeatureComponent>
    </BaseLayoutComponent>
  );
};
