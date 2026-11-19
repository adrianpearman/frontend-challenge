import { createFileRoute } from "@tanstack/react-router";
import { Accounts } from "@/features/Accounts";
import { validateAccountsSearch } from "@/features/Accounts/utils/accountsSearch";

export const Route = createFileRoute("/accounts")({
  component: Accounts,
  validateSearch: validateAccountsSearch,
});
