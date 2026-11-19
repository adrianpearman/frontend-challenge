import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { BaseLayoutComponent, BaseFeatureComponent } from "@/components/base";
import {
  AccountsHeader,
  AccountSelection,
  AccountsTable,
} from "@/features/Accounts/components";
import { createFetchAccounts } from "@/utils/api/requests";

export const Accounts = () => {
  const search = useSearch({ from: "/accounts" });
  const navigate = useNavigate({ from: "/accounts" });
  const currentAccount = search.account ?? "";
  const showArchived = search.archived ?? false;

  // Changing the account starts the table at page 1.
  const setCurrentAccount = (id: string) =>
    navigate({
      search: (prev) => ({
        ...prev,
        account: id || undefined,
        page: undefined,
      }),
    });

  const { data, isError, isLoading } = useQuery(
    createFetchAccounts({
      params: showArchived ? { includeArchived: true } : undefined,
    }),
  );

  const accountsMap = new Map(
    (data?.data ?? []).map(({ id, name }) => [id, name]),
  );

  const handleResetSelectedAccounts = () => setCurrentAccount("");
  return (
    <BaseLayoutComponent>
      <BaseFeatureComponent>
        <AccountsHeader
          currentAccount={currentAccount}
          resetStateFn={handleResetSelectedAccounts}
          showArchived={showArchived}
          toggleShowArchivedFn={() =>
            // A selected archived account would vanish when hiding, so clear the selection.
            navigate({
              search: (prev) => ({
                ...prev,
                archived: !showArchived || undefined,
                account: undefined,
                page: undefined,
              }),
            })
          }
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
