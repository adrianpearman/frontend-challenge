import { isAxiosError } from "axios";

export const networkErrorMessage = (error: unknown, fallback: string) =>
  (isAxiosError(error) && error.response?.data?.error?.message) || fallback;
