import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/vendors";
import { cn } from "@/utils/functions";

type TruncateTextProps = Omit<React.ComponentProps<"p">, "content"> & {
  content: React.ReactNode;
  width?: string;
};

export const TruncateText = ({
  content,
  width = "max-w-[125px]",
  className,
  ...props
}: TruncateTextProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <p className={cn("truncate", width, className)} {...props}>
              {content}
            </p>
          }
        />
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
