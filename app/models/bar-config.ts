import {
  createDefaultFeatureTemplates,
  normalizeFeatureTemplates,
  type FeatureTemplates,
} from "./feature-templates";

export type { FeatureTemplate, FeatureTemplateKey, FeatureTemplates } from "./feature-templates";
export {
  FEATURE_TEMPLATE_KEYS,
  FEATURE_TEMPLATE_META,
  createDefaultFeatureTemplates,
  normalizeFeatureTemplates,
  sanitizeFeatureHtml,
} from "./feature-templates";

export type Plan = "free" | "pro";

export type AfterAddBehavior = "stay" | "cart" | "drawer";

/** How the sticky experience is presented on the storefront. */
export type DisplayMode = "bar" | "slider" | "quickbuy";

export type BackgroundStyle = "solid" | "blur" | "gradient";
export type ImageShape = "rounded" | "circle" | "square";
export type BarLayout = "row" | "compact" | "stacked";
export type ButtonSize = "normal" | "large" | "full";
export type BarPosition =
  | "bottom"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "top-left"
  | "top-right"
  | "left"
  | "right";

export type RewardType = "shipping" | "discount" | "product" | "custom";

export type RecommendationSource = "collection" | "products";
export type DrawerAnimation = "slide" | "fade" | "scale" | "none";
export type RecsAnimation = "stagger" | "fade" | "slide" | "none";
export type RewardAnimation = "smooth" | "pulse" | "glow" | "bounce" | "none";
/** Where toast lives: inside the cart drawer panel, or fixed on the page */
export type ToastPlacement = "drawer" | "page";
export type ToastPosition =
  | "top"
  | "bottom"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
export type ToastStyle = "solid" | "soft" | "outline" | "minimal";
/** stacked = milestones above bar; middle = progress line through icons */
export type RewardBarLayout = "stacked" | "middle";
export type RewardBarStyle = "solid" | "gradient" | "striped";
export type RewardMessagePosition = "below" | "above";
/** Where milestone icons sit relative to the progress line */
export type RewardIconPosition = "inside" | "outside-top" | "outside-bottom";
export type RewardIconStyle = "filled" | "outline" | "soft" | "plain";
export type RewardIconPreset =
  | "auto"
  | "truck"
  | "gift"
  | "percent"
  | "star"
  | "check"
  | "heart"
  | "lock"
  | "custom";

export const REWARD_ICON_PRESETS: {
  id: RewardIconPreset;
  label: string;
}[] = [
  { id: "auto", label: "Auto (from type)" },
  { id: "truck", label: "Truck" },
  { id: "gift", label: "Gift" },
  { id: "percent", label: "Percent" },
  { id: "star", label: "Star" },
  { id: "check", label: "Check" },
  { id: "heart", label: "Heart" },
  { id: "lock", label: "Lock" },
  { id: "custom", label: "Shopify file" },
];

export type RecommendationProduct = {
  handle: string;
  title: string;
  url: string;
  image: string;
  /** First available variant id as string (storefront add-to-cart) */
  variantId: string;
};

export type RewardTier = {
  enabled: boolean;
  minAmount: number;
  description: string;
  /** Supports [AMOUNT] for remaining amount/qty */
  titleBefore: string;
  rewardType: RewardType;
  /** Used when rewardType is product */
  productHandle: string;
  productTitle: string;
  productUrl: string;
  /** Milestone icon for this tier */
  icon: RewardIconPreset;
  /** Image URL when icon is custom */
  iconUrl: string;
};

export type BarConfig = {
  enabled: boolean;
  displayMode: DisplayMode;
  showImage: boolean;
  showTitle: boolean;
  showPrice: boolean;
  showQuantity: boolean;
  showMobile: boolean;
  showDesktop: boolean;
  /** Product pages (recommended — bar needs a product context). */
  showOnProduct: boolean;
  /** Collection / catalog pages. */
  showOnCollection: boolean;
  /** Store homepage. */
  showOnHome: boolean;
  /** Search results. */
  showOnSearch: boolean;
  /** Cart, blog, pages, and other templates. */
  showOnOther: boolean;
  hideNearForm: boolean;
  buttonText: string;
  soldOutText: string;
  afterAdd: AfterAddBehavior;
  backgroundStyle: BackgroundStyle;
  backgroundOpacity: number;
  imageShape: ImageShape;
  layout: BarLayout;
  buttonSize: ButtonSize;
  barPosition: BarPosition;
  contentGap: number;
  showShadow: boolean;
  borderWidth: number;
  borderColor: string;
  barRadius: number;
  buttonRadius: number;
  imageRadius: number;
  paddingY: number;
  paddingX: number;
  imageSize: number;
  titleFontSize: number;
  priceFontSize: number;
  buttonFontSize: number;
  desktopMaxWidth: number;
  desktopBottomOffset: number;
  /** Mobile: px scrolled before bar appears. */
  showAfterScroll: number;
  /** Desktop: px scrolled before bar appears (lower = earlier). */
  showAfterScrollDesktop: number;
  backgroundColor: string;
  textColor: string;
  /**
   * When true, drawer/bar use the theme body font
   * (e.g. --font-body-family) instead of a forced stack.
   */
  inheritThemeFont: boolean;
  /**
   * When true, title/body text color follows the theme
   * (--color-foreground) instead of textColor.
   */
  inheritThemeTextColor: boolean;
  buttonBackground: string;
  buttonTextColor: string;
  /** Accent used in cart drawer highlights / progress UI. */
  accentColor: string;
  /** Cart drawer header title. Supports {{cart_quantity}}. */
  drawerTitle: string;
  /** Cart drawer checkout button label. */
  drawerCheckoutText: string;
  drawerHeaderHeight: "slim" | "tall";
  drawerHeaderBorder: "none" | "thin";
  drawerHeaderBg: string;
  drawerTitleAlign: "left" | "center";
  drawerTitleWeight: "normal" | "semibold" | "bold";
  drawerTitleSize: number;
  drawerCloseSide: "left" | "right";
  drawerCloseBg: string;
  drawerCloseHoverBg: string;
  drawerCloseColor: string;
  drawerCloseIconSize: "small" | "medium" | "large";
  drawerCloseBorder: "none" | "thin" | "normal" | "thick";
  /** Blur the page behind the open cart drawer */
  drawerBackdropBlur: boolean;
  /** 0–100 overlay darkness behind the drawer */
  drawerBackdropOpacity: number;
  /** Show +/- quantity controls on drawer cart lines */
  cartLineQtyEnabled: boolean;
  /** Show remove control on drawer cart lines */
  cartLineRemoveEnabled: boolean;
  /** Cart line product image */
  cartLineShowImage: boolean;
  cartLineImageSize: number;
  cartLineImageRadius: number;
  cartLineShowTitle: boolean;
  cartLineTitleSize: number;
  cartLineShowPrice: boolean;
  cartLinePriceSize: number;
  cartLineShowVariant: boolean;
  cartLineGap: number;
  cartLineQtyStyle: "stepper" | "plain";
  cartLineQtySize: "small" | "medium" | "large";
  cartLineRemoveStyle: "x" | "delete" | "remove" | "trash";
  cartLineRemoveSize: "small" | "medium" | "large";
  /** Cart line colors */
  cartLineBg: string;
  cartLineTextColor: string;
  cartLineBorderColor: string;
  cartLineQtyBg: string;
  cartLineQtyText: string;
  cartLineRemoveColor: string;
  /** Cart drawer page/device visibility (independent of sticky bar flags) */
  drawerShowOnProduct: boolean;
  drawerShowOnCollection: boolean;
  drawerShowOnHome: boolean;
  drawerShowOnSearch: boolean;
  drawerShowOnOther: boolean;
  drawerShowDesktop: boolean;
  drawerShowMobile: boolean;
  announcementEnabled: boolean;
  announcementText: string;
  announcementBg: string;
  announcementTextColor: string;
  announcementBorderColor: string;
  announcementHeight: "slim" | "normal" | "thick";
  announcementPosition: "before" | "after";
  /** MM:SS countdown, e.g. 15:00 */
  announcementTimer: string;
  announcementFontSize: number;
  /**
   * @deprecated Migrated into rewardTiers / rewardEnabled.
   * Keep until Liquid/JS stop reading data-ship-*; then delete in one cleanup PR.
   */
  freeShippingEnabled: boolean;
  /** @deprecated see freeShippingEnabled */
  freeShippingThreshold: number;
  /** @deprecated see freeShippingEnabled */
  freeShippingText: string;
  /** @deprecated see freeShippingEnabled */
  freeShippingReachedText: string;
  rewardEnabled: boolean;
  rewardShowOnEmpty: boolean;
  /** When true, rewards strip uses theme accent / foreground tokens */
  rewardUseThemeColors: boolean;
  rewardBg: string;
  rewardFg: string;
  rewardIconColor: string;
  rewardTextColor: string;
  rewardCompleteText: string;
  rewardCalcMode: "total" | "quantity";
  rewardTiers: RewardTier[];
  recommendationsEnabled: boolean;
  /** Shown under “Your cart is empty” */
  recommendationsEmptyText: string;
  recommendationsHeader: string;
  recommendationsMax: number;
  recommendationsAddText: string;
  recommendationsShopNowEnabled: boolean;
  recommendationsShopNowText: string;
  recommendationsShopNowUrl: string;
  /** Collection handle when source is collection (e.g. all, bestsellers) */
  recommendationsCollection: string;
  /** Show “You may also like” when the cart already has items */
  recommendationsShowWithItems: boolean;
  /** Hide recommended products that are already in the cart */
  recommendationsHideInCart: boolean;
  recommendationsSource: RecommendationSource;
  /** Hand-picked products when source is products */
  recommendationsProducts: RecommendationProduct[];
  /** Cart drawer open/close motion */
  drawerAnimation: DrawerAnimation;
  /** Toast host: drawer panel or page overlay */
  toastPlacement: ToastPlacement;
  /** Corner / edge position for toast */
  toastPosition: ToastPosition;
  /** Visual style for toast */
  toastStyle: ToastStyle;
  toastRadius: number;
  toastFontSize: number;
  toastSuccessBg: string;
  toastSuccessText: string;
  toastErrorBg: string;
  toastErrorText: string;
  /** Show success toasts (add / update) */
  toastShowSuccess: boolean;
  /** Show error toasts */
  toastShowError: boolean;
  /** Show toast when a line is removed */
  toastShowRemove: boolean;
  /** Show success toast when quantity is updated */
  toastShowUpdate: boolean;
  /** Recommendation cards entrance motion */
  recommendationsAnimation: RecsAnimation;
  /** Tiered rewards progress / unlock motion */
  rewardAnimation: RewardAnimation;
  /** Progress bar layout: bar below milestones, or line through icons */
  rewardBarLayout: RewardBarLayout;
  /** Progress fill style */
  rewardBarStyle: RewardBarStyle;
  /** Where the “You’re $X away…” message sits */
  rewardMessagePosition: RewardMessagePosition;
  /** Show milestone icons on the progress bar */
  rewardShowIcons: boolean;
  /** Icon look: filled circle, outline, soft, plain */
  rewardIconStyle: RewardIconStyle;
  /** Icon placement vs the progress line */
  rewardIconPosition: RewardIconPosition;
  /** Milestone icon diameter in px (dot size) */
  rewardIconSize: number;
  discountEnabled: boolean;
  discountPlaceholder: string;
  discountButtonText: string;
  trustBadgesEnabled: boolean;
  trustBadgesText: string;
  /**
   * Global CSS injected into the cart drawer (not feature-scoped).
   * Prefer per-feature css under featureTemplates when possible.
   */
  customCss: string;
  /** Per-feature HTML / CSS / Mustache template overrides */
  featureTemplates: FeatureTemplates;
};

export const DEFAULT_BAR_CONFIG: BarConfig = {
  enabled: true,
  displayMode: "bar",
  showImage: true,
  showTitle: true,
  showPrice: true,
  showQuantity: false,
  showMobile: true,
  showDesktop: true,
  showOnProduct: true,
  showOnCollection: false,
  showOnHome: false,
  showOnSearch: false,
  showOnOther: false,
  hideNearForm: true,
  buttonText: "Add to cart",
  soldOutText: "Sold out",
  afterAdd: "stay",
  backgroundStyle: "solid",
  backgroundOpacity: 100,
  imageShape: "rounded",
  layout: "row",
  buttonSize: "normal",
  barPosition: "bottom",
  contentGap: 12,
  showShadow: true,
  borderWidth: 0,
  borderColor: "#e5e7eb",
  barRadius: 14,
  buttonRadius: 8,
  imageRadius: 8,
  paddingY: 12,
  paddingX: 16,
  imageSize: 64,
  titleFontSize: 14,
  priceFontSize: 13,
  buttonFontSize: 14,
  desktopMaxWidth: 720,
  desktopBottomOffset: 20,
  showAfterScroll: 80,
  showAfterScrollDesktop: 0,
  backgroundColor: "#ffffff",
  textColor: "#111111",
  inheritThemeFont: true,
  inheritThemeTextColor: true,
  buttonBackground: "#111111",
  buttonTextColor: "#ffffff",
  accentColor: "#111111",
  drawerTitle: "YOUR CART ({{cart_quantity}})",
  drawerCheckoutText: "Checkout",
  drawerHeaderHeight: "slim",
  drawerHeaderBorder: "thin",
  drawerHeaderBg: "#ffffff",
  drawerTitleAlign: "left",
  drawerTitleWeight: "bold",
  drawerTitleSize: 14,
  drawerCloseSide: "right",
  drawerCloseBg: "transparent",
  drawerCloseHoverBg: "#f3f4f6",
  drawerCloseColor: "#111111",
  drawerCloseIconSize: "medium",
  drawerCloseBorder: "none",
  drawerBackdropBlur: true,
  drawerBackdropOpacity: 45,
  cartLineQtyEnabled: true,
  cartLineRemoveEnabled: true,
  cartLineShowImage: true,
  cartLineImageSize: 56,
  cartLineImageRadius: 8,
  cartLineShowTitle: true,
  cartLineTitleSize: 14,
  cartLineShowPrice: true,
  cartLinePriceSize: 14,
  cartLineShowVariant: true,
  cartLineGap: 12,
  cartLineQtyStyle: "stepper",
  cartLineQtySize: "medium",
  cartLineRemoveStyle: "x",
  cartLineRemoveSize: "medium",
  cartLineBg: "transparent",
  cartLineTextColor: "",
  cartLineBorderColor: "rgba(0,0,0,0.06)",
  cartLineQtyBg: "transparent",
  cartLineQtyText: "",
  cartLineRemoveColor: "",
  drawerShowOnProduct: true,
  drawerShowOnCollection: true,
  drawerShowOnHome: true,
  drawerShowOnSearch: true,
  drawerShowOnOther: true,
  drawerShowDesktop: true,
  drawerShowMobile: true,
  announcementEnabled: false,
  announcementText: "Your products are reserved for {timer}!",
  announcementBg: "#d8009f",
  announcementTextColor: "#ffffff",
  announcementBorderColor: "#ffffff",
  announcementHeight: "normal",
  announcementPosition: "before",
  announcementTimer: "15:00",
  announcementFontSize: 14,
  freeShippingEnabled: false,
  freeShippingThreshold: 100,
  freeShippingText: "You're {{amount_remaining}} away from free shipping!",
  freeShippingReachedText: "You've unlocked free shipping!",
  rewardEnabled: true,
  rewardShowOnEmpty: true,
  rewardUseThemeColors: false,
  rewardBg: "#F0F2FF",
  rewardFg: "#B3009F",
  rewardIconColor: "#111111",
  rewardTextColor: "#111111",
  rewardCompleteText: "Free shipping unlocked!",
  rewardCalcMode: "total",
  rewardBarLayout: "stacked",
  rewardBarStyle: "gradient",
  rewardMessagePosition: "below",
  rewardShowIcons: true,
  rewardIconStyle: "filled",
  rewardIconPosition: "outside-top",
  rewardIconSize: 28,
  rewardTiers: [
    {
      enabled: true,
      minAmount: 100,
      description: "Free Shipping",
      titleBefore: "You're [AMOUNT] away from free shipping!",
      rewardType: "shipping",
      productHandle: "",
      productTitle: "",
      productUrl: "",
      icon: "truck",
      iconUrl: "",
    },
    {
      enabled: true,
      minAmount: 150,
      description: "Free Express",
      titleBefore: "You're [AMOUNT] away from free express shipping!",
      rewardType: "shipping",
      productHandle: "",
      productTitle: "",
      productUrl: "",
      icon: "truck",
      iconUrl: "",
    },
    {
      enabled: false,
      minAmount: 200,
      description: "Free Gift",
      titleBefore: "You're [AMOUNT] away from a free gift!",
      rewardType: "product",
      productHandle: "",
      productTitle: "",
      productUrl: "",
      icon: "gift",
      iconUrl: "",
    },
    {
      enabled: false,
      minAmount: 250,
      description: "VIP Reward",
      titleBefore: "You're [AMOUNT] away from VIP reward!",
      rewardType: "custom",
      productHandle: "",
      productTitle: "",
      productUrl: "",
      icon: "star",
      iconUrl: "",
    },
  ],
  recommendationsEnabled: true,
  recommendationsEmptyText: "Add your favorite items to your cart.",
  recommendationsHeader: "You may also like",
  recommendationsMax: 3,
  recommendationsAddText: "Add",
  recommendationsShopNowEnabled: false,
  recommendationsShopNowText: "Shop now",
  recommendationsShopNowUrl: "/collections/all",
  recommendationsCollection: "all",
  recommendationsShowWithItems: true,
  recommendationsHideInCart: true,
  recommendationsSource: "collection",
  recommendationsProducts: [],
  drawerAnimation: "slide",
  toastPlacement: "drawer",
  toastPosition: "bottom",
  toastStyle: "solid",
  toastRadius: 10,
  toastFontSize: 13,
  toastSuccessBg: "#065f46",
  toastSuccessText: "#ffffff",
  toastErrorBg: "#991b1b",
  toastErrorText: "#ffffff",
  toastShowSuccess: true,
  toastShowError: true,
  toastShowRemove: true,
  toastShowUpdate: false,
  recommendationsAnimation: "stagger",
  rewardAnimation: "smooth",
  discountEnabled: false,
  discountPlaceholder: "Discount code",
  discountButtonText: "Apply",
  trustBadgesEnabled: false,
  trustBadgesText: "Secure checkout · Free returns · 24/7 support",
  customCss: "",
  featureTemplates: createDefaultFeatureTemplates(),
};

function asBool(value: FormDataEntryValue | null | undefined, fallback: boolean) {
  if (value === null || value === undefined || value === "") return fallback;
  return value === "true" || value === "on" || value === "1";
}

function asNumber(value: FormDataEntryValue | null | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asString(value: FormDataEntryValue | null | undefined, fallback: string) {
  const s = String(value ?? "").trim();
  return s || fallback;
}

function asDisplayMode(
  value: FormDataEntryValue | null | undefined,
): DisplayMode {
  const raw = String(value || "bar");
  if (raw === "slider" || raw === "quickbuy") return raw;
  return "bar";
}

function asBackgroundStyle(
  value: FormDataEntryValue | null | undefined,
): BackgroundStyle {
  const raw = String(value || "solid");
  if (raw === "blur" || raw === "gradient") return raw;
  return "solid";
}

function asImageShape(value: FormDataEntryValue | null | undefined): ImageShape {
  const raw = String(value || "rounded");
  if (raw === "circle" || raw === "square") return raw;
  return "rounded";
}

function asLayout(value: FormDataEntryValue | null | undefined): BarLayout {
  const raw = String(value || "row");
  if (raw === "compact" || raw === "stacked") return raw;
  return "row";
}

function asButtonSize(value: FormDataEntryValue | null | undefined): ButtonSize {
  const raw = String(value || "normal");
  if (raw === "large" || raw === "full") return raw;
  return "normal";
}

function asBarPosition(value: FormDataEntryValue | null | undefined): BarPosition {
  const raw = String(value || "bottom");
  switch (raw) {
    case "bottom-left":
    case "bottom-right":
    case "top":
    case "top-left":
    case "top-right":
    case "left":
    case "right":
      return raw;
    default:
      return "bottom";
  }
}

function asRewardType(value: unknown, fallback: RewardType): RewardType {
  const raw = String(value || "");
  if (
    raw === "shipping" ||
    raw === "discount" ||
    raw === "product" ||
    raw === "custom"
  ) {
    return raw;
  }
  return fallback;
}

function asRewardIconPreset(
  value: unknown,
  fallback: RewardIconPreset,
): RewardIconPreset {
  const raw = String(value || "");
  if (
    raw === "auto" ||
    raw === "truck" ||
    raw === "gift" ||
    raw === "percent" ||
    raw === "star" ||
    raw === "check" ||
    raw === "heart" ||
    raw === "lock" ||
    raw === "custom"
  ) {
    return raw;
  }
  return fallback;
}

function asRewardIconStyle(
  value: FormDataEntryValue | null | undefined | string,
): RewardIconStyle {
  const raw = String(value || "filled");
  if (
    raw === "outline" ||
    raw === "soft" ||
    raw === "plain" ||
    raw === "filled"
  ) {
    return raw;
  }
  return "filled";
}

function asRewardIconPosition(
  value: FormDataEntryValue | null | undefined | string,
): RewardIconPosition {
  const raw = String(value || "outside-top");
  if (
    raw === "inside" ||
    raw === "outside-top" ||
    raw === "outside-bottom" ||
    raw === "top" ||
    raw === "bottom"
  ) {
    if (raw === "top") return "outside-top";
    if (raw === "bottom") return "outside-bottom";
    return raw as RewardIconPosition;
  }
  return "outside-top";
}

function normalizeRewardTiers(input: unknown): RewardTier[] {
  const defaults = DEFAULT_BAR_CONFIG.rewardTiers;
  if (!Array.isArray(input) || input.length === 0) {
    return defaults.map((t) => ({ ...t }));
  }
  return defaults.map((fallback, index) => {
    const row = (input[index] || {}) as Partial<RewardTier>;
    return {
      enabled: Boolean(row.enabled ?? fallback.enabled),
      minAmount: Number.isFinite(Number(row.minAmount))
        ? Number(row.minAmount)
        : fallback.minAmount,
      description: String(row.description || fallback.description),
      titleBefore: String(row.titleBefore || fallback.titleBefore),
      rewardType: asRewardType(row.rewardType, fallback.rewardType),
      productHandle: String(row.productHandle || fallback.productHandle || ""),
      productTitle: String(row.productTitle || fallback.productTitle || ""),
      productUrl: String(row.productUrl || fallback.productUrl || ""),
      icon: asRewardIconPreset(row.icon, fallback.icon || "auto"),
      iconUrl: String(row.iconUrl || fallback.iconUrl || "").slice(0, 2000),
    };
  });
}

function asRecommendationSource(
  value: FormDataEntryValue | null | undefined | string,
): RecommendationSource {
  return String(value || "") === "products" ? "products" : "collection";
}

function asDrawerAnimation(
  value: FormDataEntryValue | null | undefined | string,
): DrawerAnimation {
  const raw = String(value || "slide");
  if (raw === "fade" || raw === "scale" || raw === "none" || raw === "slide") {
    return raw;
  }
  return "slide";
}

function asToastPlacement(
  value: FormDataEntryValue | null | undefined | string,
): ToastPlacement {
  return String(value || "") === "page" ? "page" : "drawer";
}

function asToastPosition(
  value: FormDataEntryValue | null | undefined | string,
): ToastPosition {
  const raw = String(value || "bottom");
  if (
    raw === "top" ||
    raw === "bottom" ||
    raw === "top-left" ||
    raw === "top-right" ||
    raw === "bottom-left" ||
    raw === "bottom-right"
  ) {
    return raw;
  }
  return "bottom";
}

function asToastStyle(
  value: FormDataEntryValue | null | undefined | string,
): ToastStyle {
  const raw = String(value || "solid");
  if (raw === "soft" || raw === "outline" || raw === "minimal" || raw === "solid") {
    return raw;
  }
  return "solid";
}

function asRecsAnimation(
  value: FormDataEntryValue | null | undefined | string,
): RecsAnimation {
  const raw = String(value || "stagger");
  if (raw === "fade" || raw === "slide" || raw === "none" || raw === "stagger") {
    return raw;
  }
  return "stagger";
}

function asRewardAnimation(
  value: FormDataEntryValue | null | undefined | string,
): RewardAnimation {
  const raw = String(value || "smooth");
  if (
    raw === "pulse" ||
    raw === "glow" ||
    raw === "bounce" ||
    raw === "none" ||
    raw === "smooth"
  ) {
    return raw;
  }
  return "smooth";
}

function asRewardBarLayout(
  value: FormDataEntryValue | null | undefined | string,
): RewardBarLayout {
  const raw = String(value || "stacked");
  if (raw === "middle" || raw === "stacked") return raw;
  return "stacked";
}

function asRewardBarStyle(
  value: FormDataEntryValue | null | undefined | string,
): RewardBarStyle {
  const raw = String(value || "gradient");
  if (raw === "solid" || raw === "striped" || raw === "gradient") return raw;
  return "gradient";
}

function asRewardMessagePosition(
  value: FormDataEntryValue | null | undefined | string,
): RewardMessagePosition {
  const raw = String(value || "below");
  if (raw === "above" || raw === "below") return raw;
  return "below";
}

function normalizeRecommendationProducts(
  input: unknown,
): RecommendationProduct[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((row) => {
      const p = (row || {}) as Partial<RecommendationProduct>;
      const handle = String(p.handle || "")
        .trim()
        .replace(/^\/+|\/+$/g, "")
        .replace(/^products\//i, "");
      if (!handle) return null;
      return {
        handle,
        title: String(p.title || handle),
        url: String(p.url || `/products/${handle}`),
        image: String(p.image || ""),
        variantId: String(p.variantId || ""),
      };
    })
    .filter((p): p is RecommendationProduct => Boolean(p))
    .slice(0, 12);
}

/** Default palette for “Reset reward colors”. */
export const DEFAULT_REWARD_COLORS = {
  rewardUseThemeColors: false,
  rewardBg: "#F0F2FF",
  rewardFg: "#B3009F",
  rewardIconColor: "#111111",
  rewardTextColor: "#111111",
} as const;

export function parseBarConfig(raw: string | null | undefined): BarConfig {
  if (!raw) {
    return {
      ...DEFAULT_BAR_CONFIG,
      rewardTiers: DEFAULT_BAR_CONFIG.rewardTiers.map((t) => ({ ...t })),
      featureTemplates: createDefaultFeatureTemplates(),
      recommendationsProducts: [],
    };
  }
  try {
    const parsed = JSON.parse(raw) as Partial<BarConfig> & {
      freeShippingEnabled?: boolean;
      freeShippingThreshold?: number;
      freeShippingText?: string;
      freeShippingReachedText?: string;
    };
    const merged: BarConfig = {
      ...DEFAULT_BAR_CONFIG,
      ...parsed,
      rewardTiers: normalizeRewardTiers(parsed.rewardTiers),
      recommendationsProducts: normalizeRecommendationProducts(
        parsed.recommendationsProducts,
      ),
      recommendationsSource: asRecommendationSource(
        parsed.recommendationsSource,
      ),
      drawerAnimation: asDrawerAnimation(parsed.drawerAnimation),
      toastPlacement: asToastPlacement(parsed.toastPlacement),
      toastPosition: asToastPosition(parsed.toastPosition),
      toastStyle: asToastStyle(parsed.toastStyle),
      toastRadius: Math.min(
        32,
        Math.max(
          0,
          Math.round(
            Number(parsed.toastRadius ?? DEFAULT_BAR_CONFIG.toastRadius) ||
              DEFAULT_BAR_CONFIG.toastRadius,
          ),
        ),
      ),
      toastFontSize: Math.min(
        20,
        Math.max(
          11,
          Math.round(
            Number(parsed.toastFontSize ?? DEFAULT_BAR_CONFIG.toastFontSize) ||
              DEFAULT_BAR_CONFIG.toastFontSize,
          ),
        ),
      ),
      toastSuccessBg: asString(
        parsed.toastSuccessBg,
        DEFAULT_BAR_CONFIG.toastSuccessBg,
      ),
      toastSuccessText: asString(
        parsed.toastSuccessText,
        DEFAULT_BAR_CONFIG.toastSuccessText,
      ),
      toastErrorBg: asString(
        parsed.toastErrorBg,
        DEFAULT_BAR_CONFIG.toastErrorBg,
      ),
      toastErrorText: asString(
        parsed.toastErrorText,
        DEFAULT_BAR_CONFIG.toastErrorText,
      ),
      toastShowSuccess:
        parsed.toastShowSuccess === undefined
          ? DEFAULT_BAR_CONFIG.toastShowSuccess
          : Boolean(parsed.toastShowSuccess),
      toastShowError:
        parsed.toastShowError === undefined
          ? DEFAULT_BAR_CONFIG.toastShowError
          : Boolean(parsed.toastShowError),
      toastShowRemove:
        parsed.toastShowRemove === undefined
          ? DEFAULT_BAR_CONFIG.toastShowRemove
          : Boolean(parsed.toastShowRemove),
      toastShowUpdate:
        parsed.toastShowUpdate === undefined
          ? DEFAULT_BAR_CONFIG.toastShowUpdate
          : Boolean(parsed.toastShowUpdate),
      recommendationsAnimation: asRecsAnimation(
        parsed.recommendationsAnimation,
      ),
      rewardAnimation: asRewardAnimation(parsed.rewardAnimation),
      rewardBarLayout: asRewardBarLayout(parsed.rewardBarLayout),
      rewardBarStyle: asRewardBarStyle(parsed.rewardBarStyle),
      rewardMessagePosition: asRewardMessagePosition(
        parsed.rewardMessagePosition,
      ),
      rewardShowIcons:
        parsed.rewardShowIcons === undefined
          ? DEFAULT_BAR_CONFIG.rewardShowIcons
          : Boolean(parsed.rewardShowIcons),
      rewardIconStyle: asRewardIconStyle(parsed.rewardIconStyle),
      rewardIconPosition: asRewardIconPosition(parsed.rewardIconPosition),
      rewardIconSize: Math.min(
        48,
        Math.max(
          14,
          Math.round(
            Number(parsed.rewardIconSize ?? DEFAULT_BAR_CONFIG.rewardIconSize) ||
              DEFAULT_BAR_CONFIG.rewardIconSize,
          ),
        ),
      ),
      customCss: String(parsed.customCss || "").slice(0, 24_000),
      featureTemplates: normalizeFeatureTemplates(parsed.featureTemplates),
    };
    // Migrate older single free-shipping setting into tiered rewards
    if (
      parsed.rewardEnabled === undefined &&
      parsed.freeShippingEnabled &&
      (!parsed.rewardTiers || !Array.isArray(parsed.rewardTiers))
    ) {
      merged.rewardEnabled = true;
      merged.rewardCompleteText =
        parsed.freeShippingReachedText || merged.rewardCompleteText;
      merged.rewardTiers = [
        {
          ...DEFAULT_BAR_CONFIG.rewardTiers[0],
          enabled: true,
          minAmount: Number(parsed.freeShippingThreshold) || 100,
          description: "Free Shipping",
          titleBefore:
            parsed.freeShippingText?.replace(
              /\{\{\s*amount_remaining\s*\}\}/gi,
              "[AMOUNT]",
            ) || "You're [AMOUNT] away from free shipping!",
          rewardType: "shipping",
        },
        ...DEFAULT_BAR_CONFIG.rewardTiers.slice(1).map((t) => ({ ...t })),
      ];
    }
    return merged;
  } catch {
    return {
      ...DEFAULT_BAR_CONFIG,
      rewardTiers: DEFAULT_BAR_CONFIG.rewardTiers.map((t) => ({ ...t })),
      featureTemplates: createDefaultFeatureTemplates(),
      recommendationsProducts: [],
    };
  }
}

export function barConfigFromFormData(formData: FormData): BarConfig {
  const afterAddRaw = String(formData.get("afterAdd") || "stay");
  const afterAdd: AfterAddBehavior =
    afterAddRaw === "cart" || afterAddRaw === "drawer" ? afterAddRaw : "stay";

  // Bool fallbacks match DEFAULT_BAR_CONFIG so a partial FormData cannot
  // silently flip features off when a key is omitted.
  return {
    enabled: asBool(formData.get("enabled"), DEFAULT_BAR_CONFIG.enabled),
    displayMode: asDisplayMode(formData.get("displayMode")),
    showImage: asBool(formData.get("showImage"), DEFAULT_BAR_CONFIG.showImage),
    showTitle: asBool(formData.get("showTitle"), DEFAULT_BAR_CONFIG.showTitle),
    showPrice: asBool(formData.get("showPrice"), DEFAULT_BAR_CONFIG.showPrice),
    showQuantity: asBool(
      formData.get("showQuantity"),
      DEFAULT_BAR_CONFIG.showQuantity,
    ),
    showMobile: asBool(formData.get("showMobile"), DEFAULT_BAR_CONFIG.showMobile),
    showDesktop: asBool(
      formData.get("showDesktop"),
      DEFAULT_BAR_CONFIG.showDesktop,
    ),
    showOnProduct: asBool(
      formData.get("showOnProduct"),
      DEFAULT_BAR_CONFIG.showOnProduct,
    ),
    showOnCollection: asBool(
      formData.get("showOnCollection"),
      DEFAULT_BAR_CONFIG.showOnCollection,
    ),
    showOnHome: asBool(formData.get("showOnHome"), DEFAULT_BAR_CONFIG.showOnHome),
    showOnSearch: asBool(
      formData.get("showOnSearch"),
      DEFAULT_BAR_CONFIG.showOnSearch,
    ),
    showOnOther: asBool(
      formData.get("showOnOther"),
      DEFAULT_BAR_CONFIG.showOnOther,
    ),
    hideNearForm: asBool(
      formData.get("hideNearForm"),
      DEFAULT_BAR_CONFIG.hideNearForm,
    ),
    buttonText: asString(formData.get("buttonText"), DEFAULT_BAR_CONFIG.buttonText),
    soldOutText: asString(formData.get("soldOutText"), DEFAULT_BAR_CONFIG.soldOutText),
    afterAdd,
    backgroundStyle: asBackgroundStyle(formData.get("backgroundStyle")),
    backgroundOpacity: asNumber(
      formData.get("backgroundOpacity"),
      DEFAULT_BAR_CONFIG.backgroundOpacity,
    ),
    imageShape: asImageShape(formData.get("imageShape")),
    layout: asLayout(formData.get("layout")),
    buttonSize: asButtonSize(formData.get("buttonSize")),
    barPosition: asBarPosition(formData.get("barPosition")),
    contentGap: asNumber(formData.get("contentGap"), DEFAULT_BAR_CONFIG.contentGap),
    showShadow: asBool(formData.get("showShadow"), DEFAULT_BAR_CONFIG.showShadow),
    borderWidth: asNumber(formData.get("borderWidth"), DEFAULT_BAR_CONFIG.borderWidth),
    borderColor: asString(formData.get("borderColor"), DEFAULT_BAR_CONFIG.borderColor),
    barRadius: asNumber(formData.get("barRadius"), DEFAULT_BAR_CONFIG.barRadius),
    buttonRadius: asNumber(formData.get("buttonRadius"), DEFAULT_BAR_CONFIG.buttonRadius),
    imageRadius: asNumber(formData.get("imageRadius"), DEFAULT_BAR_CONFIG.imageRadius),
    paddingY: asNumber(formData.get("paddingY"), DEFAULT_BAR_CONFIG.paddingY),
    paddingX: asNumber(formData.get("paddingX"), DEFAULT_BAR_CONFIG.paddingX),
    imageSize: asNumber(formData.get("imageSize"), DEFAULT_BAR_CONFIG.imageSize),
    titleFontSize: asNumber(formData.get("titleFontSize"), DEFAULT_BAR_CONFIG.titleFontSize),
    priceFontSize: asNumber(formData.get("priceFontSize"), DEFAULT_BAR_CONFIG.priceFontSize),
    buttonFontSize: asNumber(
      formData.get("buttonFontSize"),
      DEFAULT_BAR_CONFIG.buttonFontSize,
    ),
    desktopMaxWidth: asNumber(
      formData.get("desktopMaxWidth"),
      DEFAULT_BAR_CONFIG.desktopMaxWidth,
    ),
    desktopBottomOffset: asNumber(
      formData.get("desktopBottomOffset"),
      DEFAULT_BAR_CONFIG.desktopBottomOffset,
    ),
    showAfterScroll: asNumber(
      formData.get("showAfterScroll"),
      DEFAULT_BAR_CONFIG.showAfterScroll,
    ),
    showAfterScrollDesktop: asNumber(
      formData.get("showAfterScrollDesktop"),
      DEFAULT_BAR_CONFIG.showAfterScrollDesktop,
    ),
    backgroundColor: asString(
      formData.get("backgroundColor"),
      DEFAULT_BAR_CONFIG.backgroundColor,
    ),
    textColor: asString(formData.get("textColor"), DEFAULT_BAR_CONFIG.textColor),
    inheritThemeFont: asBool(
      formData.get("inheritThemeFont"),
      DEFAULT_BAR_CONFIG.inheritThemeFont,
    ),
    inheritThemeTextColor: asBool(
      formData.get("inheritThemeTextColor"),
      DEFAULT_BAR_CONFIG.inheritThemeTextColor,
    ),
    buttonBackground: asString(
      formData.get("buttonBackground"),
      DEFAULT_BAR_CONFIG.buttonBackground,
    ),
    buttonTextColor: asString(
      formData.get("buttonTextColor"),
      DEFAULT_BAR_CONFIG.buttonTextColor,
    ),
    accentColor: asString(formData.get("accentColor"), DEFAULT_BAR_CONFIG.accentColor),
    drawerTitle: asString(formData.get("drawerTitle"), DEFAULT_BAR_CONFIG.drawerTitle),
    drawerCheckoutText: asString(
      formData.get("drawerCheckoutText"),
      DEFAULT_BAR_CONFIG.drawerCheckoutText,
    ),
    drawerHeaderHeight:
      String(formData.get("drawerHeaderHeight") || "") === "tall" ? "tall" : "slim",
    drawerHeaderBorder:
      String(formData.get("drawerHeaderBorder") || "") === "thin" ? "thin" : "none",
    drawerHeaderBg: asString(
      formData.get("drawerHeaderBg"),
      DEFAULT_BAR_CONFIG.drawerHeaderBg,
    ),
    drawerTitleAlign:
      String(formData.get("drawerTitleAlign") || "") === "center" ? "center" : "left",
    drawerTitleWeight: (() => {
      const w = String(formData.get("drawerTitleWeight") || "bold");
      if (w === "normal" || w === "semibold" || w === "bold") return w;
      return "bold";
    })(),
    drawerTitleSize: asNumber(
      formData.get("drawerTitleSize"),
      DEFAULT_BAR_CONFIG.drawerTitleSize,
    ),
    drawerCloseSide:
      String(formData.get("drawerCloseSide") || "") === "left" ? "left" : "right",
    drawerCloseBg: asString(
      formData.get("drawerCloseBg"),
      DEFAULT_BAR_CONFIG.drawerCloseBg,
    ),
    drawerCloseHoverBg: asString(
      formData.get("drawerCloseHoverBg"),
      DEFAULT_BAR_CONFIG.drawerCloseHoverBg,
    ),
    drawerCloseColor: asString(
      formData.get("drawerCloseColor"),
      DEFAULT_BAR_CONFIG.drawerCloseColor,
    ),
    drawerCloseIconSize: (() => {
      const s = String(formData.get("drawerCloseIconSize") || "medium");
      if (s === "small" || s === "medium" || s === "large") return s;
      return "medium";
    })(),
    drawerCloseBorder: (() => {
      const b = String(formData.get("drawerCloseBorder") || "none");
      if (b === "none" || b === "thin" || b === "normal" || b === "thick") return b;
      return "none";
    })(),
    drawerBackdropBlur: asBool(
      formData.get("drawerBackdropBlur"),
      DEFAULT_BAR_CONFIG.drawerBackdropBlur,
    ),
    drawerBackdropOpacity: Math.min(
      100,
      Math.max(
        0,
        asNumber(
          formData.get("drawerBackdropOpacity"),
          DEFAULT_BAR_CONFIG.drawerBackdropOpacity,
        ),
      ),
    ),
    cartLineQtyEnabled: asBool(
      formData.get("cartLineQtyEnabled"),
      DEFAULT_BAR_CONFIG.cartLineQtyEnabled,
    ),
    cartLineRemoveEnabled: asBool(
      formData.get("cartLineRemoveEnabled"),
      DEFAULT_BAR_CONFIG.cartLineRemoveEnabled,
    ),
    cartLineShowImage: asBool(
      formData.get("cartLineShowImage"),
      DEFAULT_BAR_CONFIG.cartLineShowImage,
    ),
    cartLineImageSize: Math.min(
      120,
      Math.max(
        32,
        asNumber(
          formData.get("cartLineImageSize"),
          DEFAULT_BAR_CONFIG.cartLineImageSize,
        ),
      ),
    ),
    cartLineImageRadius: Math.min(
      40,
      Math.max(
        0,
        asNumber(
          formData.get("cartLineImageRadius"),
          DEFAULT_BAR_CONFIG.cartLineImageRadius,
        ),
      ),
    ),
    cartLineShowTitle: asBool(
      formData.get("cartLineShowTitle"),
      DEFAULT_BAR_CONFIG.cartLineShowTitle,
    ),
    cartLineTitleSize: Math.min(
      22,
      Math.max(
        10,
        asNumber(
          formData.get("cartLineTitleSize"),
          DEFAULT_BAR_CONFIG.cartLineTitleSize,
        ),
      ),
    ),
    cartLineShowPrice: asBool(
      formData.get("cartLineShowPrice"),
      DEFAULT_BAR_CONFIG.cartLineShowPrice,
    ),
    cartLinePriceSize: Math.min(
      22,
      Math.max(
        10,
        asNumber(
          formData.get("cartLinePriceSize"),
          DEFAULT_BAR_CONFIG.cartLinePriceSize,
        ),
      ),
    ),
    cartLineShowVariant: asBool(
      formData.get("cartLineShowVariant"),
      DEFAULT_BAR_CONFIG.cartLineShowVariant,
    ),
    cartLineGap: Math.min(
      28,
      Math.max(
        4,
        asNumber(formData.get("cartLineGap"), DEFAULT_BAR_CONFIG.cartLineGap),
      ),
    ),
    cartLineQtyStyle: (() => {
      const raw = String(formData.get("cartLineQtyStyle") || "");
      return raw === "plain" ? "plain" : "stepper";
    })(),
    cartLineQtySize: (() => {
      const raw = String(formData.get("cartLineQtySize") || "");
      if (raw === "small" || raw === "large") return raw;
      return "medium";
    })(),
    cartLineRemoveStyle: (() => {
      const raw = String(formData.get("cartLineRemoveStyle") || "");
      if (raw === "delete" || raw === "remove" || raw === "trash") return raw;
      return "x";
    })(),
    cartLineRemoveSize: (() => {
      const raw = String(formData.get("cartLineRemoveSize") || "");
      if (raw === "small" || raw === "large") return raw;
      return "medium";
    })(),
    cartLineBg: asString(
      formData.get("cartLineBg"),
      DEFAULT_BAR_CONFIG.cartLineBg,
    ),
    cartLineTextColor: asString(
      formData.get("cartLineTextColor"),
      DEFAULT_BAR_CONFIG.cartLineTextColor,
    ),
    cartLineBorderColor: asString(
      formData.get("cartLineBorderColor"),
      DEFAULT_BAR_CONFIG.cartLineBorderColor,
    ),
    cartLineQtyBg: asString(
      formData.get("cartLineQtyBg"),
      DEFAULT_BAR_CONFIG.cartLineQtyBg,
    ),
    cartLineQtyText: asString(
      formData.get("cartLineQtyText"),
      DEFAULT_BAR_CONFIG.cartLineQtyText,
    ),
    cartLineRemoveColor: asString(
      formData.get("cartLineRemoveColor"),
      DEFAULT_BAR_CONFIG.cartLineRemoveColor,
    ),
    drawerShowOnProduct: asBool(
      formData.get("drawerShowOnProduct"),
      DEFAULT_BAR_CONFIG.drawerShowOnProduct,
    ),
    drawerShowOnCollection: asBool(
      formData.get("drawerShowOnCollection"),
      DEFAULT_BAR_CONFIG.drawerShowOnCollection,
    ),
    drawerShowOnHome: asBool(
      formData.get("drawerShowOnHome"),
      DEFAULT_BAR_CONFIG.drawerShowOnHome,
    ),
    drawerShowOnSearch: asBool(
      formData.get("drawerShowOnSearch"),
      DEFAULT_BAR_CONFIG.drawerShowOnSearch,
    ),
    drawerShowOnOther: asBool(
      formData.get("drawerShowOnOther"),
      DEFAULT_BAR_CONFIG.drawerShowOnOther,
    ),
    drawerShowDesktop: asBool(
      formData.get("drawerShowDesktop"),
      DEFAULT_BAR_CONFIG.drawerShowDesktop,
    ),
    drawerShowMobile: asBool(
      formData.get("drawerShowMobile"),
      DEFAULT_BAR_CONFIG.drawerShowMobile,
    ),
    announcementEnabled: asBool(
      formData.get("announcementEnabled"),
      DEFAULT_BAR_CONFIG.announcementEnabled,
    ),
    announcementText: asString(
      formData.get("announcementText"),
      DEFAULT_BAR_CONFIG.announcementText,
    ),
    announcementBg: asString(
      formData.get("announcementBg"),
      DEFAULT_BAR_CONFIG.announcementBg,
    ),
    announcementTextColor: asString(
      formData.get("announcementTextColor"),
      DEFAULT_BAR_CONFIG.announcementTextColor,
    ),
    announcementBorderColor: asString(
      formData.get("announcementBorderColor"),
      DEFAULT_BAR_CONFIG.announcementBorderColor,
    ),
    announcementHeight: (() => {
      const h = String(formData.get("announcementHeight") || "normal");
      if (h === "slim" || h === "normal" || h === "thick") return h;
      return "normal";
    })(),
    announcementPosition:
      String(formData.get("announcementPosition") || "") === "after"
        ? "after"
        : "before",
    announcementTimer: (() => {
      const raw = String(formData.get("announcementTimer") || "15:00").trim();
      return /^\d{1,2}:\d{2}$/.test(raw) ? raw : DEFAULT_BAR_CONFIG.announcementTimer;
    })(),
    announcementFontSize: asNumber(
      formData.get("announcementFontSize"),
      DEFAULT_BAR_CONFIG.announcementFontSize,
    ),
    freeShippingEnabled: asBool(
      formData.get("freeShippingEnabled"),
      DEFAULT_BAR_CONFIG.freeShippingEnabled,
    ),
    freeShippingThreshold: asNumber(
      formData.get("freeShippingThreshold"),
      DEFAULT_BAR_CONFIG.freeShippingThreshold,
    ),
    freeShippingText: asString(
      formData.get("freeShippingText"),
      DEFAULT_BAR_CONFIG.freeShippingText,
    ),
    freeShippingReachedText: asString(
      formData.get("freeShippingReachedText"),
      DEFAULT_BAR_CONFIG.freeShippingReachedText,
    ),
    rewardEnabled: asBool(
      formData.get("rewardEnabled"),
      DEFAULT_BAR_CONFIG.rewardEnabled,
    ),
    rewardShowOnEmpty: asBool(
      formData.get("rewardShowOnEmpty"),
      DEFAULT_BAR_CONFIG.rewardShowOnEmpty,
    ),
    rewardUseThemeColors: asBool(
      formData.get("rewardUseThemeColors"),
      DEFAULT_BAR_CONFIG.rewardUseThemeColors,
    ),
    rewardBg: asString(formData.get("rewardBg"), DEFAULT_BAR_CONFIG.rewardBg),
    rewardFg: asString(formData.get("rewardFg"), DEFAULT_BAR_CONFIG.rewardFg),
    rewardIconColor: asString(
      formData.get("rewardIconColor"),
      DEFAULT_BAR_CONFIG.rewardIconColor,
    ),
    rewardTextColor: asString(
      formData.get("rewardTextColor"),
      DEFAULT_BAR_CONFIG.rewardTextColor,
    ),
    rewardCompleteText: asString(
      formData.get("rewardCompleteText"),
      DEFAULT_BAR_CONFIG.rewardCompleteText,
    ),
    rewardCalcMode:
      String(formData.get("rewardCalcMode") || "") === "quantity"
        ? "quantity"
        : "total",
    rewardTiers: (() => {
      try {
        return normalizeRewardTiers(
          JSON.parse(String(formData.get("rewardTiers") || "[]")),
        );
      } catch {
        return DEFAULT_BAR_CONFIG.rewardTiers.map((t) => ({ ...t }));
      }
    })(),
    recommendationsEnabled: asBool(
      formData.get("recommendationsEnabled"),
      DEFAULT_BAR_CONFIG.recommendationsEnabled,
    ),
    recommendationsEmptyText: asString(
      formData.get("recommendationsEmptyText"),
      DEFAULT_BAR_CONFIG.recommendationsEmptyText,
    ),
    recommendationsHeader: asString(
      formData.get("recommendationsHeader"),
      DEFAULT_BAR_CONFIG.recommendationsHeader,
    ),
    recommendationsMax: Math.min(
      8,
      Math.max(
        1,
        asNumber(
          formData.get("recommendationsMax"),
          DEFAULT_BAR_CONFIG.recommendationsMax,
        ),
      ),
    ),
    recommendationsAddText: asString(
      formData.get("recommendationsAddText"),
      DEFAULT_BAR_CONFIG.recommendationsAddText,
    ),
    recommendationsShopNowEnabled: asBool(
      formData.get("recommendationsShopNowEnabled"),
      DEFAULT_BAR_CONFIG.recommendationsShopNowEnabled,
    ),
    recommendationsShopNowText: asString(
      formData.get("recommendationsShopNowText"),
      DEFAULT_BAR_CONFIG.recommendationsShopNowText,
    ),
    recommendationsShopNowUrl: asString(
      formData.get("recommendationsShopNowUrl"),
      DEFAULT_BAR_CONFIG.recommendationsShopNowUrl,
    ),
    recommendationsCollection: asString(
      formData.get("recommendationsCollection"),
      DEFAULT_BAR_CONFIG.recommendationsCollection,
    )
      .replace(/^\/+|\/+$/g, "")
      .replace(/^collections\//i, "") || "all",
    recommendationsShowWithItems: asBool(
      formData.get("recommendationsShowWithItems"),
      DEFAULT_BAR_CONFIG.recommendationsShowWithItems,
    ),
    recommendationsHideInCart: asBool(
      formData.get("recommendationsHideInCart"),
      DEFAULT_BAR_CONFIG.recommendationsHideInCart,
    ),
    recommendationsSource: asRecommendationSource(
      formData.get("recommendationsSource"),
    ),
    recommendationsProducts: (() => {
      try {
        return normalizeRecommendationProducts(
          JSON.parse(String(formData.get("recommendationsProducts") || "[]")),
        );
      } catch {
        return [];
      }
    })(),
    drawerAnimation: asDrawerAnimation(formData.get("drawerAnimation")),
    toastPlacement: asToastPlacement(formData.get("toastPlacement")),
    toastPosition: asToastPosition(formData.get("toastPosition")),
    toastStyle: asToastStyle(formData.get("toastStyle")),
    toastRadius: Math.min(
      32,
      Math.max(
        0,
        Math.round(
          Number(formData.get("toastRadius")) ||
            DEFAULT_BAR_CONFIG.toastRadius,
        ),
      ),
    ),
    toastFontSize: Math.min(
      20,
      Math.max(
        11,
        Math.round(
          Number(formData.get("toastFontSize")) ||
            DEFAULT_BAR_CONFIG.toastFontSize,
        ),
      ),
    ),
    toastSuccessBg: asString(
      formData.get("toastSuccessBg"),
      DEFAULT_BAR_CONFIG.toastSuccessBg,
    ),
    toastSuccessText: asString(
      formData.get("toastSuccessText"),
      DEFAULT_BAR_CONFIG.toastSuccessText,
    ),
    toastErrorBg: asString(
      formData.get("toastErrorBg"),
      DEFAULT_BAR_CONFIG.toastErrorBg,
    ),
    toastErrorText: asString(
      formData.get("toastErrorText"),
      DEFAULT_BAR_CONFIG.toastErrorText,
    ),
    toastShowSuccess: asBool(
      formData.get("toastShowSuccess"),
      DEFAULT_BAR_CONFIG.toastShowSuccess,
    ),
    toastShowError: asBool(
      formData.get("toastShowError"),
      DEFAULT_BAR_CONFIG.toastShowError,
    ),
    toastShowRemove: asBool(
      formData.get("toastShowRemove"),
      DEFAULT_BAR_CONFIG.toastShowRemove,
    ),
    toastShowUpdate: asBool(
      formData.get("toastShowUpdate"),
      DEFAULT_BAR_CONFIG.toastShowUpdate,
    ),
    recommendationsAnimation: asRecsAnimation(
      formData.get("recommendationsAnimation"),
    ),
    rewardAnimation: asRewardAnimation(formData.get("rewardAnimation")),
    rewardBarLayout: asRewardBarLayout(formData.get("rewardBarLayout")),
    rewardBarStyle: asRewardBarStyle(formData.get("rewardBarStyle")),
    rewardMessagePosition: asRewardMessagePosition(
      formData.get("rewardMessagePosition"),
    ),
    rewardShowIcons: asBool(
      formData.get("rewardShowIcons"),
      DEFAULT_BAR_CONFIG.rewardShowIcons,
    ),
    rewardIconStyle: asRewardIconStyle(formData.get("rewardIconStyle")),
    rewardIconPosition: asRewardIconPosition(
      formData.get("rewardIconPosition"),
    ),
    rewardIconSize: Math.min(
      48,
      Math.max(
        14,
        Math.round(
          Number(formData.get("rewardIconSize")) ||
            DEFAULT_BAR_CONFIG.rewardIconSize,
        ),
      ),
    ),
    discountEnabled: asBool(
      formData.get("discountEnabled"),
      DEFAULT_BAR_CONFIG.discountEnabled,
    ),
    discountPlaceholder: asString(
      formData.get("discountPlaceholder"),
      DEFAULT_BAR_CONFIG.discountPlaceholder,
    ),
    discountButtonText: asString(
      formData.get("discountButtonText"),
      DEFAULT_BAR_CONFIG.discountButtonText,
    ),
    trustBadgesEnabled: asBool(
      formData.get("trustBadgesEnabled"),
      DEFAULT_BAR_CONFIG.trustBadgesEnabled,
    ),
    trustBadgesText: asString(
      formData.get("trustBadgesText"),
      DEFAULT_BAR_CONFIG.trustBadgesText,
    ),
    customCss: String(formData.get("customCss") || "").slice(0, 24_000),
    featureTemplates: (() => {
      try {
        return normalizeFeatureTemplates(
          JSON.parse(String(formData.get("featureTemplates") || "{}")),
        );
      } catch {
        return createDefaultFeatureTemplates();
      }
    })(),
  };
}

/** Lightweight structural check before DB/metafield write (Zod can replace later). */
export function validateBarConfig(config: BarConfig): string[] {
  const errors: string[] = [];
  if (!config.buttonText?.trim()) errors.push("buttonText is required");
  if (!Array.isArray(config.rewardTiers) || config.rewardTiers.length === 0) {
    errors.push("rewardTiers must be a non-empty array");
  }
  if (config.recommendationsMax < 1 || config.recommendationsMax > 8) {
    errors.push("recommendationsMax must be 1–8");
  }
  if (
    config.drawerBackdropOpacity < 0 ||
    config.drawerBackdropOpacity > 100
  ) {
    errors.push("drawerBackdropOpacity must be 0–100");
  }
  return errors;
}
