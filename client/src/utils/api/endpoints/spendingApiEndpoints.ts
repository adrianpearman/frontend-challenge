import { baseApi } from "@/utils/api/baseApi";

export const fetchProjectedSpending = (id: string) =>
  baseApi(`/api/projects/${id}/summary`);
