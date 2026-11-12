import { useI18nStore, useStudioStore } from "../../stores";

/** Shared Zustand bindings for settings panels. */
export function usePanelState() {
  const config = useStudioStore((s) => s.config);
  const updateConfig = useStudioStore((s) => s.updateConfig);
  const updateRewardTier = useStudioStore((s) => s.updateRewardTier);
  const t = useI18nStore((s) => s.t);
  return { config, updateConfig, updateRewardTier, t };
}
