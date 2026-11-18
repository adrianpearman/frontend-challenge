import * as z from "zod";

// Mirrors the server's account createSchema; money is entered in dollars and converted to cents on submit.
export const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(200, "Name must be at most 200 characters."),
  type: z.enum(["checking", "savings", "credit_card", "cash", "investment"], {
    message: "Select an account type.",
  }),
  currency: z.enum(["CAD", "USD", "EUR"], { message: "Select a currency." }),
  openingBalance: z
    .string()
    .regex(/^(-?\d+(\.\d{1,2})?)?$/, "Enter an amount like 1500.00."),
  creditLimit: z
    .string()
    .regex(/^(\d+(\.\d{1,2})?)?$/, "Enter a positive amount like 5000."),
  // Additional
  institution: z
    .string()
    .trim()
    .max(120, "Institution must be at most 120 characters."),
  openedAt: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, "Pick a date."),
  color: z
    .string()
    .trim()
    .regex(/^(#[0-9a-fA-F]{6})?$/, "Use a hex colour like #2563eb."),
});
