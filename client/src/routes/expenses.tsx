import { createFileRoute } from "@tanstack/react-router";
import { Expenses } from "@/features/Expenses";
import { validateExpensesSearch } from "@/features/Expenses/utils/expensesSearch";

export const Route = createFileRoute("/expenses")({
  component: Expenses,
  validateSearch: validateExpensesSearch,
});
