import { DEFAULT_BAR_CONFIG } from "../../models/bar-config";
import type { TranslateFn } from "../../i18n";

/** If merchant left an English app default, show the admin-locale string instead. */
export function localizedCopy(
  value: string | null | undefined,
  englishDefaults: string | string[],
  tKey: string,
  t: TranslateFn,
): string {
  const raw = String(value ?? "").trim();
  const defaults = Array.isArray(englishDefaults)
    ? englishDefaults
    : [englishDefaults];
  if (!raw || defaults.includes(raw)) return t(tKey);
  return raw;
}

const TIER_DESCRIPTION_KEYS: Record<string, string> = {
  "Free Shipping": "contentDefaults.tierFreeShipping",
  "Free Express": "contentDefaults.tierFreeExpress",
  "Free Gift": "contentDefaults.tierFreeGift",
  "VIP Reward": "contentDefaults.tierVipReward",
};

const TIER_TITLE_BEFORE_KEYS: Record<string, string> = {
  "You're [AMOUNT] away from free shipping!":
    "contentDefaults.awayFreeShipping",
  "You're [AMOUNT] away from free express shipping!":
    "contentDefaults.awayFreeExpress",
  "You're [AMOUNT] away from a free gift!": "contentDefaults.awayFreeGift",
  "You're [AMOUNT] away from VIP reward!": "contentDefaults.awayVipReward",
  "You're [AMOUNT] away!": "contentDefaults.awayGeneric",
  "You're {{amount_remaining}} away from free shipping!":
    "contentDefaults.awayFreeShippingAmount",
};

export function localizeTierDescription(
  value: string | null | undefined,
  t: TranslateFn,
): string {
  const raw = String(value ?? "").trim();
  const key = TIER_DESCRIPTION_KEYS[raw];
  return key ? t(key) : raw;
}

export function localizeTierTitleBefore(
  value: string | null | undefined,
  t: TranslateFn,
): string {
  const raw = String(value ?? "").trim();
  const key = TIER_TITLE_BEFORE_KEYS[raw];
  return key ? t(key) : raw || t("contentDefaults.awayGeneric");
}

export function previewCopy(t: TranslateFn) {
  const d = DEFAULT_BAR_CONFIG;
  return {
    buttonText: (v: string) =>
      localizedCopy(v, d.buttonText, "contentDefaults.addToCart", t),
    soldOutText: (v: string) =>
      localizedCopy(v, d.soldOutText, "contentDefaults.soldOut", t),
    drawerTitle: (v: string) =>
      localizedCopy(
        v,
        [
          d.drawerTitle,
          "Your cart",
          "Your cart {{cart_quantity}}",
          "YOUR CART ({{cart_quantity}})",
        ],
        "contentDefaults.drawerTitle",
        t,
      ),
    drawerCheckoutText: (v: string) =>
      localizedCopy(v, d.drawerCheckoutText, "contentDefaults.checkout", t),
    announcementText: (v: string) =>
      localizedCopy(v, d.announcementText, "contentDefaults.reservedFor", t),
    rewardCompleteText: (v: string) =>
      localizedCopy(
        v,
        d.rewardCompleteText,
        "contentDefaults.freeShippingUnlocked",
        t,
      ),
    recommendationsHeader: (v: string) =>
      localizedCopy(
        v,
        d.recommendationsHeader,
        "contentDefaults.youMayAlsoLike",
        t,
      ),
    recommendationsAddText: (v: string) =>
      localizedCopy(v, d.recommendationsAddText, "contentDefaults.add", t),
    recommendationsEmptyText: (v: string) =>
      localizedCopy(
        v,
        d.recommendationsEmptyText,
        "contentDefaults.addFavorites",
        t,
      ),
    discountPlaceholder: (v: string) =>
      localizedCopy(v, d.discountPlaceholder, "contentDefaults.discountCode", t),
    discountButtonText: (v: string) =>
      localizedCopy(v, d.discountButtonText, "contentDefaults.apply", t),
    trustBadgesText: (v: string) =>
      localizedCopy(v, d.trustBadgesText, "contentDefaults.trustDefault", t),
    tierDescription: (v: string) => localizeTierDescription(v, t),
    tierTitleBefore: (v: string) => localizeTierTitleBefore(v, t),
  };
}
