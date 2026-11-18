import { useQuery } from "@tanstack/react-query";

import {
  ErrorLoadingDrawerComponent,
  LoadingDrawerDetails,
} from "@/components/base/RootDrawer/components";
import { EditAccountForm } from "@/components/base/RootDrawer/components/EditAccount/EditAccountForm";
import { useBaseUIStore } from "@/store/BaseUIStore";
import { createFetchAccount } from "@/utils/api/requests";

export const EditAccount = () => {
  const accountID = useBaseUIStore((state) => state.accountID);
  const { data, isLoading, isError } = useQuery({
    ...createFetchAccount(accountID ?? "", {}),
    enabled: !!accountID,
  });

  if (!accountID) return null;
  if (isError) return <ErrorLoadingDrawerComponent drawerName="account" />;
  if (isLoading || !data) return <LoadingDrawerDetails />;

  // Mounted only once the account has loaded so the form's defaultValues are the real values.
  return <EditAccountForm account={data.data} />;
};
