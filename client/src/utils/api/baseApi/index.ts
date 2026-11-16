import axios from "axios";
import { useDevServicesStore } from "@/store/DevServicesStore";

const BASE_API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL,
};

export const baseApi = axios.create(BASE_API_CONFIG);

// Applies the Settings page's simulated latency/errors as per-request headers the API understands.
baseApi.interceptors.request.use((config) => {
  const { latencyMs, errorRate, targets } = useDevServicesStore.getState();
  const url = config.url ?? "";

  if (url.startsWith("/api/dev")) return config; // never simulate on the escape hatch
  if (targets.length > 0 && !targets.some((target) => url.startsWith(target))) {
    return config;
  }

  if (latencyMs > 0)
    config.headers.set("x-simulate-latency", String(latencyMs));
  if (errorRate > 0 && Math.random() < errorRate) {
    config.headers.set("x-simulate-error", "500");
  }

  return config;
});
