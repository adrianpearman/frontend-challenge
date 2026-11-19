import * as z from "zod";

// Shared by the create form and inline rename so both enforce the server's name rules.
export const categoryNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required.")
  .max(200, "Name must be at most 200 characters.");
