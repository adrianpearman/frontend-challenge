import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BaseFeatureComponent, BaseLayoutComponent } from "@/components/base";
import {
  Button,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
} from "@/components/vendors";
import {
  DEV_SERVICES_INITIAL_STATE,
  devServicesStoreActions,
  useDevServicesStore,
} from "@/store/DevServicesStore";
import type { DevServicesState } from "@/store/DevServicesStore/types";

// Mirrors the routers mounted in server/src/routes/index.js.
const ENDPOINTS = [
  "/api/accounts",
  "/api/transactions",
  "/api/transfers",
  "/api/categories",
  "/api/projects",
  "/api/scheduled-items",
  "/api/reports",
  "/api/projections",
];

export const Settings = () => {
  const queryClient = useQueryClient();
  const saved = useDevServicesStore();
  const [draft, setDraft] = useState<DevServicesState>({
    latencyMs: saved.latencyMs,
    errorRate: saved.errorRate,
    targets: saved.targets,
    disableRetries: saved.disableRetries,
  });

  const update = (changes: Partial<DevServicesState>) =>
    setDraft((current) => ({ ...current, ...changes }));

  const toggleTarget = (endpoint: string) =>
    update({
      targets: draft.targets.includes(endpoint)
        ? draft.targets.filter((target) => target !== endpoint)
        : [...draft.targets, endpoint],
    });

  // Refetch everything so the new conditions show on the next page view.
  const handleApply = () => {
    devServicesStoreActions.updateSettings(draft);
    queryClient.invalidateQueries();
  };

  const handleReset = () => {
    devServicesStoreActions.resetSettings();
    setDraft(DEV_SERVICES_INITIAL_STATE);
    queryClient.invalidateQueries();
  };

  const isActive = saved.latencyMs > 0 || saved.errorRate > 0;

  return (
    <BaseLayoutComponent>
      <BaseFeatureComponent>
        <div className="flex flex-col gap-1">
          <h1 className="text-h4">Settings</h1>
          <p className="text-body-small">
            Simulate a slow or unreliable API to see loading and error states.
            Settings are saved in this browser only.
          </p>
          <p
            className={
              isActive
                ? "text-body-small text-text-error"
                : "text-body-small text-text-success"
            }
          >
            {isActive
              ? `Active: ${saved.latencyMs}ms latency, ${Math.round(saved.errorRate * 100)}% errors on ${saved.targets.length === 0 ? "all endpoints" : `${saved.targets.length} endpoint(s)`}`
              : "API is behaving normally."}
          </p>
        </div>

        <FieldGroup className="max-w-xl border border-neutral-border rounded-md p-4">
          <Field>
            <FieldLabel htmlFor="latencyMs">Latency (ms)</FieldLabel>
            <Input
              id="latencyMs"
              inputMode="numeric"
              max={30000}
              min={0}
              onChange={(e) =>
                update({
                  latencyMs: Math.min(
                    Math.max(Number(e.target.value) || 0, 0),
                    30000,
                  ),
                })
              }
              step={100}
              type="number"
              value={draft.latencyMs}
            />
            <FieldDescription>
              Added to every affected request. 0 turns it off; the API caps it
              at 30,000.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="errorRate">
              Error rate: {Math.round(draft.errorRate * 100)}%
            </FieldLabel>
            <input
              className="accent-brand-slate-green"
              id="errorRate"
              max={100}
              min={0}
              onChange={(e) =>
                update({ errorRate: Number(e.target.value) / 100 })
              }
              step={5}
              type="range"
              value={Math.round(draft.errorRate * 100)}
            />
            <FieldDescription>
              Chance that an affected request fails with a 500.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Affected endpoints</FieldLabel>
            <FieldDescription>
              Leave all unchecked to affect every endpoint.
            </FieldDescription>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ENDPOINTS.map((endpoint) => (
                <label
                  className="flex items-center gap-2 text-body-small"
                  key={endpoint}
                >
                  <input
                    checked={draft.targets.includes(endpoint)}
                    className="accent-brand-slate-green"
                    onChange={() => toggleTarget(endpoint)}
                    type="checkbox"
                  />
                  {endpoint}
                </label>
              ))}
            </div>
          </Field>

          <Field>
            <label className="flex items-center gap-2 text-body-small">
              <input
                checked={draft.disableRetries}
                className="accent-brand-slate-green"
                onChange={(e) => update({ disableRetries: e.target.checked })}
                type="checkbox"
              />
              Disable automatic retries
            </label>
            <FieldDescription>
              Failed requests are normally retried 3 times, which hides most
              simulated errors.
            </FieldDescription>
          </Field>

          <div className="flex gap-2 justify-end">
            <Button onClick={handleReset} type="button" variant="outline">
              Reset to normal
            </Button>
            <Button onClick={handleApply} type="button">
              Apply
            </Button>
          </div>
        </FieldGroup>
      </BaseFeatureComponent>
    </BaseLayoutComponent>
  );
};
