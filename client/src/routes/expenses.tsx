import { createFileRoute } from "@tanstack/react-router";
import { Expenses } from "@/features/Expenses";

export const Route = createFileRoute("/expenses")({
  component: Expenses,
});
