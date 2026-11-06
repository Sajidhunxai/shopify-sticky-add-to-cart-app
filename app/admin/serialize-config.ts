import type { BarConfig } from "../models/bar-config";

/**
 * Serialize a BarConfig into the FormData shape consumed by the route action
 * (`intent=save`) and `barConfigFromFormData`. Wire format: every key is
 * `String(value)`, except `rewardTiers` which is JSON.
 */
export function serializeBarConfigToFormData(config: BarConfig): FormData {
  const fd = new FormData();
  fd.set("intent", "save");
  (Object.keys(config) as (keyof BarConfig)[]).forEach((key) => {
    const value = config[key];
    if (key === "rewardTiers") {
      fd.set(key, JSON.stringify(value));
      return;
    }
    fd.set(key, String(value));
  });
  return fd;
}
