import type { BarConfig, RewardTier } from "../../models/bar-config";

export type ActiveRewardTier = RewardTier[];

export function activeRewardTiers(config: BarConfig): ActiveRewardTier {
  return config.rewardTiers
    .filter((t) => t.enabled)
    .slice()
    .sort(
      (a, b) => (Number(a.minAmount) || 0) - (Number(b.minAmount) || 0),
    );
}

/** Equal segments per tier — mirrors storefront sticky-atc-drawer.js */
export function rewardProgressPct(
  value: number,
  tiers: ActiveRewardTier,
): number {
  if (!tiers.length) return 0;
  const goals = tiers.map((t) => Number(t.minAmount) || 0);
  const last = goals[goals.length - 1];
  if (value >= last) return 100;
  let prev = 0;
  for (let i = 0; i < goals.length; i++) {
    const goal = goals[i];
    const segStart = (i / goals.length) * 100;
    const segEnd = ((i + 1) / goals.length) * 100;
    if (value <= goal) {
      const within = (value - prev) / Math.max(goal - prev, 0.0001);
      return Math.min(100, segStart + within * (segEnd - segStart));
    }
    prev = goal;
  }
  return 100;
}

export function rewardMessage(
  config: BarConfig,
  tiers: ActiveRewardTier,
  progressValue: number,
): string {
  const next = tiers.find((t) => progressValue < (Number(t.minAmount) || 0));
  if (!next) return config.rewardCompleteText;
  const remaining = (Number(next.minAmount) || 0) - progressValue;
  const label =
    config.rewardCalcMode === "quantity"
      ? String(Math.ceil(remaining))
      : `$${remaining.toFixed(2)}`;
  return (next.titleBefore || "You're [AMOUNT] away!")
    .replace(/\[AMOUNT\]/gi, label)
    .replace(/\{\{\s*amount_remaining\s*\}\}/gi, label);
}
