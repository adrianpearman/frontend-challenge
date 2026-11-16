import { createFileRoute } from "@tanstack/react-router";
import { Bills } from "@/features/Bills";

export const Route = createFileRoute("/bills")({
  component: Bills,
});
