import type { BarConfig, RewardTier } from "../models/bar-config";

export type UpdateConfig = <K extends keyof BarConfig>(
  key: K,
  value: BarConfig[K],
) => void;

export type UpdateRewardTier = (
  index: number,
  patch: Partial<RewardTier>,
) => void;

export type PanelProps = {
  config: BarConfig;
  updateConfig: UpdateConfig;
  updateRewardTier?: UpdateRewardTier;
};

export type RewardsPanelProps = PanelProps & {
  updateRewardTier: UpdateRewardTier;
};

export type PlanPanelProps = {
  isPro: boolean;
  hideBranding: boolean;
  busy: boolean;
};

export type SetupPanelProps = {
  shop: string;
  busy: boolean;
};
