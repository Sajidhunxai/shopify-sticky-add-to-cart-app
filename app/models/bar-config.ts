export type Plan = "free" | "pro";

export type AfterAddBehavior = "stay" | "cart" | "drawer";

export type BarConfig = {
  enabled: boolean;
  showImage: boolean;
  showTitle: boolean;
  showPrice: boolean;
  showMobile: boolean;
  showDesktop: boolean;
  hideNearForm: boolean;
  buttonText: string;
  soldOutText: string;
  afterAdd: AfterAddBehavior;
  showShadow: boolean;
  borderWidth: number;
  barRadius: number;
  buttonRadius: number;
  paddingY: number;
  paddingX: number;
  imageSize: number;
  titleFontSize: number;
  priceFontSize: number;
  buttonFontSize: number;
  desktopMaxWidth: number;
  desktopBottomOffset: number;
  showAfterScroll: number;
  backgroundColor: string;
  textColor: string;
  buttonBackground: string;
  buttonTextColor: string;
};

export const DEFAULT_BAR_CONFIG: BarConfig = {
  enabled: true,
  showImage: true,
  showTitle: true,
  showPrice: true,
  showMobile: true,
  showDesktop: true,
  hideNearForm: true,
  buttonText: "Add to cart",
  soldOutText: "Sold out",
  afterAdd: "stay",
  showShadow: true,
  borderWidth: 0,
  barRadius: 14,
  buttonRadius: 8,
  paddingY: 12,
  paddingX: 16,
  imageSize: 48,
  titleFontSize: 14,
  priceFontSize: 13,
  buttonFontSize: 14,
  desktopMaxWidth: 720,
  desktopBottomOffset: 20,
  showAfterScroll: 180,
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
    showImage: asBool(formData.get("showImage"), false),
    showTitle: asBool(formData.get("showTitle"), false),
    showPrice: asBool(formData.get("showPrice"), false),
    showMobile: asBool(formData.get("showMobile"), false),
    showDesktop: asBool(formData.get("showDesktop"), false),
    hideNearForm: asBool(formData.get("hideNearForm"), false),
    buttonText: asString(formData.get("buttonText"), DEFAULT_BAR_CONFIG.buttonText),
    soldOutText: asString(formData.get("soldOutText"), DEFAULT_BAR_CONFIG.soldOutText),
    afterAdd,
    showShadow: asBool(formData.get("showShadow"), false),
    borderWidth: asNumber(formData.get("borderWidth"), DEFAULT_BAR_CONFIG.borderWidth),
    barRadius: asNumber(formData.get("barRadius"), DEFAULT_BAR_CONFIG.barRadius),
    buttonRadius: asNumber(formData.get("buttonRadius"), DEFAULT_BAR_CONFIG.buttonRadius),
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
