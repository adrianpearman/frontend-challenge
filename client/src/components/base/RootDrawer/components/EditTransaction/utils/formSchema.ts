import * as z from "zod";
import { splitTags } from "@/components/base/RootDrawer/components/AddExpenseForm/utils/functions";

// Only the user-editable fields; date, amount, status and account are fixed once a transaction exists.
export const formSchema = z.object({
  categoryId: z.string(),
  projectId: z.string(),
  notes: z.string().trim().max(2000, "Notes must be at most 2000 characters."),
  tags: z
    .string()
    .refine((v) => splitTags(v).length <= 20, "At most 20 tags.")
    .refine(
      (v) => splitTags(v).every((t) => t.length <= 40),
      "Each tag must be at most 40 characters.",
    ),
});
