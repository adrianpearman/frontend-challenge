import { useRef, useState } from "react";
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
  className,
  width = "max-w-[125px]",
  ...props
}: TruncateTextProps) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip
        open={open}
        onOpenChange={(next) => {
          const el = textRef.current;
          setOpen(next && !!el && el.scrollWidth > el.clientWidth);
        }}
      >
        <TooltipTrigger
          render={
            <p
              className={cn("truncate", width, className)}
              ref={textRef}
              {...props}
            >
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
