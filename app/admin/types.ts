import type { BarConfig, RewardTier } from "../models/bar-config";

export type UpdateConfig = <K extends keyof BarConfig>(
  key: K,
  value: BarConfig[K],
) => void;

export type UpdateRewardTier = (
  index: number,
  patch: Partial<RewardTier>,
) => void;
