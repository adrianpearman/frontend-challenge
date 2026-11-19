import { FilterDropdown, PageHeader } from "@/components/base";
import {
  HORIZONS,
  useProjectionsFilters,
} from "@/features/Projections/utils/projectionsSearch";

const horizonOptions = HORIZONS.map((h) => ({
  label: `${h} months`,
  value: h,
}));

export const ProjectionsHeader = () => {
  const { accounts, horizon, selectedAccount, setAccount, setHorizon } =
    useProjectionsFilters();
  const accountOptions = [
    { label: "All accounts", value: "all" },
    ...accounts.map(({ id, name }) => ({ label: name, value: id })),
  ];

  return (
    <PageHeader
      title="Budget Projection"
      description="Current balances plus scheduled bills and income"
      actions={
        <>
          <FilterDropdown
            label="Horizon"
            onChange={setHorizon}
            options={horizonOptions}
            triggerLabel={`Horizon: ${horizon} months`}
            value={horizon}
          />
          <FilterDropdown
            dropdownClassName="w-52"
            label="Account"
            onChange={setAccount}
            options={accountOptions}
            triggerLabel={
              accountOptions.find(({ value }) => value === selectedAccount)
                ?.label ?? "All accounts"
            }
            value={selectedAccount}
          />
        </>
      }
    />
  );
};
