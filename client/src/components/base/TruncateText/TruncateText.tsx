import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/vendors";

type TruncateTextProps = {
  content: React.ReactNode;
  width?: number;
};

export const TruncateText = ({ content, width = 150 }: TruncateTextProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <p className="truncate" style={{ maxWidth: width }}>
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
