import { mutationOptions } from "@tanstack/react-query";
import * as api from "@/utils/api/endpoints";

// shortcut: every mutation invalidates all queries (balances/reports depend on everything); scope keys if refetching gets heavy.
const createMutation = <V>(fn: (vars: V) => Promise<unknown>) =>
  mutationOptions({
    mutationFn: fn,
    onSuccess: (_data, _vars, _result, { client }) =>
      client.invalidateQueries(),
  });

type Args<F extends (...a: never[]) => unknown> = Parameters<F>;

export const createAccountMutation = () =>
  createMutation((b: Args<typeof api.createAccount>[0]) =>
    api.createAccount(b),
  );

export const createCategoryMutation = () =>
  createMutation((b: Args<typeof api.createCategory>[0]) =>
    api.createCategory(b),
  );

export const createProjectMutation = () =>
  createMutation((b: Args<typeof api.createProject>[0]) =>
    api.createProject(b),
  );

export const createScheduledItemMutation = () =>
  createMutation((b: Args<typeof api.createScheduledItem>[0]) =>
    api.createScheduledItem(b),
  );

export const createTransactionMutation = () =>
  createMutation((b: Args<typeof api.createTransaction>[0]) =>
    api.createTransaction(b),
  );

export const createTransactionsBulkMutation = () =>
  createMutation((t: Args<typeof api.createTransactionsBulk>[0]) =>
    api.createTransactionsBulk(t),
  );

export const createTransferMutation = () =>
  createMutation((b: Args<typeof api.createTransfer>[0]) =>
    api.createTransfer(b),
  );

export const deleteAccountMutation = () =>
  createMutation(({ id, force }: { id: string; force?: boolean }) =>
    api.deleteAccount(id, force),
  );

export const deleteCategoryMutation = () =>
  createMutation(
    ({ id, ...params }: { id: string; force?: boolean; reassignTo?: string }) =>
      api.deleteCategory(id, params),
  );

export const deleteProjectMutation = () =>
  createMutation((id: string) => api.deleteProject(id));

export const deleteScheduledItemMutation = () =>
  createMutation((id: string) => api.deleteScheduledItem(id));

export const deleteTransactionMutation = () =>
  createMutation(({ id, force }: { id: string; force?: boolean }) =>
    api.deleteTransaction(id, force),
  );

export const deleteTransferMutation = () =>
  createMutation((transferId: string) => api.deleteTransfer(transferId));

export const postOccurrenceMutation = () =>
  createMutation(
    ({
      id,
      body,
    }: {
      id: string;
      body: Args<typeof api.postScheduledOccurrence>[1];
    }) => api.postScheduledOccurrence(id, body),
  );

export const skipOccurrenceMutation = () =>
  createMutation(({ id, date }: { id: string; date: string }) =>
    api.skipScheduledOccurrence(id, date),
  );

export const unskipOccurrenceMutation = () =>
  createMutation(({ id, date }: { id: string; date: string }) =>
    api.unskipScheduledOccurrence(id, date),
  );

export const updateAccountMutation = () =>
  createMutation(
    ({ id, body }: { id: string; body: Args<typeof api.updateAccount>[1] }) =>
      api.updateAccount(id, body),
  );

export const updateCategoryMutation = () =>
  createMutation(
    ({ id, body }: { id: string; body: Args<typeof api.updateCategory>[1] }) =>
      api.updateCategory(id, body),
  );

export const updateProjectMutation = () =>
  createMutation(
    ({ id, body }: { id: string; body: Args<typeof api.updateProject>[1] }) =>
      api.updateProject(id, body),
  );

export const updateScheduledItemMutation = () =>
  createMutation(
    ({
      id,
      body,
    }: {
      id: string;
      body: Args<typeof api.updateScheduledItem>[1];
    }) => api.updateScheduledItem(id, body),
  );

export const updateTransactionMutation = () =>
  createMutation(
    ({
      id,
      body,
    }: {
      id: string;
      body: Args<typeof api.updateTransaction>[1];
    }) => api.updateTransaction(id, body),
  );

export const updateTransactionsBulkMutation = () =>
  createMutation(
    ({
      ids,
      patch,
    }: {
      ids: string[];
      patch: Args<typeof api.updateTransactionsBulk>[1];
    }) => api.updateTransactionsBulk(ids, patch),
  );
