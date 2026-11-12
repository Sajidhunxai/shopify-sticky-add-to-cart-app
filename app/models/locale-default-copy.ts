import { DEFAULT_BAR_CONFIG, type BarConfig, type RewardTier } from "./bar-config";

/** English app defaults — blank these in metafields so Liquid `| t` follows shop locale. */
const COPY_FIELDS = [
  "buttonText",
  "soldOutText",
  "drawerTitle",
  "drawerCheckoutText",
  "announcementText",
  "rewardCompleteText",
  "recommendationsEmptyText",
  "recommendationsHeader",
  "recommendationsAddText",
  "recommendationsShopNowText",
  "discountPlaceholder",
  "discountButtonText",
  "trustBadgesText",
  "freeShippingText",
  "freeShippingReachedText",
] as const;

const EXTRA_ENGLISH: Partial<Record<(typeof COPY_FIELDS)[number], string[]>> = {
  drawerTitle: [
    "Your cart",
    "Your cart {{cart_quantity}}",
    "YOUR CART ({{cart_quantity}})",
  ],
  freeShippingText: [
    "You're {{amount_remaining}} away from free shipping!",
    "You're [AMOUNT] away from free shipping!",
  ],
  freeShippingReachedText: [
    "Free shipping unlocked!",
    "You've unlocked free shipping!",
  ],
  rewardCompleteText: [
    "Free shipping unlocked!",
    "You've unlocked free shipping!",
  ],
};

const TIER_DESCRIPTION_DEFAULTS = new Set(
  DEFAULT_BAR_CONFIG.rewardTiers.map((t) => t.description),
);

const TIER_TITLE_DEFAULTS = new Set([
  ...DEFAULT_BAR_CONFIG.rewardTiers.map((t) => t.titleBefore),
  "You're [AMOUNT] away!",
  "You're {{amount_remaining}} away from free shipping!",
]);

function isEnglishDefault(
  field: (typeof COPY_FIELDS)[number],
  value: string,
): boolean {
  const raw = value.trim();
  if (!raw) return true;
  const primary = String(DEFAULT_BAR_CONFIG[field] ?? "").trim();
  if (primary && raw === primary) return true;
  return (EXTRA_ENGLISH[field] || []).includes(raw);
}

function localizeAwareTier(tiers: RewardTier[]): RewardTier[] {
  return tiers.map((tier) => {
    const description = TIER_DESCRIPTION_DEFAULTS.has(
      String(tier.description || "").trim(),
    )
      ? ""
      : tier.description;
    const titleBefore = TIER_TITLE_DEFAULTS.has(
      String(tier.titleBefore || "").trim(),
    )
      ? ""
      : tier.titleBefore;
    return { ...tier, description, titleBefore };
  });
}

/**
 * Metafield payload for the storefront: clear English defaults so theme
 * locale files drive copy. Admin DB keeps the full editable config.
 */
export function storefrontConfigForLocale(config: BarConfig): BarConfig {
  const next: BarConfig = {
    ...config,
    rewardTiers: localizeAwareTier(config.rewardTiers),
  };

  for (const field of COPY_FIELDS) {
    const value = String(next[field] ?? "");
    if (isEnglishDefault(field, value)) {
      (next as Record<string, unknown>)[field] = "";
    }
  }

  return next;
}
