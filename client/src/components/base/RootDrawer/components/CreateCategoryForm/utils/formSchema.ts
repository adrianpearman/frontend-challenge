import * as z from "zod";

// Mirrors the server's category createSchema; budget is entered in dollars and converted to cents on submit.
export const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(200, "Name must be at most 200 characters."),
  kind: z.enum(["expense", "income"], { message: "Select a kind." }),
  parentId: z.string(),
  monthlyBudget: z
    .string()
    .regex(/^(\d+(\.\d{1,2})?)?$/, "Enter a positive amount like 250.00."),
  // Additional
  color: z
    .string()
    .trim()
    .regex(/^(#[0-9a-fA-F]{6})?$/, "Use a hex colour like #16a34a."),
});
