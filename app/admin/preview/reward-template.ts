import type { BarConfig, RewardTier } from "../../models/bar-config";
import {
  activeRewardTiers,
  rewardMessage,
  rewardProgressPct,
} from "./reward-progress";
import { renderMustache, sanitizeFeatureHtml } from "./mustache";

const ICONS: Record<string, string> = {
  truck: `<svg class="satc-slider__reward-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 7h11v8H3V7zm12 2h3.2L21 12.5V15h-6V9zM6.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`,
  gift: `<svg class="satc-slider__reward-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 7h-2.26A3.5 3.5 0 0 0 12 3.05 3.5 3.5 0 0 0 6.26 7H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1ZM9.5 5.5a1.5 1.5 0 1 1 0 3H8.26a1.5 1.5 0 0 1 1.24-3Zm5 0a1.5 1.5 0 0 1 1.24 3H14.5a1.5 1.5 0 1 1 0-3ZM6 19v-7h5v7H6Zm12 0h-5v-7h5v7Z"/></svg>`,
  percent: `<svg class="satc-slider__reward-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.5 6.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM8 17.5 16.5 6.5l1.1 1.1L9.1 18.6 8 17.5z"/></svg>`,
  star: `<svg class="satc-slider__reward-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 2.8 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8l5-.7L12 2.8z"/></svg>`,
  check: `<svg class="satc-slider__reward-icon" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M6.2 11.4 2.8 8l1.2-1.2 2.2 2.2 5-5L12.4 5.2z"/></svg>`,
  heart: `<svg class="satc-slider__reward-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-6.7-4.2-9.2-8.1C1.1 10.2 2 7 5 6.2c1.8-.5 3.5.3 4.5 1.6C10.5 6.5 12.2 5.7 14 6.2c3 .8 3.9 4 2.2 6.7C18.7 16.8 12 21 12 21z"/></svg>`,
  lock: `<svg class="satc-slider__reward-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 10V8a5 5 0 0 1 10 0v2h1.5A1.5 1.5 0 0 1 20 11.5v8A1.5 1.5 0 0 1 18.5 21h-13A1.5 1.5 0 0 1 4 19.5v-8A1.5 1.5 0 0 1 5.5 10H7zm2 0h6V8a3 3 0 0 0-6 0v2z"/></svg>`,
};

function resolveIconKey(tier: RewardTier): string {
  const icon = String(tier.icon || "auto");
  if (icon === "custom") return "custom";
  if (icon && icon !== "auto" && ICONS[icon]) return icon;
  const type = tier.rewardType || "custom";
  if (type === "shipping") return "truck";
  if (type === "discount") return "percent";
  if (type === "product") return "gift";
  return "star";
}

function iconHtml(tier: RewardTier): string {
  const url = String(tier.iconUrl || "").trim();
  if (url) {
    return `<img class="satc-slider__reward-icon-img" src="${url.replace(/"/g, "&quot;")}" alt="" loading="lazy">`;
  }
  const key = resolveIconKey(tier);
  if (key === "custom") {
    const type = tier.rewardType || "custom";
    if (type === "shipping") return ICONS.truck;
    if (type === "discount") return ICONS.percent;
    if (type === "product") return ICONS.gift;
    return ICONS.star;
  }
  return ICONS[key] || ICONS.star;
}

export type RewardPreviewTierRow = {
  index: number;
  description: string;
  goal: string;
  icon: string;
  reward_type: string;
  icon_html: string;
  label_html: string;
  reached_class: string;
  current_class: string;
  reached: string;
  current: string;
};

export function buildRewardPreviewModel(
  config: BarConfig,
  previewValue: number,
): {
  message: string;
  progress_pct: number;
  tiers: RewardPreviewTierRow[];
  tiers_html: string;
} | null {
  const tiers = activeRewardTiers(config);
  if (!tiers.length) return null;
  const pct = Math.round(rewardProgressPct(previewValue, tiers));
  const message = rewardMessage(config, tiers, previewValue);
  const nextIndex = tiers.findIndex(
    (t) => previewValue < (Number(t.minAmount) || 0),
  );
  const tierTpl = config.featureTemplates.rewardTier;
  const tierTplHtml =
    tierTpl?.enabled && String(tierTpl.template || "").trim()
      ? String(tierTpl.template).trim()
      : "";

  const defaultTierMarkup = (row: RewardPreviewTierRow) =>
    `<div class="satc-slider__reward-milestone${row.reached_class}${row.current_class}" data-reward-type="${row.reward_type}" data-reward-icon="${row.icon}" style="--satc-tier-i:${row.index}">
  <span class="satc-slider__reward-dot" aria-hidden="true">${row.icon_html}</span>
  <span class="satc-slider__reward-label">${row.label_html}</span>
  <span class="satc-slider__reward-goal">${row.goal}</span>
</div>`;

  const rows: RewardPreviewTierRow[] = tiers.map((tier, index) => {
    const goal = Number(tier.minAmount) || 0;
    const reached = previewValue >= goal;
    const isCurrent = !reached && index === nextIndex;
    const goalLabel =
      config.rewardCalcMode === "quantity"
        ? String(Math.round(goal))
        : `$${goal.toFixed(2)}`;
    return {
      index,
      description: tier.description || "Reward",
      goal: goalLabel,
      icon: String(tier.icon || "auto"),
      reward_type: tier.rewardType || "custom",
      icon_html: iconHtml(tier),
      label_html: tier.description || "Reward",
      reached_class: reached ? " is-reached" : "",
      current_class: isCurrent ? " is-current" : "",
      reached: reached ? "true" : "",
      current: isCurrent ? "true" : "",
    };
  });

  const tiers_html = rows
    .map((row) =>
      tierTplHtml
        ? renderMustache(tierTplHtml, row)
        : defaultTierMarkup(row),
    )
    .join("");

  return { message, progress_pct: pct, tiers: rows, tiers_html };
}

/** Render custom rewards shell HTML for admin preview, or null to use React fallback. */
export function renderRewardsCustomPreview(
  config: BarConfig,
  previewValue: number,
): { html: string; css: string } | null {
  const tpl = config.featureTemplates.rewards;
  const template = String(tpl?.template || "").trim();
  if (!tpl?.enabled || !template) return null;
  const model = buildRewardPreviewModel(config, previewValue);
  if (!model) return null;
  const html = sanitizeFeatureHtml(
    renderMustache(template, {
      message: model.message,
      progress_pct: model.progress_pct,
      tiers_html: model.tiers_html,
      tiers: model.tiers,
    }) + String(tpl.html || ""),
  );
  const cssParts: string[] = [];
  if (tpl.css) cssParts.push(`[data-satc-feature="rewards"]{\n${tpl.css}\n}`);
  const tierCss = config.featureTemplates.rewardTier?.css;
  if (config.featureTemplates.rewardTier?.enabled && tierCss) {
    cssParts.push(`[data-satc-feature="rewards"]{\n${tierCss}\n}`);
  }
  return { html, css: cssParts.join("\n") };
}
