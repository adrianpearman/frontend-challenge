import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/vendors";

type TruncateTextProps = {
  content: string;
  displayedContent: React.ReactElement;
};

export const TruncateText = ({
  content,
  displayedContent,
}: TruncateTextProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={displayedContent} />
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
