import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/vendors";
import { cn } from "@/utils/functions";

type TruncateTextProps = {
  content: React.ReactNode;
  width?: string;
};

export const TruncateText = ({
  content,
  width = "max-w-[150px]",
}: TruncateTextProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={<p className={cn("truncate", width)}>{content}</p>}
        />
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
