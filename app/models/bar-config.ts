export type Plan = "free" | "pro";

export type AfterAddBehavior = "stay" | "cart" | "drawer";

/** How the sticky experience is presented on the storefront. */
export type DisplayMode = "bar" | "slider" | "quickbuy";

export type BackgroundStyle = "solid" | "blur" | "gradient";
export type ImageShape = "rounded" | "circle" | "square";
export type BarLayout = "row" | "compact" | "stacked";
export type ButtonSize = "normal" | "large" | "full";
export type BarPosition = "bottom" | "top";

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
  return String(value || "bottom") === "top" ? "top" : "bottom";
}

export function parseBarConfig(raw: string | null | undefined): BarConfig {
  if (!raw) return { ...DEFAULT_BAR_CONFIG };
  try {
    const parsed = JSON.parse(raw) as Partial<BarConfig>;
    return { ...DEFAULT_BAR_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_BAR_CONFIG };
  }
}

export function barConfigFromFormData(formData: FormData): BarConfig {
  const afterAddRaw = String(formData.get("afterAdd") || "stay");
  const afterAdd: AfterAddBehavior =
    afterAddRaw === "cart" || afterAddRaw === "drawer" ? afterAddRaw : "stay";

  return {
    enabled: asBool(formData.get("enabled"), false),
    displayMode: asDisplayMode(formData.get("displayMode")),
    showImage: asBool(formData.get("showImage"), false),
    showTitle: asBool(formData.get("showTitle"), false),
    showPrice: asBool(formData.get("showPrice"), false),
    showQuantity: asBool(formData.get("showQuantity"), false),
    showMobile: asBool(formData.get("showMobile"), false),
    showDesktop: asBool(formData.get("showDesktop"), false),
    showOnProduct: asBool(formData.get("showOnProduct"), false),
    showOnCollection: asBool(formData.get("showOnCollection"), false),
    showOnHome: asBool(formData.get("showOnHome"), false),
    showOnSearch: asBool(formData.get("showOnSearch"), false),
    showOnOther: asBool(formData.get("showOnOther"), false),
    hideNearForm: asBool(formData.get("hideNearForm"), false),
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
    showShadow: asBool(formData.get("showShadow"), false),
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
  };
}
