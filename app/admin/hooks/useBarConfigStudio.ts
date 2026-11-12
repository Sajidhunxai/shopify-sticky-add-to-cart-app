import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { BarConfig } from "../../models/bar-config";
import type { NavId } from "../nav";
import type { UpdateConfig, UpdateRewardTier } from "../types";

export function updateConfig<K extends keyof BarConfig>(
  setConfig: Dispatch<SetStateAction<BarConfig>>,
  key: K,
  value: BarConfig[K],
) {
  setConfig((prev) => ({ ...prev, [key]: value }));
}

const DRAWER_FOCUS_NAVS: NavId[] = [
  "design",
  "header",
  "cart-items",
  "announcements",
  "rewards",
  "recommendations",
  "discounts",
  "cart-summary",
  "trust",
  "templates",
];

export function useBarConfigStudio(initialConfig: BarConfig) {
  const [config, setConfig] = useState<BarConfig>(initialConfig);
  const [nav, setNav] = useState<NavId>("design");
  const [previewEmpty, setPreviewEmpty] = useState(false);
  const [previewDrawerManual, setPreviewDrawerManual] = useState<
    boolean | null
  >(null);

  const autoShowDrawer =
    config.displayMode === "slider" &&
    config.enabled &&
    DRAWER_FOCUS_NAVS.includes(nav);
  const showDrawerPreview =
    config.displayMode === "slider" &&
    config.enabled &&
    (previewDrawerManual ?? autoShowDrawer);
  // Recommendations default to empty cart; cart-items/summary open with sample lines.
  const showEmptyPreview = previewEmpty;

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  useEffect(() => {
    if (nav === "cart-items" || nav === "cart-summary") {
      setPreviewEmpty(false);
    } else if (nav === "recommendations") {
      setPreviewEmpty(true);
    }
  }, [nav]);

  const boundUpdateConfig: UpdateConfig = useCallback(
    (key, value) => updateConfig(setConfig, key, value),
    [],
  );

  const updateRewardTier: UpdateRewardTier = useCallback((index, patch) => {
    setConfig((prev) => {
      const rewardTiers = prev.rewardTiers.map((tier, i) =>
        i === index ? { ...tier, ...patch } : tier,
      );
      return { ...prev, rewardTiers };
    });
  }, []);

  return {
    config,
    setConfig,
    updateConfig: boundUpdateConfig,
    updateRewardTier,
    nav,
    setNav,
    showDrawerPreview,
    showEmptyPreview,
    setPreviewDrawerManual,
    setPreviewEmpty,
  };
}
