import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import styles from "../../../styles/dashboard.module.css";
import {
  DEFAULT_REWARD_COLORS,
  REWARD_ICON_PRESETS,
  type RewardAnimation,
  type RewardBarLayout,
  type RewardBarStyle,
  type RewardIconPosition,
  type RewardIconPreset,
  type RewardIconStyle,
  type RewardMessagePosition,
  type RewardType,
} from "../../../models/bar-config";
import { FeatureCustomTemplate } from "../FeatureCustomTemplate";
import { colorFromEvent } from "../../fields/color";
import type { RewardsPanelProps } from "../../types";

type ResolveFileActionData = {
  ok?: boolean;
  intent?: string;
  url?: string;
  message?: string;
  tierIndex?: number;
};

function mixWithWhite(hex: string, whiteRatio = 0.82): string {
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

/** Black monochrome glyphs for the tier icon picker (matches storefront SVGs). */
function PresetGlyph({ id }: { id: string }) {
  const color = "#111111";
  if (id === "auto") {
    return (
      <span style={{ color, fontWeight: 800, fontSize: 13 }}>A</span>
    );
  }
  if (id === "custom") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill={color}
          d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"
        />
      </svg>
    );
  }
  if (id === "check") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path
          fill={color}
          d="M6.2 11.4 2.8 8l1.2-1.2 2.2 2.2 5-5L12.4 5.2z"
        />
      </svg>
    );
  }
  const paths: Record<string, string> = {
    truck:
      "M3 7h11v8H3V7zm12 2h3.2L21 12.5V15h-6V9zM6.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
    gift: "M20 7h-2.26A3.5 3.5 0 0 0 12 3.05 3.5 3.5 0 0 0 6.26 7H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1ZM9.5 5.5a1.5 1.5 0 1 1 0 3H8.26a1.5 1.5 0 0 1 1.24-3Zm5 0a1.5 1.5 0 0 1 1.24 3H14.5a1.5 1.5 0 1 1 0-3ZM6 19v-7h5v7H6Zm12 0h-5v-7h5v7Z",
    percent:
      "M7.5 6.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM8 17.5 16.5 6.5l1.1 1.1L9.1 18.6 8 17.5z",
    star: "m12 2.8 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8l5-.7L12 2.8z",
    heart:
      "M12 21s-6.7-4.2-9.2-8.1C1.1 10.2 2 7 5 6.2c1.8-.5 3.5.3 4.5 1.6C10.5 6.5 12.2 5.7 14 6.2c3 .8 3.9 4 2.2 6.7C18.7 16.8 12 21 12 21z",
    lock: "M7 10V8a5 5 0 0 1 10 0v2h1.5A1.5 1.5 0 0 1 20 11.5v8A1.5 1.5 0 0 1 18.5 21h-13A1.5 1.5 0 0 1 4 19.5v-8A1.5 1.5 0 0 1 5.5 10H7zm2 0h6V8a3 3 0 0 0-6 0v2z",
  };
  const d = paths[id];
  if (!d) return <span style={{ color }}>•</span>;
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill={color} d={d} />
    </svg>
  );
}

export function RewardsPanel({
  config,
  updateConfig,
  updateRewardTier,
  t,
}: RewardsPanelProps) {
  const shopify = useAppBridge();
  const fileFetcher = useFetcher<ResolveFileActionData>();
  const [activeTier, setActiveTier] = useState(0);
  const [fileError, setFileError] = useState("");
  const tier = config.rewardTiers[activeTier] || config.rewardTiers[0];
  const themeOn = config.rewardUseThemeColors;
  // Match storefront theme mapping (button/accent), not a fake indigo
  const themeAccent =
    config.buttonBackground || config.accentColor || "#111111";
  const previewBg = themeOn
    ? mixWithWhite(themeAccent, 0.82)
    : config.rewardBg;
  const previewFg = themeOn ? themeAccent : config.rewardFg;
  const previewIcon = config.rewardIconColor;
  const previewText = themeOn
    ? config.inheritThemeTextColor
      ? "#111111"
      : config.textColor || "#111111"
    : config.rewardTextColor || "#111111";
  const fileBusy = fileFetcher.state !== "idle";

  useEffect(() => {
    const data = fileFetcher.data;
    if (!data || data.intent !== "resolve-file") return;
    if (data.ok && data.url) {
      const index =
        typeof data.tierIndex === "number" ? data.tierIndex : activeTier;
      updateRewardTier(index, {
        icon: "custom",
        iconUrl: data.url,
      });
      setFileError("");
      return;
    }
    if (data.message) setFileError(data.message);
  }, [fileFetcher.data, activeTier, updateRewardTier]);

  const resetRewardColors = () => {
    updateConfig(
      "rewardUseThemeColors",
      DEFAULT_REWARD_COLORS.rewardUseThemeColors,
    );
    updateConfig("rewardBg", DEFAULT_REWARD_COLORS.rewardBg);
    updateConfig("rewardFg", DEFAULT_REWARD_COLORS.rewardFg);
    updateConfig("rewardIconColor", DEFAULT_REWARD_COLORS.rewardIconColor);
    updateConfig("rewardTextColor", DEFAULT_REWARD_COLORS.rewardTextColor);
  };

  const pickProduct = async () => {
    try {
      const selected = await shopify.resourcePicker({
        type: "product",
        multiple: false,
        action: "select",
      });
      if (!selected || !Array.isArray(selected) || !selected.length) return;
      const product = selected[0] as {
        id?: string;
        title?: string;
        handle?: string;
      };
      const handle = String(product.handle || "").trim();
      updateRewardTier(activeTier, {
        rewardType: "product",
        productTitle: String(product.title || "").trim(),
        productHandle: handle,
        productUrl: handle ? `/products/${handle}` : "",
        description:
          tier.description?.trim() ||
          String(product.title || "Free product").trim(),
      });
    } catch {
      /* picker cancelled */
    }
  };

  const clearProduct = () => {
    updateRewardTier(activeTier, {
      productTitle: "",
      productHandle: "",
      productUrl: "",
    });
  };

  const pickShopifyFile = async () => {
    setFileError("");
    try {
      const intents = (
        shopify as {
          intents?: {
            invoke: (
              query: string,
              options?: { data?: Record<string, unknown> },
            ) => Promise<{ complete: Promise<{ code?: string; data?: { ids?: string[] } }> }>;
          };
        }
      ).intents;
      if (!intents?.invoke) {
        setFileError(t("rewards.filesUnavailable"));
        return;
      }
      const activity = await intents.invoke("pick:shopify/File", {
        data: {
          mediaTypes: ["MediaImage", "GenericFile"],
          multiSelect: false,
        },
      });
      const response = await activity.complete;
      if (response?.code !== "ok" || !response.data?.ids?.length) return;
      const fileId = response.data.ids[0];
      const fd = new FormData();
      fd.set("intent", "resolve-file");
      fd.set("fileId", fileId);
      fd.set("tierIndex", String(activeTier));
      fileFetcher.submit(fd, { method: "post" });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : t("rewards.filesError");
      setFileError(message);
    }
  };

  const clearCustomIcon = () => {
    updateRewardTier(activeTier, {
      icon: "auto",
      iconUrl: "",
    });
  };

  return (
    <s-stack gap="base">
      <s-stack direction="inline" gap="base">
        <s-badge tone={config.rewardEnabled ? "success" : "neutral"}>
          {config.rewardEnabled ? t("common.active") : t("common.disabled")}
        </s-badge>
        <s-switch
          label={
            config.rewardEnabled
              ? t("rewards.disable")
              : t("rewards.enable")
          }
          checked={config.rewardEnabled}
          onChange={(e: Event) =>
            updateConfig(
              "rewardEnabled",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
      </s-stack>

      <s-switch
        label={t("rewards.showEmpty")}
        checked={config.rewardShowOnEmpty}
        onChange={(e: Event) =>
          updateConfig(
            "rewardShowOnEmpty",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />

      <s-heading>{t("rewards.colors")}</s-heading>
      <s-stack direction="inline" gap="base">
        <s-switch
          label={t("rewards.useTheme")}
          checked={themeOn}
          onChange={(e: Event) =>
            updateConfig(
              "rewardUseThemeColors",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-button variant="tertiary" onClick={resetRewardColors}>
          {t("rewards.resetColors")}
        </s-button>
      </s-stack>
      <s-paragraph>
        {themeOn
          ? t("rewards.themeHelpOn")
          : t("rewards.themeHelpOff")}
      </s-paragraph>

      <div
        className={styles.rewardColorPreview}
        style={{ background: previewBg }}
        aria-hidden="true"
      >
        <div className={styles.rewardColorPreviewDots}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={styles.rewardColorPreviewDot}
              style={
                i < 2
                  ? {
                      background: previewIcon,
                      borderColor: previewIcon,
                    }
                  : undefined
              }
            />
          ))}
        </div>
        <div className={styles.rewardColorPreviewTrack}>
          <span
            className={styles.rewardColorPreviewBar}
            style={{ background: previewFg }}
          />
        </div>
        <p
          className={styles.rewardColorPreviewText}
          style={{ color: previewText }}
        >
          {t("rewards.livePreview")}
        </p>
      </div>

      {!themeOn && (
        <>
          <div className={styles.colorLegend}>
            {(
              [
                [t("rewards.legendBackground"), config.rewardBg],
                [t("rewards.legendProgress"), config.rewardFg],
                [t("rewards.legendIcon"), config.rewardIconColor],
                [t("rewards.legendText"), config.rewardTextColor],
              ] as const
            ).map(([label, hex]) => (
              <div key={label} className={styles.colorSwatch}>
                <span
                  className={styles.colorSwatchDot}
                  style={{ background: hex }}
                />
                <div className={styles.colorSwatchMeta}>
                  <strong>{label}</strong>
                  <span>{hex}</span>
                </div>
              </div>
            ))}
          </div>
          <s-grid gridTemplateColumns="1fr 1fr" gap="base">
            <s-color-field
              label={t("rewards.legendBackground")}
              value={config.rewardBg}
              onChange={(e: Event) => {
                const value = colorFromEvent(e);
                if (value) updateConfig("rewardBg", value);
              }}
            />
            <s-color-field
              label={t("rewards.progressFg")}
              value={config.rewardFg}
              onChange={(e: Event) => {
                const value = colorFromEvent(e);
                if (value) updateConfig("rewardFg", value);
              }}
            />
            <s-color-field
              label={t("rewards.messageText")}
              value={config.rewardTextColor}
              onChange={(e: Event) => {
                const value = colorFromEvent(e);
                if (value) updateConfig("rewardTextColor", value);
              }}
            />
          </s-grid>
        </>
      )}

      <s-color-field
        label={t("rewards.iconColor")}
        value={config.rewardIconColor}
        details={t("rewards.iconColorHelp")}
        onChange={(e: Event) => {
          const value = colorFromEvent(e);
          if (value) updateConfig("rewardIconColor", value);
        }}
      />

      <s-text-field
        label={t("rewards.completeText")}
        value={config.rewardCompleteText}
        onChange={(e: Event) =>
          updateConfig(
            "rewardCompleteText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />

      <s-select
        label={t("rewards.mode")}
        value={config.rewardCalcMode}
        onChange={(e: Event) =>
          updateConfig(
            "rewardCalcMode",
            (e.currentTarget as HTMLSelectElement).value as
              | "total"
              | "quantity",
          )
        }
      >
        <s-option value="total">{t("rewards.modeTotal")}</s-option>
        <s-option value="quantity">{t("rewards.modeQty")}</s-option>
      </s-select>

      <s-heading>{t("rewards.barDesign")}</s-heading>
      <s-paragraph>{t("rewards.barDesignHelp")}</s-paragraph>

      <div className={styles.layoutPicker} role="radiogroup" aria-label={t("rewards.layout")}>
        {(
          [
            ["stacked", t("rewards.layoutStacked"), t("rewards.layoutStackedHint")],
            ["middle", t("rewards.layoutMiddle"), t("rewards.layoutMiddleHint")],
          ] as const
        ).map(([value, label, hint]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={config.rewardBarLayout === value}
            className={`${styles.layoutOption} ${
              config.rewardBarLayout === value ? styles.layoutOptionActive : ""
            }`}
            onClick={() => {
              updateConfig("rewardBarLayout", value as RewardBarLayout);
              // Keep icon placement in sync with the chosen layout.
              updateConfig(
                "rewardIconPosition",
                value === "middle" ? "inside" : "outside-top",
              );
            }}
          >
            <span
              className={`${styles.layoutThumb} ${
                value === "middle"
                  ? styles.layoutThumbMiddle
                  : styles.layoutThumbStacked
              }`}
              aria-hidden="true"
            />
            <strong>{label}</strong>
            <span>{hint}</span>
          </button>
        ))}
      </div>

      <s-select
        label={t("rewards.fillStyle")}
        value={config.rewardBarStyle}
        onChange={(e: Event) =>
          updateConfig(
            "rewardBarStyle",
            (e.currentTarget as HTMLSelectElement).value as RewardBarStyle,
          )
        }
      >
        <s-option value="gradient">{t("rewards.fillGradient")}</s-option>
        <s-option value="solid">{t("rewards.fillSolid")}</s-option>
        <s-option value="striped">{t("rewards.fillStriped")}</s-option>
      </s-select>

      <s-select
        label={t("rewards.messagePosition")}
        value={config.rewardMessagePosition}
        onChange={(e: Event) =>
          updateConfig(
            "rewardMessagePosition",
            (e.currentTarget as HTMLSelectElement)
              .value as RewardMessagePosition,
          )
        }
      >
        <s-option value="below">{t("rewards.msgBelow")}</s-option>
        <s-option value="above">{t("rewards.msgAbove")}</s-option>
      </s-select>

      <s-heading>{t("rewards.icons")}</s-heading>
      <s-switch
        label={t("rewards.showIcons")}
        checked={config.rewardShowIcons}
        onChange={(e: Event) =>
          updateConfig(
            "rewardShowIcons",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />
      <s-select
        label={t("rewards.iconPosition")}
        value={config.rewardIconPosition}
        details={t("rewards.iconPositionHelp")}
        onChange={(e: Event) => {
          const value = (e.currentTarget as HTMLSelectElement)
            .value as RewardIconPosition;
          updateConfig("rewardIconPosition", value);
          if (value === "inside") {
            updateConfig("rewardBarLayout", "middle");
          } else if (config.rewardBarLayout === "middle") {
            updateConfig("rewardBarLayout", "stacked");
          }
        }}
      >
        <s-option value="inside">{t("rewards.iconInside")}</s-option>
        <s-option value="outside-top">{t("rewards.iconOutsideTop")}</s-option>
        <s-option value="outside-bottom">{t("rewards.iconOutsideBottom")}</s-option>
      </s-select>
      <s-number-field
        label={t("rewards.iconSize")}
        value={String(config.rewardIconSize ?? 28)}
        min={14}
        max={48}
        details={t("rewards.iconSizeHelp")}
        onChange={(e: Event) =>
          updateConfig(
            "rewardIconSize",
            Math.min(
              48,
              Math.max(
                14,
                Number((e.currentTarget as HTMLInputElement).value) || 28,
              ),
            ),
          )
        }
      />
      <s-select
        label={t("rewards.iconStyle")}
        value={config.rewardIconStyle}
        onChange={(e: Event) =>
          updateConfig(
            "rewardIconStyle",
            (e.currentTarget as HTMLSelectElement).value as RewardIconStyle,
          )
        }
      >
        <s-option value="filled">{t("rewards.styleFilled")}</s-option>
        <s-option value="outline">{t("rewards.styleOutline")}</s-option>
        <s-option value="soft">{t("rewards.styleSoft")}</s-option>
        <s-option value="plain">{t("rewards.stylePlain")}</s-option>
      </s-select>

      <s-select
        label={t("rewards.animation")}
        value={config.rewardAnimation}
        details={t("rewards.animationHelp")}
        onChange={(e: Event) =>
          updateConfig(
            "rewardAnimation",
            (e.currentTarget as HTMLSelectElement).value as RewardAnimation,
          )
        }
      >
        <s-option value="smooth">{t("rewards.animSmooth")}</s-option>
        <s-option value="pulse">{t("rewards.animPulse")}</s-option>
        <s-option value="glow">{t("rewards.animGlow")}</s-option>
        <s-option value="bounce">{t("rewards.animBounce")}</s-option>
        <s-option value="none">{t("common.none")}</s-option>
      </s-select>

      <s-heading>{t("rewards.tiers")}</s-heading>
      <div className={styles.tierTabs} role="tablist" aria-label={t("rewards.tiers")}>
        {config.rewardTiers.map((tierItem, index) => (
          <button
            key={`tier-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={activeTier === index}
            className={`${styles.tierTab} ${
              activeTier === index ? styles.tierTabActive : ""
            }`}
            onClick={() => setActiveTier(index)}
          >
            {t("rewards.tierN", { n: index + 1 })}
            {tierItem.enabled ? "" : t("rewards.tabOff")}
          </button>
        ))}
      </div>

      {tier && (
        <div className={styles.tierCard} role="tabpanel">
          <s-stack direction="inline" gap="base">
            <strong>{t("rewards.tierN", { n: activeTier + 1 })}</strong>
            <s-switch
              label={t("rewards.tierEnabled")}
              checked={tier.enabled}
              onChange={(e: Event) =>
                updateRewardTier(activeTier, {
                  enabled: (e.currentTarget as HTMLInputElement).checked,
                })
              }
            />
          </s-stack>

          <s-select
            label={t("rewards.rewardType")}
            value={tier.rewardType || "custom"}
            onChange={(e: Event) =>
              updateRewardTier(activeTier, {
                rewardType: (e.currentTarget as HTMLSelectElement)
                  .value as RewardType,
              })
            }
          >
            <s-option value="shipping">{t("rewards.typeShipping")}</s-option>
            <s-option value="discount">{t("rewards.typeDiscount")}</s-option>
            <s-option value="product">{t("rewards.typeProduct")}</s-option>
            <s-option value="custom">{t("rewards.typeCustom")}</s-option>
          </s-select>

          <s-number-field
            label={
              config.rewardCalcMode === "quantity"
                ? t("rewards.minQuantity")
                : t("rewards.minAmount")
            }
            value={String(tier.minAmount)}
            min={1}
            onChange={(e: Event) =>
              updateRewardTier(activeTier, {
                minAmount: Number((e.currentTarget as HTMLInputElement).value),
              })
            }
          />
          <s-text-field
            label={t("rewards.tierDescription")}
            value={tier.description}
            onChange={(e: Event) =>
              updateRewardTier(activeTier, {
                description: (e.currentTarget as HTMLInputElement).value,
              })
            }
          />
          <s-text-field
            label={t("rewards.titleBefore")}
            value={tier.titleBefore}
            onChange={(e: Event) =>
              updateRewardTier(activeTier, {
                titleBefore: (e.currentTarget as HTMLInputElement).value,
              })
            }
          />

          <s-heading>{t("rewards.tierIcon")}</s-heading>
          <s-paragraph>{t("rewards.tierIconHelp")}</s-paragraph>
          <div className={styles.iconPresetGrid} role="listbox" aria-label={t("rewards.tierIcon")}>
            {REWARD_ICON_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                role="option"
                aria-selected={(tier.icon || "auto") === preset.id}
                className={`${styles.iconPreset} ${
                  (tier.icon || "auto") === preset.id
                    ? styles.iconPresetActive
                    : ""
                }`}
                onClick={() => {
                  if (preset.id === "custom") {
                    updateRewardTier(activeTier, { icon: "custom" });
                    void pickShopifyFile();
                    return;
                  }
                  updateRewardTier(activeTier, {
                    icon: preset.id as RewardIconPreset,
                    iconUrl: "",
                  });
                }}
              >
                <span className={styles.iconPresetGlyph} aria-hidden="true">
                  <PresetGlyph id={preset.id} />
                </span>
                <span>{t(`rewards.preset.${preset.id}`)}</span>
              </button>
            ))}
          </div>
          {(tier.icon || "auto") === "custom" && (
            <s-stack gap="base">
              <div className={styles.rewardProductRow}>
                {tier.iconUrl ? (
                  <>
                    <img
                      src={tier.iconUrl}
                      alt=""
                      width={36}
                      height={36}
                      style={{
                        objectFit: "contain",
                        borderRadius: 8,
                        background: "#f3f4f6",
                      }}
                    />
                    <div className={styles.rewardProductMeta}>
                      <strong>{t("rewards.customIcon")}</strong>
                      <span>{tier.iconUrl}</span>
                    </div>
                    <s-button
                      variant="tertiary"
                      onClick={pickShopifyFile}
                      disabled={fileBusy}
                    >
                      {fileBusy ? t("common.loading") : t("rewards.changeFile")}
                    </s-button>
                    <s-button
                      variant="tertiary"
                      tone="critical"
                      onClick={clearCustomIcon}
                    >
                      {t("common.remove")}
                    </s-button>
                  </>
                ) : (
                  <s-button onClick={pickShopifyFile} disabled={fileBusy}>
                    {fileBusy
                      ? t("common.loading")
                      : t("rewards.uploadFile")}
                  </s-button>
                )}
              </div>
              <s-text-field
                label={t("rewards.pasteUrl")}
                value={tier.iconUrl || ""}
                details={t("rewards.pasteUrlHelp")}
                onChange={(e: Event) => {
                  const url = (e.currentTarget as HTMLInputElement).value.trim();
                  updateRewardTier(activeTier, {
                    icon: "custom",
                    iconUrl: url,
                  });
                }}
              />
            </s-stack>
          )}
          {fileError ? (
            <s-banner tone="critical">{fileError}</s-banner>
          ) : null}

          {tier.rewardType === "product" && (
            <>
              <s-heading>{t("rewards.productHeading")}</s-heading>
              <s-paragraph>{t("rewards.productHelp")}</s-paragraph>
              {tier.productTitle || tier.productHandle ? (
                <div className={styles.rewardProductRow}>
                  <div className={styles.rewardProductMeta}>
                    <strong>{tier.productTitle || t("rewards.selectedProduct")}</strong>
                    <span>
                      {tier.productHandle
                        ? `/products/${tier.productHandle}`
                        : tier.productUrl || t("rewards.noUrl")}
                    </span>
                  </div>
                  <s-button variant="tertiary" onClick={pickProduct}>
                    {t("common.change")}
                  </s-button>
                  <s-button variant="tertiary" tone="critical" onClick={clearProduct}>
                    {t("common.remove")}
                  </s-button>
                </div>
              ) : (
                <s-button onClick={pickProduct}>{t("rewards.addProduct")}</s-button>
              )}
              <s-text-field
                label={t("rewards.productTitleOverride")}
                value={tier.productTitle || ""}
                onChange={(e: Event) =>
                  updateRewardTier(activeTier, {
                    productTitle: (e.currentTarget as HTMLInputElement).value,
                  })
                }
              />
              <s-text-field
                label={t("rewards.productHandle")}
                value={tier.productHandle || ""}
                details={t("rewards.productHandleHelp")}
                onChange={(e: Event) =>
                  updateRewardTier(activeTier, {
                    productHandle: (e.currentTarget as HTMLInputElement).value,
                  })
                }
              />
              <s-text-field
                label={t("rewards.productUrl")}
                value={tier.productUrl || ""}
                onChange={(e: Event) =>
                  updateRewardTier(activeTier, {
                    productUrl: (e.currentTarget as HTMLInputElement).value,
                  })
                }
              />
            </>
          )}
        </div>
      )}

      <FeatureCustomTemplate
        featureKey="rewards"
        extraKeys={["rewardTier"]}
        title={t("rewards.customHtml")}
        config={config}
        updateConfig={updateConfig}
      />
    </s-stack>
  );
}
