/** This component refactors the base foundational padding and flex styling for each route into one singular component */
type BaseFeatureComponentProps = {
  children: React.ReactNode;
};

export const BaseFeatureComponent = ({
  children,
}: BaseFeatureComponentProps) => {
  return <div className="flex flex-col gap-2 p-4 md:p-10">{children}</div>;
};
