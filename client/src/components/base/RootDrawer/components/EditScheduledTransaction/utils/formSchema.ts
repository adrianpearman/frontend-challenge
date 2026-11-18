import * as z from "zod";

const money = /^\d+(\.\d{1,2})?$/;
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

// Mirrors the server's scheduled-item createSchema; amounts are entered in dollars and converted to cents on submit.
export const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required.")
      .max(200, "Name must be at most 200 characters."),
    kind: z.enum(["bill", "income"]),
    accountId: z.string().min(1, "Select an account."),
    categoryId: z.string(),
    projectId: z.string(),
    amount: z
      .string()
      .regex(money, "Enter an amount like 45.99.")
      .refine((v) => Number(v) > 0, "Amount must be greater than 0."),
    frequency: z.enum([
      "once",
      "weekly",
      "biweekly",
      "monthly",
      "quarterly",
      "yearly",
    ]),
    startDate: z.string().regex(isoDate, "Pick a start date."),
    endDate: z.string().refine((v) => !v || isoDate.test(v), "Pick a valid date."),
    autoPay: z.enum(["yes", "no"]),
    status: z.enum(["active", "paused"]),
    variance: z.string().regex(money, "Enter an amount like 5.00."),
    notes: z.string().trim().max(2000, "Notes must be at most 2000 characters."),
  })
  .refine((v) => !v.endDate || v.endDate >= v.startDate, {
    path: ["endDate"],
    message: "End date must be on or after the start date.",
  });
