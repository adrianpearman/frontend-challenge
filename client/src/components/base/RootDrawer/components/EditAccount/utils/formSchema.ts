import * as z from "zod";
import { formSchema as createFormSchema } from "@/components/base/RootDrawer/components/CreateAccountForm/utils/formSchema";

// Mirrors the server's account patchSchema: the create schema without currency, which is immutable.
// Colour isn't editable here; archive status is.
export const formSchema = createFormSchema
  .omit({ currency: true, color: true })
  .extend({ archived: z.boolean() });
