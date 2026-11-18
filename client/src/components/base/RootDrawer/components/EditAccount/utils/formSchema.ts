import { formSchema as createFormSchema } from "@/components/base/RootDrawer/components/CreateAccountForm/utils/formSchema";

// Mirrors the server's account patchSchema: the create schema without currency, which is immutable.
export const formSchema = createFormSchema.omit({ currency: true });
