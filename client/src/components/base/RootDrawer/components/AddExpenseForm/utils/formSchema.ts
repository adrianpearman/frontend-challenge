import * as z from "zod";
import { splitTags } from "@/components/base/RootDrawer/utils/functions";

// Mirrors the server's createSchema; amount is entered in dollars and converted to cents on submit.
export const formSchema = z.object({
  accountId: z.string().min(1, "Select an account."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date."),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter an amount like 45.99.")
    .refine((v) => Number(v) > 0, "Amount must be greater than 0."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(200, "Description must be at most 200 characters."),
  // Additional
  merchant: z
    .string()
    .trim()
    .max(120, "Merchant must be at most 120 characters."),
  categoryId: z.string(),
  projectId: z.string(),
  status: z.enum(["posted", "pending"]),
  notes: z.string().trim().max(2000, "Notes must be at most 2000 characters."),
  tags: z
    .string()
    .refine((v) => splitTags(v).length <= 20, "At most 20 tags.")
    .refine(
      (v) => splitTags(v).every((t) => t.length <= 40),
      "Each tag must be at most 40 characters.",
    ),
});
