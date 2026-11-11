import type { CSSProperties } from "react";
import styles from "../../styles/dashboard.module.css";
import type { BarConfig } from "../../models/bar-config";
import {
  activeRewardTiers,
  rewardMessage,
  rewardProgressPct,
} from "../preview/reward-progress";

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
                    const pct = rewardProgressPct(previewValue, tiers);
                    const message = rewardMessage(
                      config,
                      tiers,
                      previewValue,
                    );
                    const rBg = config.rewardUseThemeColors
                      ? "#eef2ff"
                      : config.rewardBg;
                    const rFg = config.rewardUseThemeColors
                      ? "#4f46e5"
                      : config.rewardFg;
                    const rIcon = config.rewardUseThemeColors
                      ? "#4f46e5"
                      : config.rewardIconColor;
                    const rText = config.rewardUseThemeColors
                      ? "#111111"
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
                    const dotSize = middle ? 18 : 14;
                    const msgEl = (
                      <p
                        style={{
                          margin:
                            config.rewardMessagePosition === "above"
                              ? "0 0 6px"
                              : "6px 0 0",
                          fontSize: 10,
                          fontWeight: 600,
                          textAlign: "center",
                          color: rText,
                          lineHeight: 1.3,
                        }}
                      >
                        {message}
                      </p>
                    );
                    const trackEl = (
                      <div
                        style={
                          middle
                            ? {
                                position: "absolute",
                                left: "8%",
                                right: "8%",
                                top: Math.round(dotSize / 2) - 3,
                                height: 6,
                                borderRadius: 999,
                                background: "rgba(0,0,0,0.08)",
                                overflow: "hidden",
                                zIndex: 0,
                              }
                            : {
                                height: 6,
                                borderRadius: 999,
                                background: "rgba(0,0,0,0.08)",
                                overflow: "hidden",
                                marginTop: iconsBelow ? 0 : 6,
                                marginBottom: iconsBelow ? 6 : 0,
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
                          justifyContent: "space-between",
                          gap: 4,
                          position: "relative",
                          zIndex: 1,
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
                          const customImg =
                            tier.icon === "custom" && tier.iconUrl
                              ? tier.iconUrl
                              : "";
                          let dotBg = reached ? rIcon : "#fff";
                          let dotBorder = reached
                            ? `2px solid ${rIcon}`
                            : isCurrent
                              ? `2px solid ${rFg}`
                              : "2px solid rgba(0,0,0,0.15)";
                          let dotColor = "#fff";
                          if (iconStyle === "outline") {
                            dotBg = "#fff";
                            dotBorder = `2px solid ${rIcon}`;
                            dotColor = rIcon;
                          } else if (iconStyle === "soft") {
                            dotBg = `${rIcon}29`;
                            dotBorder = "2px solid transparent";
                            dotColor = rIcon;
                          } else if (iconStyle === "plain") {
                            dotBg = "transparent";
                            dotBorder = "2px solid transparent";
                            dotColor = rIcon;
                          }
                          return (
                            <div
                              key={tier.description + tier.minAmount}
                              style={{
                                flex: 1,
                                textAlign: "center",
                                minWidth: 0,
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
                                    background: dotBg,
                                    border: dotBorder,
                                    boxSizing: "border-box",
                                    boxShadow:
                                      reached && iconStyle === "filled"
                                        ? `0 0 0 2px ${rIcon}33`
                                        : undefined,
                                    color: dotColor,
                                    fontSize: 8,
                                    fontWeight: 800,
                                    overflow: "hidden",
                                  }}
                                >
                                  {customImg ? (
                                    <img
                                      src={customImg}
                                      alt=""
                                      width={12}
                                      height={12}
                                      style={{ objectFit: "contain" }}
                                    />
                                  ) : reached ? (
                                    "✓"
                                  ) : tier.icon === "truck" ? (
                                    "🚚"
                                  ) : tier.icon === "gift" ? (
                                    "🎁"
                                  ) : tier.icon === "percent" ? (
                                    "%"
                                  ) : tier.icon === "star" ? (
                                    "★"
                                  ) : tier.icon === "heart" ? (
                                    "♥"
                                  ) : tier.icon === "lock" ? (
                                    "🔒"
                                  ) : (
                                    ""
                                  )}
                                </span>
                              ) : null}
                              <div
                                style={{
                                  fontSize: 8,
                                  fontWeight: 700,
                                  lineHeight: 1.2,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  color: rText,
                                  marginTop: showIcons ? 4 : 0,
                                }}
                              >
                                {tier.description}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                    return (
                      <div
                        key={`rewards-${config.rewardBarLayout}-${iconPos}-${config.rewardBarStyle}-${iconStyle}-${showIcons}`}
                        style={{
                          background: rBg,
                          padding: "8px 8px 6px",
                          borderBottom: "1px solid rgba(0,0,0,0.06)",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {config.rewardMessagePosition === "above"
                          ? msgEl
                          : null}
                        <div style={{ position: "relative" }}>
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
                    <div>
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
