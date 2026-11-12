import { create } from "zustand";
import {
  DEFAULT_BAR_CONFIG,
  type BarConfig,
  type RewardTier,
} from "../models/bar-config";
import type { NavId } from "../admin/nav";
import type { UpdateConfig, UpdateRewardTier } from "../admin/types";

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

type StudioState = {
  config: BarConfig;
  nav: NavId;
  previewEmpty: boolean;
  previewDrawerManual: boolean | null;
  hydrated: boolean;

  hydrate: (config: BarConfig) => void;
  setConfig: (config: BarConfig) => void;
  updateConfig: UpdateConfig;
  updateRewardTier: UpdateRewardTier;
  setNav: (nav: NavId) => void;
  setPreviewEmpty: (value: boolean) => void;
  setPreviewDrawerManual: (value: boolean | null) => void;

  showDrawerPreview: () => boolean;
  showEmptyPreview: () => boolean;
};

export const useStudioStore = create<StudioState>((set, get) => ({
  config: DEFAULT_BAR_CONFIG,
  nav: "design",
  previewEmpty: false,
  previewDrawerManual: null,
  hydrated: false,

  hydrate: (config) =>
    set({
      config,
      hydrated: true,
    }),

  setConfig: (config) => set({ config }),

  updateConfig: (key, value) =>
    set((state) => ({
      config: { ...state.config, [key]: value },
    })),

  updateRewardTier: (index, patch) =>
    set((state) => ({
      config: {
        ...state.config,
        rewardTiers: state.config.rewardTiers.map((tier: RewardTier, i) =>
          i === index ? { ...tier, ...patch } : tier,
        ),
      },
    })),

  setNav: (nav) => {
    const patch: Partial<StudioState> = { nav, previewDrawerManual: null };
    if (nav === "cart-items" || nav === "cart-summary") {
      patch.previewEmpty = false;
    } else if (nav === "recommendations") {
      patch.previewEmpty = true;
    }
    set(patch);
  },

  setPreviewEmpty: (previewEmpty) => set({ previewEmpty }),

  setPreviewDrawerManual: (previewDrawerManual) =>
    set({ previewDrawerManual }),

  showDrawerPreview: () => {
    const { config, nav, previewDrawerManual } = get();
    const autoShowDrawer =
      config.displayMode === "slider" &&
      config.enabled &&
      DRAWER_FOCUS_NAVS.includes(nav);
    return (
      config.displayMode === "slider" &&
      config.enabled &&
      (previewDrawerManual ?? autoShowDrawer)
    );
  },

  showEmptyPreview: () => get().previewEmpty,
}));
