import type { ReactNode } from "react";

type PageHeaderProps = {
  actions?: ReactNode;
  description: ReactNode;
  title: string;
};

export const PageHeader = ({
  actions,
  description,
  title,
}: PageHeaderProps) => (
  <div className="flex flex-wrap gap-4 justify-between">
    <div className="flex flex-col gap-1">
      <h1 className="text-h4">{title}</h1>
      <p className="text-body-small">{description}</p>
    </div>
    {actions && <div className="flex flex-wrap gap-2 items-center">{actions}</div>}
  </div>
);
