import { useEffect } from "react";
import type { BarConfig } from "../../models/bar-config";
import { useStudioStore } from "../../stores";

/**
 * Hydrates the Zustand studio store from the route loader and exposes
 * selectors used by the dashboard.
 */
export function useBarConfigStudio(initialConfig: BarConfig) {
  const hydrate = useStudioStore((s) => s.hydrate);
  const config = useStudioStore((s) => s.config);
  const updateConfig = useStudioStore((s) => s.updateConfig);
  const updateRewardTier = useStudioStore((s) => s.updateRewardTier);
  const nav = useStudioStore((s) => s.nav);
  const setNav = useStudioStore((s) => s.setNav);
  const setPreviewDrawerManual = useStudioStore((s) => s.setPreviewDrawerManual);
  const setPreviewEmpty = useStudioStore((s) => s.setPreviewEmpty);
  const showDrawerPreview = useStudioStore((s) => s.showDrawerPreview());
  const showEmptyPreview = useStudioStore((s) => s.showEmptyPreview());

  useEffect(() => {
    hydrate(initialConfig);
  }, [hydrate, initialConfig]);

  return {
    config,
    updateConfig,
    updateRewardTier,
    nav,
    setNav,
    showDrawerPreview,
    showEmptyPreview,
    setPreviewDrawerManual,
    setPreviewEmpty,
  };
}
