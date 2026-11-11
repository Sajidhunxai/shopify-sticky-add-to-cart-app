import type { CSSProperties, ReactNode } from "react";
import styles from "../../styles/dashboard.module.css";
import type { BarConfig } from "../../models/bar-config";
import {
  activeRewardTiers,
  rewardMessage,
  rewardProgressPct,
} from "../preview/reward-progress";
import { renderRewardsCustomPreview } from "../preview/reward-template";

function mixHexWithWhite(hex: string, whiteRatio = 0.82): string {
  const raw = String(hex || "#111111").replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw.padEnd(6, "0").slice(0, 6);
  const n = Number.parseInt(full, 16);
  if (!Number.isFinite(n)) return "#f3f4f6";
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (c: number) => Math.round(c * (1 - whiteRatio) + 255 * whiteRatio);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function PreviewRewardIcon({
  name,
  color,
}: {
  name: string;
  color: string;
}) {
  const stroke = color;
  const common = {
    width: 12,
    height: 12,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };
  if (name === "check") {
    return (
      <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
        <path
          fill={stroke}
          d="M6.2 11.4 2.8 8l1.2-1.2 2.2 2.2 5-5L12.4 5.2z"
        />
      </svg>
    );
  }
  if (name === "truck") {
    return (
      <svg {...common}>
        <path
          fill={stroke}
          d="M3 7h11v8H3V7zm12 2h3.2L21 12.5V15h-6V9zM6.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
        />
      </svg>
    );
  }
  if (name === "gift") {
    return (
      <svg {...common}>
        <path
          fill={stroke}
          d="M20 7h-2.26A3.5 3.5 0 0 0 12 3.05 3.5 3.5 0 0 0 6.26 7H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1ZM9.5 5.5a1.5 1.5 0 1 1 0 3H8.26a1.5 1.5 0 0 1 1.24-3Zm5 0a1.5 1.5 0 0 1 1.24 3H14.5a1.5 1.5 0 1 1 0-3ZM6 19v-7h5v7H6Zm12 0h-5v-7h5v7Z"
        />
      </svg>
    );
  }
  if (name === "percent") {
    return (
      <svg {...common}>
        <path
          fill={stroke}
          d="M7.5 6.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM8 17.5 16.5 6.5l1.1 1.1L9.1 18.6 8 17.5z"
        />
      </svg>
    );
  }
  if (name === "star") {
    return (
      <svg {...common}>
        <path
          fill={stroke}
          d="m12 2.8 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8l5-.7L12 2.8z"
        />
      </svg>
    );
  }
  if (name === "heart") {
    return (
      <svg {...common}>
        <path
          fill={stroke}
          d="M12 21s-6.7-4.2-9.2-8.1C1.1 10.2 2 7 5 6.2c1.8-.5 3.5.3 4.5 1.6C10.5 6.5 12.2 5.7 14 6.2c3 .8 3.9 4 2.2 6.7C18.7 16.8 12 21 12 21z"
        />
      </svg>
    );
  }
  if (name === "lock") {
    return (
      <svg {...common}>
        <path
          fill={stroke}
          d="M7 10V8a5 5 0 0 1 10 0v2h1.5A1.5 1.5 0 0 1 20 11.5v8A1.5 1.5 0 0 1 18.5 21h-13A1.5 1.5 0 0 1 4 19.5v-8A1.5 1.5 0 0 1 5.5 10H7zm2 0h6V8a3 3 0 0 0-6 0v2z"
        />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="4" fill={stroke} />
    </svg>
  );
}

function previewPositionStyle(
  position: BarConfig["barPosition"],
  edge: number,
): CSSProperties {
  const offset = Math.max(8, edge || 12);
  const floating: CSSProperties = {
    width: "max-content",
    maxWidth: "calc(100% - 24px)",
    left: "auto",
    right: "auto",
  };

  switch (position) {
    case "top":
      return { top: offset, bottom: "auto", left: 12, right: 12 };
    case "top-left":
      return { ...floating, top: offset, bottom: "auto", left: offset };
    case "top-right":
      return { ...floating, top: offset, bottom: "auto", right: offset };
    case "bottom-left":
      return { ...floating, bottom: offset, left: offset };
    case "bottom-right":
      return { ...floating, bottom: offset, right: offset };
    case "left":
      return {
        ...floating,
        top: "50%",
        bottom: "auto",
        left: offset,
        transform: "translateY(-50%)",
      };
    case "right":
      return {
        ...floating,
        top: "50%",
        bottom: "auto",
        right: offset,
        transform: "translateY(-50%)",
      };
    default:
      return { bottom: offset, left: 12, right: 12 };
  }
}

function hexToRgba(hex: string, opacityPct: number) {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  if (full.length !== 6) return hex;
  const n = Number.parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${(opacityPct / 100).toFixed(2)})`;
}

export type StudioPreviewProps = {
  config: BarConfig;
  shop: string;
  hideBranding: boolean;
  showDrawerPreview: boolean;
  showEmptyPreview: boolean;
  onShowDrawerChange: (show: boolean) => void;
  onShowEmptyChange: (show: boolean) => void;
};

export function StudioPreview({
  config,
  shop,
  hideBranding,
  showDrawerPreview,
  showEmptyPreview,
  onShowDrawerChange,
  onShowEmptyChange,
}: StudioPreviewProps) {
  const previewBg =
    config.backgroundStyle === "gradient"
      ? `linear-gradient(135deg, ${hexToRgba(config.backgroundColor, config.backgroundOpacity)}, ${hexToRgba(config.backgroundColor, Math.max(40, config.backgroundOpacity - 25))})`
      : hexToRgba(config.backgroundColor, config.backgroundOpacity);

  const previewImageRadius =
    config.imageShape === "circle"
      ? "999px"
      : config.imageShape === "square"
        ? "0px"
        : `${config.imageRadius}px`;

  const previewBarStyle: CSSProperties = {
    background: previewBg,
    color: config.textColor,
    borderRadius: `${config.barRadius}px`,
    padding: `${config.paddingY}px ${config.paddingX}px`,
    border: `${config.borderWidth}px solid ${config.borderColor}`,
    boxShadow: config.showShadow ? "0 -8px 28px rgba(0,0,0,0.14)" : "none",
    gap: `${config.contentGap}px`,
    backdropFilter:
      config.backgroundStyle === "blur"
        ? "saturate(160%) blur(12px)"
        : undefined,
    WebkitBackdropFilter:
      config.backgroundStyle === "blur"
        ? "saturate(160%) blur(12px)"
        : undefined,
    flexDirection: config.layout === "stacked" ? "column" : "row",
    alignItems: config.layout === "stacked" ? "stretch" : "center",
    ...previewPositionStyle(config.barPosition, config.desktopBottomOffset),
  };

  return (
    <aside className={styles.studioPreview} aria-label="Live preview">
      <div className={styles.previewShell}>
        <div className={styles.previewChrome}>
          <span className={styles.previewDot} />
          <span className={styles.previewDot} />
          <span className={styles.previewDot} />
          <span className={styles.previewUrl}>{shop}/products/demo</span>
        </div>
        {config.displayMode === "slider" && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              padding: "8px 12px 0",
              fontSize: 12,
              color: "#4b5563",
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={showDrawerPreview}
                onChange={(e) => onShowDrawerChange(e.target.checked)}
              />
              Show drawer
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={showEmptyPreview}
                onChange={(e) => onShowEmptyChange(e.target.checked)}
              />
              Show empty cart
            </label>
          </div>
        )}
        <div
          className={`${styles.previewStage} ${
            config.displayMode === "slider" ? styles.previewStageSlider : ""
          } ${showDrawerPreview ? styles.previewStageDrawerOpen : ""}`}
        >
          <div className={styles.previewProduct}>
            <div className={styles.previewThumb} />
            <div>
              <p className={styles.previewTitle}>Classic Canvas Sneaker</p>
              <p className={styles.previewSubtitle}>
                {config.displayMode === "quickbuy"
                  ? "Quick Buy preview"
                  : config.displayMode === "slider"
                    ? "Bar + cart drawer preview"
                    : "Product page mock"}
              </p>
            </div>
          </div>
          <button type="button" className={styles.previewNativeBtn}>
            Native Add to cart
          </button>

          {config.displayMode === "quickbuy" ? (
            <div
              className={`${styles.previewQuick} ${
                config.enabled ? "" : styles.previewBarDisabled
              }`}
              style={{
                background: config.buttonBackground,
                color: config.buttonTextColor,
                borderRadius: `${Math.max(config.buttonRadius, 20)}px`,
                fontSize: `${config.buttonFontSize}px`,
                boxShadow: config.showShadow
                  ? "0 10px 28px rgba(0,0,0,0.18)"
                  : "none",
              }}
            >
              {config.buttonText}
            </div>
          ) : (
            <div
              className={`${styles.previewBar} ${
                config.enabled ? "" : styles.previewBarDisabled
              } ${config.layout === "compact" ? styles.previewBarCompact : ""}`}
              style={previewBarStyle}
            >
              {!hideBranding && (
                <span
                  className={styles.previewBrand}
                  style={{ color: config.textColor }}
                >
                  Powered by Sticky ATC
                </span>
              )}
              {config.showImage && (
                <div
                  className={styles.previewMedia}
                  style={{
                    width: config.imageSize,
                    height: config.imageSize,
                    borderRadius: previewImageRadius,
                    background: "linear-gradient(135deg, #94a3b8, #64748b)",
                  }}
                />
              )}
              <div className={styles.previewInfo}>
                {config.showTitle && (
                  <p
                    className={styles.previewBarTitle}
                    style={{
                      fontSize: `${config.titleFontSize}px`,
                      color: config.textColor,
                    }}
                  >
                    Classic Canvas Sneaker
                  </p>
                )}
                {config.showPrice && (
                  <p
                    className={styles.previewBarPrice}
                    style={{
                      fontSize: `${config.priceFontSize}px`,
                      color: config.textColor,
                    }}
                  >
                    $68.00
                  </p>
                )}
              </div>
              {config.showQuantity && (
                <div
                  className={styles.previewQty}
                  style={{ color: config.textColor }}
                >
                  <span>−</span>
                  <strong>1</strong>
                  <span>+</span>
                </div>
              )}
              <button
                type="button"
                className={styles.previewBarButton}
                style={{
                  background: config.buttonBackground,
                  color: config.buttonTextColor,
                  borderRadius: `${config.buttonRadius}px`,
                  fontSize: `${config.buttonFontSize}px`,
                  padding:
                    config.buttonSize === "large" ? "14px 22px" : "10px 16px",
                  width:
                    config.buttonSize === "full" || config.layout === "stacked"
                      ? "100%"
                      : undefined,
                }}
              >
                {config.buttonText}
              </button>
            </div>
          )}

          {showDrawerPreview && (
            <>
              <div
                className={styles.previewDrawerScrim}
                style={{
                  background: `rgba(17,17,17,${(config.drawerBackdropOpacity || 45) / 100})`,
                  backdropFilter: config.drawerBackdropBlur
                    ? "blur(16px) saturate(140%)"
                    : undefined,
                  WebkitBackdropFilter: config.drawerBackdropBlur
                    ? "blur(16px) saturate(140%)"
                    : undefined,
                }}
              />
              <div
                className={styles.previewSlider}
                  style={{
                    background: config.backgroundColor,
                    color: config.inheritThemeTextColor
                      ? "#111111"
                      : config.textColor,
                    borderColor: config.borderColor,
                    fontFamily: config.inheritThemeFont
                      ? "Georgia, 'Times New Roman', serif"
                      : "inherit",
                  }}
                >
                <div
                  className={styles.previewSliderAccent}
                  style={{ background: config.accentColor }}
                />
                <div
                  className={styles.previewSliderHeader}
                  style={{
                    background: config.drawerHeaderBg,
                    borderBottom:
                      config.drawerHeaderBorder === "thin"
                        ? "1px solid rgba(0,0,0,0.1)"
                        : "none",
                    flexDirection:
                      config.drawerCloseSide === "left" ? "row-reverse" : "row",
                    padding: "10px 12px",
                    flexShrink: 0,
                  }}
                >
                  <strong
                    style={{
                      color: config.textColor,
                      fontSize: `${config.drawerTitleSize}px`,
                      fontWeight:
                        config.drawerTitleWeight === "bold"
                          ? 700
                          : config.drawerTitleWeight === "semibold"
                            ? 600
                            : 400,
                      textAlign: config.drawerTitleAlign,
                      flex: 1,
                    }}
                  >
                    {(
                      config.drawerTitle || "YOUR CART ({{cart_quantity}})"
                    ).replace(
                      /\{\{\s*cart_quantity\s*\}\}/gi,
                      showEmptyPreview ? "0" : "1",
                    )}
                  </strong>
                  <span style={{ color: config.drawerCloseColor }}>×</span>
                </div>
                {config.announcementEnabled &&
                  config.announcementPosition === "before" && (
                    <div
                      style={{
                        background: config.announcementBg,
                        color: config.announcementTextColor,
                        borderBottom: `2px solid ${config.announcementBorderColor}`,
                        fontSize: Math.max(9, config.announcementFontSize - 4),
                        fontWeight: 600,
                        padding:
                          config.announcementHeight === "thick"
                            ? "10px 8px"
                            : config.announcementHeight === "slim"
                              ? "4px 8px"
                              : "6px 8px",
                        textAlign: "center",
                      }}
                    >
                      {config.announcementText.replace(
                        /\{timer\}|\{\{\s*timer\s*\}\}/gi,
                        config.announcementTimer || "15:00",
                      )}
                    </div>
                  )}
                {config.rewardEnabled &&
                  (config.rewardShowOnEmpty || !showEmptyPreview) &&
                  (() => {
                    const tiers = activeRewardTiers(config);
                    if (!tiers.length) return null;
                    const previewValue = showEmptyPreview
                      ? 0
                      : config.rewardCalcMode === "quantity"
                        ? 1
                        : 68;
                    const customRewards = renderRewardsCustomPreview(
                      config,
                      previewValue,
                    );
                    if (customRewards) {
                      const themeAccent =
                        config.buttonBackground ||
                        config.accentColor ||
                        "#111111";
                      const rBg = config.rewardUseThemeColors
                        ? mixHexWithWhite(themeAccent, 0.82)
                        : config.rewardBg;
                      const rFg = config.rewardUseThemeColors
                        ? themeAccent
                        : config.rewardFg;
                      const rIcon = config.rewardIconColor || "#111111";
                      const rText = config.rewardUseThemeColors
                        ? config.inheritThemeTextColor
                          ? "#111111"
                          : config.textColor || "#111111"
                        : config.rewardTextColor || "#111111";
                      const iconSize = Math.min(
                        48,
                        Math.max(14, Number(config.rewardIconSize) || 28),
                      );
                      const layout = config.rewardBarLayout || "stacked";
                      const iconPos =
                        config.rewardIconPosition || "outside-top";
                      const iconStyle = config.rewardIconStyle || "filled";
                      return (
                        <div
                          key={`rewards-custom-${config.featureTemplates.rewards.template.length}-${config.featureTemplates.rewardTier?.template?.length || 0}`}
                          data-satc-feature="rewards"
                          className={[
                            "satc-slider__rewards",
                            `satc-slider__rewards--layout-${layout}`,
                            `satc-slider__rewards--fill-${config.rewardBarStyle || "gradient"}`,
                            `satc-slider__rewards--msg-${config.rewardMessagePosition || "below"}`,
                            `satc-slider__rewards--icon-${iconPos}`,
                            `satc-slider__rewards--icon-style-${iconStyle}`,
                            config.rewardShowIcons === false
                              ? "satc-slider__rewards--icons-off"
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          style={
                            {
                              background: rBg,
                              padding: "12px 12px 10px",
                              borderBottom: "1px solid rgba(0,0,0,0.06)",
                              width: "100%",
                              boxSizing: "border-box",
                              ["--satc-reward-bg" as string]: rBg,
                              ["--satc-reward-fg" as string]: rFg,
                              ["--satc-reward-icon" as string]: rIcon,
                              ["--satc-reward-text" as string]: rText,
                              ["--satc-reward-icon-size" as string]: `${iconSize}px`,
                              ["--satc-tier-count" as string]: String(
                                Math.max(1, tiers.length),
                              ),
                            } as CSSProperties
                          }
                        >
                          {customRewards.css ? (
                            <style>{customRewards.css}</style>
                          ) : null}
                          <style>{`
                            [data-satc-feature="rewards"] .satc-slider__rewards-milestones{display:flex;justify-content:flex-start;width:100%;gap:0}
                            [data-satc-feature="rewards"] .satc-slider__reward-milestone{flex:1 1 0;display:flex;flex-direction:column;align-items:center;gap:5px;min-width:0;text-align:center}
                            [data-satc-feature="rewards"] .satc-slider__reward-dot{width:var(--satc-reward-icon-size,28px);height:var(--satc-reward-icon-size,28px);border-radius:50%;border:2px solid rgba(0,0,0,.14);background:#fff;display:inline-flex;align-items:center;justify-content:center;color:var(--satc-reward-icon,#111)!important;box-sizing:border-box}
                            [data-satc-feature="rewards"] .satc-slider__reward-milestone.is-reached .satc-slider__reward-dot{background:var(--satc-reward-icon,#111)!important;border-color:var(--satc-reward-icon,#111)!important;color:#fff!important}
                            [data-satc-feature="rewards"] .satc-slider__reward-icon{width:calc(var(--satc-reward-icon-size,28px)*.52);height:calc(var(--satc-reward-icon-size,28px)*.52);display:block}
                            [data-satc-feature="rewards"] .satc-slider__reward-icon-img{width:calc(var(--satc-reward-icon-size,28px)*.62);height:calc(var(--satc-reward-icon-size,28px)*.62);object-fit:contain;display:block}
                            [data-satc-feature="rewards"] .satc-slider__reward-label{font-size:8px;font-weight:700;line-height:1.25;color:var(--satc-reward-text,#111)}
                            [data-satc-feature="rewards"] .satc-slider__reward-goal{font-size:7px;font-weight:600;opacity:.65;color:var(--satc-reward-text,#111)}
                            [data-satc-feature="rewards"] .satc-slider__rewards-track{height:8px;border-radius:999px;background:rgba(0,0,0,.08);overflow:hidden;margin-top:6px}
                            [data-satc-feature="rewards"] .satc-slider__rewards-bar{display:block;height:100%;border-radius:999px;background:var(--satc-reward-fg,#111)}
                            [data-satc-feature="rewards"] .satc-slider__rewards-text{margin:8px 0 0;font-size:10px;font-weight:600;text-align:center;color:var(--satc-reward-text,#111);line-height:1.35}
                            [data-satc-feature="rewards"].satc-slider__rewards--layout-middle .satc-slider__rewards-rail{position:relative}
                            [data-satc-feature="rewards"].satc-slider__rewards--layout-middle .satc-slider__rewards-track{position:absolute!important;left:calc(100%/(2*var(--satc-tier-count,4)));right:calc(100%/(2*var(--satc-tier-count,4)));top:calc((var(--satc-reward-icon-size,28px)/2) - 4px);margin:0!important}
                            [data-satc-feature="rewards"].satc-slider__rewards--layout-middle .satc-slider__rewards-milestones{margin:0;position:relative;z-index:1}
                            [data-satc-feature="rewards"].satc-slider__rewards--msg-above .satc-slider__rewards-text{order:-1;margin:0 0 8px}
                            [data-satc-feature="rewards"].satc-slider__rewards--fill-striped .satc-slider__rewards-bar{background:repeating-linear-gradient(-45deg,var(--satc-reward-fg,#111),var(--satc-reward-fg,#111) 4px,color-mix(in srgb,var(--satc-reward-fg,#111) 55%,#fff) 4px,color-mix(in srgb,var(--satc-reward-fg,#111) 55%,#fff) 8px)}
                          `}</style>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: customRewards.html,
                            }}
                          />
                        </div>
                      );
                    }
                    const pct = rewardProgressPct(previewValue, tiers);
                    const message = rewardMessage(
                      config,
                      tiers,
                      previewValue,
                    );
                    // Match storefront: theme affects bg/progress/text; icon color stays merchant-picked
                    const themeAccent =
                      config.buttonBackground || config.accentColor || "#111111";
                    const rBg = config.rewardUseThemeColors
                      ? mixHexWithWhite(themeAccent, 0.82)
                      : config.rewardBg;
                    const rFg = config.rewardUseThemeColors
                      ? themeAccent
                      : config.rewardFg;
                    const rIcon = config.rewardIconColor || "#111111";
                    const rText = config.rewardUseThemeColors
                      ? config.inheritThemeTextColor
                        ? "#111111"
                        : config.textColor || "#111111"
                      : config.rewardTextColor || "#111111";
                    const iconPos = config.rewardIconPosition || "outside-top";
                    const iconStyle = config.rewardIconStyle || "filled";
                    const showIcons = config.rewardShowIcons !== false;
                    // Inside icons OR "line in middle" layout → line through dots
                    const middle =
                      config.rewardBarLayout === "middle" ||
                      iconPos === "inside";
                    const iconsBelow = iconPos === "outside-bottom" && !middle;
                    const barFill =
                      config.rewardBarStyle === "striped"
                        ? `repeating-linear-gradient(-45deg, ${rFg}, ${rFg} 4px, ${rFg}99 4px, ${rFg}99 8px)`
                        : config.rewardBarStyle === "gradient"
                          ? `linear-gradient(90deg, ${rFg}cc, ${rFg})`
                          : rFg;
                    const dotSize = Math.min(
                      40,
                      Math.max(12, Number(config.rewardIconSize) || 28),
                    );
                    // Match storefront: track spans first→last equal-column icon centers
                    const trackInsetPct = 100 / (2 * Math.max(1, tiers.length));
                    const trackH = middle ? 8 : 8;
                    const amountMatch = message.match(/\$[\d,.]+|\d+/);
                    const amountLabel = amountMatch ? amountMatch[0] : "";
                    const msgEl = (
                      <p
                        style={{
                          margin:
                            config.rewardMessagePosition === "above"
                              ? "0 0 8px"
                              : "8px 0 0",
                          fontSize: 10,
                          fontWeight: 600,
                          textAlign: "center",
                          color: rText,
                          lineHeight: 1.35,
                          width: "100%",
                          boxSizing: "border-box",
                          padding: "0 2px",
                        }}
                      >
                        {amountLabel
                          ? message
                              .split(amountLabel)
                              .reduce<ReactNode[]>((parts, chunk, i) => {
                                if (i > 0) {
                                  parts.push(
                                    <strong
                                      key={`amt-${i}`}
                                      style={{ fontWeight: 800, color: rFg }}
                                    >
                                      {amountLabel}
                                    </strong>,
                                  );
                                }
                                parts.push(chunk);
                                return parts;
                              }, [])
                          : message}
                      </p>
                    );
                    const trackEl = (
                      <div
                        style={
                          middle
                            ? {
                                position: "absolute",
                                left: `${trackInsetPct}%`,
                                right: `${trackInsetPct}%`,
                                top: Math.round(dotSize / 2) - Math.round(trackH / 2),
                                height: trackH,
                                borderRadius: 999,
                                background: "rgba(0,0,0,0.08)",
                                overflow: "hidden",
                                zIndex: 0,
                              }
                            : {
                                height: trackH,
                                borderRadius: 999,
                                background: "rgba(0,0,0,0.08)",
                                overflow: "hidden",
                                marginTop: iconsBelow ? 0 : 6,
                                marginBottom: iconsBelow ? 6 : 0,
                                width: "100%",
                              }
                        }
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.round(pct)}%`,
                            background: barFill,
                            borderRadius: 999,
                          }}
                        />
                      </div>
                    );
                    const milestonesEl = (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          gap: 0,
                          position: "relative",
                          zIndex: 1,
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        {tiers.map((tier, index) => {
                          const reached =
                            previewValue >= (Number(tier.minAmount) || 0);
                          const nextIndex = tiers.findIndex(
                            (t) =>
                              previewValue < (Number(t.minAmount) || 0),
                          );
                          const isCurrent = !reached && index === nextIndex;
                          const customImg = String(tier.iconUrl || "").trim();
                          const goal = Number(tier.minAmount) || 0;
                          const goalLabel =
                            config.rewardCalcMode === "quantity"
                              ? String(Math.round(goal))
                              : `$${goal.toFixed(2)}`;
                          let dotBg = reached ? rIcon : "#fff";
                          let dotBorder = reached
                            ? `2.5px solid ${rIcon}`
                            : isCurrent
                              ? `2.5px solid ${rFg}`
                              : "2px solid rgba(0,0,0,0.14)";
                          // Match live: unreached uses icon color on white; reached = white on filled
                          let glyphColor = reached ? "#fff" : rIcon;
                          if (iconStyle === "outline") {
                            dotBg = "#fff";
                            dotBorder = `2.5px solid ${rIcon}`;
                            glyphColor = rIcon;
                          } else if (iconStyle === "soft") {
                            dotBg = `${rIcon}29`;
                            dotBorder = "2px solid transparent";
                            glyphColor = rIcon;
                          } else if (iconStyle === "plain") {
                            dotBg = "transparent";
                            dotBorder = "2px solid transparent";
                            glyphColor = rIcon;
                          }
                          const iconKey =
                            tier.icon && tier.icon !== "auto" && tier.icon !== "custom"
                              ? tier.icon
                              : tier.rewardType === "shipping"
                                ? "truck"
                                : tier.rewardType === "discount"
                                  ? "percent"
                                  : tier.rewardType === "product"
                                    ? "gift"
                                    : "star";
                          return (
                            <div
                              key={tier.description + tier.minAmount}
                              style={{
                                flex: "1 1 0",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 5,
                                textAlign: "center",
                                minWidth: 0,
                                boxSizing: "border-box",
                              }}
                            >
                              {showIcons ? (
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: dotSize,
                                    height: dotSize,
                                    borderRadius: "50%",
                                    background: middle && !reached ? "#fff" : dotBg,
                                    border: dotBorder,
                                    boxSizing: "border-box",
                                    boxShadow:
                                      reached && iconStyle === "filled"
                                        ? `0 0 0 3px ${rIcon}33`
                                        : isCurrent
                                          ? `0 0 0 3px ${rFg}2e`
                                          : "0 1px 2px rgba(0,0,0,0.06)",
                                    color: glyphColor,
                                    overflow: "hidden",
                                    position: "relative",
                                    zIndex: 1,
                                  }}
                                >
                                  {customImg ? (
                                    <img
                                      src={customImg}
                                      alt=""
                                      width={Math.round(dotSize * 0.62)}
                                      height={Math.round(dotSize * 0.62)}
                                      style={{ objectFit: "contain" }}
                                    />
                                  ) : (
                                    <PreviewRewardIcon
                                      name={iconKey}
                                      color={glyphColor}
                                    />
                                  )}
                                </span>
                              ) : null}
                              <div
                                style={{
                                  fontSize: 8,
                                  fontWeight: 700,
                                  lineHeight: 1.25,
                                  overflow: "hidden",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                  color: rText,
                                  maxWidth: "100%",
                                }}
                              >
                                {tier.description}
                              </div>
                              <div
                                style={{
                                  fontSize: 7,
                                  fontWeight: 600,
                                  lineHeight: 1.2,
                                  opacity: 0.65,
                                  color: rText,
                                }}
                              >
                                {goalLabel}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                    return (
                      <div
                        key={`rewards-${config.rewardBarLayout}-${iconPos}-${config.rewardBarStyle}-${iconStyle}-${showIcons}-${tiers.length}-${dotSize}-${rIcon}`}
                        style={{
                          background: rBg,
                          padding: "12px 12px 10px",
                          borderBottom: "1px solid rgba(0,0,0,0.06)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "stretch",
                          width: "100%",
                          boxSizing: "border-box",
                          overflow: "hidden",
                        }}
                      >
                        {config.rewardMessagePosition === "above"
                          ? msgEl
                          : null}
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            maxWidth: "100%",
                            margin: "0 auto",
                            boxSizing: "border-box",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {middle ? (
                            <>
                              {trackEl}
                              {milestonesEl}
                            </>
                          ) : iconsBelow ? (
                            <>
                              {trackEl}
                              {milestonesEl}
                            </>
                          ) : (
                            <>
                              {milestonesEl}
                              {trackEl}
                            </>
                          )}
                        </div>
                        {config.rewardMessagePosition === "below"
                          ? msgEl
                          : null}
                      </div>
                    );
                  })()}
                {showEmptyPreview ? (
                  <div style={{ padding: "14px 10px 8px" }}>
                    <p
                      style={{
                        margin: 0,
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        color: config.textColor,
                      }}
                    >
                      Your cart is empty
                    </p>
                    <p
                      style={{
                        margin: "6px 0 0",
                        textAlign: "center",
                        fontSize: 11,
                        opacity: 0.75,
                        color: config.textColor,
                      }}
                    >
                      {config.recommendationsEmptyText}
                    </p>
                    {config.recommendationsShopNowEnabled && (
                      <div
                        style={{
                          marginTop: 10,
                          textAlign: "center",
                          fontSize: 11,
                          fontWeight: 650,
                          color: config.buttonTextColor,
                          background: config.buttonBackground,
                          display: "inline-block",
                          width: "100%",
                          padding: "8px 0",
                          borderRadius: `${config.buttonRadius}px`,
                        }}
                      >
                        {config.recommendationsShopNowText}
                      </div>
                    )}
                    {config.recommendationsEnabled && (
                      <div style={{ marginTop: 14 }}>
                        <strong
                          style={{
                            display: "block",
                            fontSize: 12,
                            marginBottom: 8,
                            color: config.textColor,
                          }}
                        >
                          {config.recommendationsHeader}
                        </strong>
                        {Array.from({
                          length: Math.min(3, config.recommendationsMax),
                        }).map((_, i) => (
                          <div
                            key={`rec-preview-${i}`}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "44px 1fr auto",
                              gap: 8,
                              alignItems: "center",
                              marginBottom: 8,
                              padding: 6,
                              border: "1px solid rgba(0,0,0,0.08)",
                              borderRadius: 8,
                            }}
                          >
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 6,
                                background: "rgba(0,0,0,0.08)",
                              }}
                            />
                            <div style={{ minWidth: 0 }}>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 10,
                                  fontWeight: 650,
                                  color: config.textColor,
                                }}
                              >
                                Recommended product {i + 1}
                              </p>
                              <span
                                style={{
                                  fontSize: 10,
                                  color: config.textColor,
                                }}
                              >
                                $49.99
                              </span>
                            </div>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "6px 8px",
                                borderRadius: `${config.buttonRadius}px`,
                                background: config.accentColor,
                                color: config.buttonTextColor,
                              }}
                            >
                              {config.recommendationsAddText}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                    <div style={{ padding: "10px 12px", flex: 1 }}>
                      <div className={styles.previewSliderItem}>
                        <div className={styles.previewSliderThumb} />
                        <div>
                          <p style={{ color: config.textColor }}>
                            Classic Canvas Sneaker
                          </p>
                          {config.cartLineQtyEnabled ? (
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                marginTop: 4,
                                border: "1px solid rgba(0,0,0,0.15)",
                                borderRadius: 6,
                                fontSize: 10,
                              }}
                            >
                              <span style={{ padding: "2px 6px" }}>−</span>
                              <span style={{ padding: "2px 6px" }}>1</span>
                              <span style={{ padding: "2px 6px" }}>+</span>
                            </div>
                          ) : (
                            <span style={{ color: config.textColor }}>Qty 1</span>
                          )}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          {config.cartLineRemoveEnabled && (
                            <div
                              style={{
                                color: config.textColor,
                                fontSize: 14,
                                lineHeight: 1,
                                opacity: 0.7,
                              }}
                            >
                              ×
                            </div>
                          )}
                          <strong style={{ color: config.textColor }}>
                            $68.00
                          </strong>
                        </div>
                      </div>
                      {config.recommendationsEnabled &&
                        config.recommendationsShowWithItems && (
                          <div style={{ padding: "8px 10px 4px" }}>
                            <strong
                              style={{
                                display: "block",
                                fontSize: 11,
                                marginBottom: 6,
                                color: config.textColor,
                              }}
                            >
                              {config.recommendationsHeader}
                            </strong>
                            {Array.from({
                              length: Math.min(2, config.recommendationsMax),
                            }).map((_, i) => (
                              <div
                                key={`rec-filled-${i}`}
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "36px 1fr auto",
                                  gap: 6,
                                  alignItems: "center",
                                  marginBottom: 6,
                                  padding: 5,
                                  border: "1px solid rgba(0,0,0,0.08)",
                                  borderRadius: 8,
                                }}
                              >
                                <div
                                  style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 6,
                                    background: "rgba(0,0,0,0.08)",
                                  }}
                                />
                                <div style={{ minWidth: 0 }}>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: 9,
                                      fontWeight: 650,
                                      color: config.textColor,
                                    }}
                                  >
                                    Recommended {i + 1}
                                  </p>
                                  <span
                                    style={{
                                      fontSize: 9,
                                      color: config.textColor,
                                    }}
                                  >
                                    $24.95
                                  </span>
                                </div>
                                <span
                                  style={{
                                    fontSize: 9,
                                    fontWeight: 700,
                                    padding: "4px 6px",
                                    borderRadius: `${config.buttonRadius}px`,
                                    background: config.accentColor,
                                    color: config.buttonTextColor,
                                  }}
                                >
                                  {config.recommendationsAddText}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                )}
                {config.announcementEnabled &&
                  config.announcementPosition === "after" && (
                    <div
                      style={{
                        background: config.announcementBg,
                        color: config.announcementTextColor,
                        borderBottom: `2px solid ${config.announcementBorderColor}`,
                        fontSize: Math.max(9, config.announcementFontSize - 4),
                        fontWeight: 600,
                        padding: "6px 8px",
                        textAlign: "center",
                      }}
                    >
                      {config.announcementText.replace(
                        /\{timer\}|\{\{\s*timer\s*\}\}/gi,
                        config.announcementTimer || "15:00",
                      )}
                    </div>
                  )}
                {!showEmptyPreview && (
                  <div className={styles.previewSliderFooter}>
                    <div style={{ color: config.textColor }}>
                      <span>Subtotal</span>
                      <strong>$68.00</strong>
                    </div>
                    <div
                      className={styles.previewSliderCheckout}
                      style={{
                        background: config.buttonBackground,
                        color: config.buttonTextColor,
                        borderRadius: `${config.buttonRadius}px`,
                      }}
                    >
                      {config.drawerCheckoutText || "Checkout"}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
