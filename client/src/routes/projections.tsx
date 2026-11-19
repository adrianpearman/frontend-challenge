import { createFileRoute } from "@tanstack/react-router";
import { Projections } from "@/features/Projections";
import { validateProjectionsSearch } from "@/features/Projections/utils/projectionsSearch";

export const Route = createFileRoute("/projections")({
  component: Projections,
  validateSearch: validateProjectionsSearch,
});
