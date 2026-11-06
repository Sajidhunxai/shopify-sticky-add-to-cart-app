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

export type RewardTier = {
  enabled: boolean;
  minAmount: number;
  description: string;
  /** Supports [AMOUNT] for remaining amount/qty */
  titleBefore: string;
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
  /** Show remove (×) on drawer cart lines */
  cartLineRemoveEnabled: boolean;
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
  rewardBg: string;
  rewardFg: string;
  rewardIconColor: string;
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
  /** Collection handle for empty-cart products (e.g. all, bestsellers) */
  recommendationsCollection: string;
  discountEnabled: boolean;
  discountPlaceholder: string;
  discountButtonText: string;
  trustBadgesEnabled: boolean;
  trustBadgesText: string;
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
  rewardBg: "#F0F2FF",
  rewardFg: "#B3009F",
  rewardIconColor: "#79be30",
  rewardCompleteText: "Free shipping unlocked!",
  rewardCalcMode: "total",
  rewardTiers: [
    {
      enabled: true,
      minAmount: 100,
      description: "Free Shipping",
      titleBefore: "You're [AMOUNT] away from free shipping!",
    },
    {
      enabled: true,
      minAmount: 150,
      description: "Free Express",
      titleBefore: "You're [AMOUNT] away from free express shipping!",
    },
    {
      enabled: false,
      minAmount: 200,
      description: "Free Gift",
      titleBefore: "You're [AMOUNT] away from a free gift!",
    },
    {
      enabled: false,
      minAmount: 250,
      description: "VIP Reward",
      titleBefore: "You're [AMOUNT] away from VIP reward!",
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
  discountEnabled: false,
  discountPlaceholder: "Discount code",
  discountButtonText: "Apply",
  trustBadgesEnabled: false,
  trustBadgesText: "Secure checkout · Free returns · 24/7 support",
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

function normalizeRewardTiers(input: unknown): RewardTier[] {
  const defaults = DEFAULT_BAR_CONFIG.rewardTiers;
  if (!Array.isArray(input) || input.length === 0) return defaults.map((t) => ({ ...t }));
  return defaults.map((fallback, index) => {
    const row = (input[index] || {}) as Partial<RewardTier>;
    return {
      enabled: Boolean(row.enabled ?? fallback.enabled),
      minAmount: Number.isFinite(Number(row.minAmount))
        ? Number(row.minAmount)
        : fallback.minAmount,
      description: String(row.description || fallback.description),
      titleBefore: String(row.titleBefore || fallback.titleBefore),
    };
  });
}

export function parseBarConfig(raw: string | null | undefined): BarConfig {
  if (!raw) return { ...DEFAULT_BAR_CONFIG, rewardTiers: DEFAULT_BAR_CONFIG.rewardTiers.map((t) => ({ ...t })) };
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
          enabled: true,
          minAmount: Number(parsed.freeShippingThreshold) || 100,
          description: "Free Shipping",
          titleBefore:
            parsed.freeShippingText?.replace(
              /\{\{\s*amount_remaining\s*\}\}/gi,
              "[AMOUNT]",
            ) || "You're [AMOUNT] away from free shipping!",
        },
        ...DEFAULT_BAR_CONFIG.rewardTiers.slice(1).map((t) => ({ ...t })),
      ];
    }
    return merged;
  } catch {
    return {
      ...DEFAULT_BAR_CONFIG,
      rewardTiers: DEFAULT_BAR_CONFIG.rewardTiers.map((t) => ({ ...t })),
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
    rewardBg: asString(formData.get("rewardBg"), DEFAULT_BAR_CONFIG.rewardBg),
    rewardFg: asString(formData.get("rewardFg"), DEFAULT_BAR_CONFIG.rewardFg),
    rewardIconColor: asString(
      formData.get("rewardIconColor"),
      DEFAULT_BAR_CONFIG.rewardIconColor,
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
