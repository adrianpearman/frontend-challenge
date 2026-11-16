import { createFileRoute } from "@tanstack/react-router";
import { Budget } from "@/features/Budget";

export const Route = createFileRoute("/budget")({
  component: Budget,
});
