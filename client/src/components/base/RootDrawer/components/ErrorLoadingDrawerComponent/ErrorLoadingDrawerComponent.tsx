import { CircleAlertIcon } from "lucide-react";

type ErrorLoadingDrawerComponentProps = {
  drawerName: string;
};

export const ErrorLoadingDrawerComponent = ({
  drawerName,
}: ErrorLoadingDrawerComponentProps) => (
  <div
    role="alert"
    className="flex flex-col items-center justify-center gap-2 p-8 text-center h-full"
  >
    <CircleAlertIcon className="size-8 text-text-error" aria-hidden />
    <p className="text-body-default">
      Could not load <strong>{drawerName}</strong>.
    </p>
    <p className="text-body-small">Please close the drawer and try again.</p>
  </div>
);
