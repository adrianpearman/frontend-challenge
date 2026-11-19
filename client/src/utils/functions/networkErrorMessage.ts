import { isAxiosError } from "axios";

type NetworkErrorMessageProps = {
  error: unknown;
  fallback: string;
};

export const networkErrorMessage = ({
  error,
  fallback,
}: NetworkErrorMessageProps) =>
  (isAxiosError(error) && error.response?.data?.error?.message) || fallback;
