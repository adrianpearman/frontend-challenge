import { LoadingOverviewItem } from "@/components/base/OverviewItems/LoadingOverviewItem";
import { OverviewItemsContainer } from "@/components/base/OverviewItems/OverviewItemsContainer";

export const LoadingOverviewItems = ({ count = 3 }: { count?: number }) => (
  <OverviewItemsContainer>
    {Array.from({ length: count }, (_, i) => (
      <LoadingOverviewItem key={i} />
    ))}
  </OverviewItemsContainer>
);
