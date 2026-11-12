import type { BarConfig, RewardTier } from "../models/bar-config";
import type { TranslateFn } from "../i18n";

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
  t: TranslateFn;
};

export type RewardsPanelProps = PanelProps & {
  updateRewardTier: UpdateRewardTier;
};

export type PlanPanelProps = {
  isPro: boolean;
  hideBranding: boolean;
  busy: boolean;
  t: TranslateFn;
};

export type SetupPanelProps = {
  shop: string;
  busy: boolean;
  t: TranslateFn;
};
