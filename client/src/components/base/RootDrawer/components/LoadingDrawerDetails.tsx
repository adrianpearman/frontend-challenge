import { Skeleton } from "@/components/vendors";
import { cn } from "@/utils/functions";

export const LoadingDrawerDetails = () => {
  const numberOfPlaceholderElements = [5, 6, 7, 8];
  const randomElementWidth = ["w-1/2", "w-3/5", "w-2/3", "w-4/5", "w-full"];
  return (
    <div className="flex flex-col p-4 gap-3">
      {Array.from({
        length:
          numberOfPlaceholderElements[
            Math.floor(Math.random() * numberOfPlaceholderElements.length - 1)
          ],
      }).map((_, i) => (
        <Skeleton
          className={cn(
            `${randomElementWidth[Math.floor(Math.random() * randomElementWidth.length - 1)]}`,
            "h-8",
          )}
          key={`rendered-loading-skeleton-${i}`}
        />
      ))}
    </div>
  );
};
