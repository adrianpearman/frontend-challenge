import { cn } from "@/utils/functions";

type SectionErrorProps = {
  className?: string;
  message: string;
};

// Inline error for a section that failed to load; the rest of the page keeps working.
export const SectionError = ({ className, message }: SectionErrorProps) => (
  <p
    role="alert"
    className={cn(
      "flex-1 border border-neutral-border rounded-md p-3 text-body-small text-text-error",
      className,
    )}
  >
    {message}
  </p>
);
