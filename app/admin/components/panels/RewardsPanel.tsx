import { useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import styles from "../../../styles/dashboard.module.css";
import {
  DEFAULT_REWARD_COLORS,
  type RewardAnimation,
  type RewardBarLayout,
  type RewardBarStyle,
  type RewardMessagePosition,
  type RewardType,
} from "../../../models/bar-config";
import { FeatureCustomTemplate } from "../FeatureCustomTemplate";
import { colorFromEvent } from "../../fields/color";
import type { RewardsPanelProps } from "../../types";

export function RewardsPanel({
  config,
  updateConfig,
  updateRewardTier,
}: RewardsPanelProps) {
  const shopify = useAppBridge();
  const [activeTier, setActiveTier] = useState(0);
  const tier = config.rewardTiers[activeTier] || config.rewardTiers[0];
  const themeOn = config.rewardUseThemeColors;
  const previewBg = themeOn ? "#eef2ff" : config.rewardBg;
  const previewFg = themeOn ? "#4f46e5" : config.rewardFg;
  const previewIcon = themeOn ? "#4f46e5" : config.rewardIconColor;
  const previewText = themeOn
    ? "#111111"
    : config.rewardTextColor || "#111111";

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

  return (
    <s-stack gap="base">
      <s-stack direction="inline" gap="base">
        <s-badge tone={config.rewardEnabled ? "success" : "neutral"}>
          {config.rewardEnabled ? "Active" : "Disabled"}
        </s-badge>
        <s-switch
          label={
            config.rewardEnabled
              ? "Disable tiered rewards"
              : "Enable tiered rewards"
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
        label="Show rewards on empty cart"
        checked={config.rewardShowOnEmpty}
        onChange={(e: Event) =>
          updateConfig(
            "rewardShowOnEmpty",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />

      <s-heading>Colors</s-heading>
      <s-stack direction="inline" gap="base">
        <s-switch
          label="Use theme colors"
          checked={themeOn}
          onChange={(e: Event) =>
            updateConfig(
              "rewardUseThemeColors",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-button variant="tertiary" onClick={resetRewardColors}>
          Reset colors
        </s-button>
      </s-stack>
      <s-paragraph>
        {themeOn
          ? "Rewards strip uses theme accent / foreground tokens on the storefront."
          : "Custom colors below are applied to the rewards bar on the storefront."}
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
          Live color preview
        </p>
      </div>

      {!themeOn && (
        <>
          <div className={styles.colorLegend}>
            {(
              [
                ["Background", config.rewardBg],
                ["Progress", config.rewardFg],
                ["Icon", config.rewardIconColor],
                ["Text", config.rewardTextColor],
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
              label="Background"
              value={config.rewardBg}
              onChange={(e: Event) => {
                const value = colorFromEvent(e);
                if (value) updateConfig("rewardBg", value);
              }}
            />
            <s-color-field
              label="Progress / foreground"
              value={config.rewardFg}
              onChange={(e: Event) => {
                const value = colorFromEvent(e);
                if (value) updateConfig("rewardFg", value);
              }}
            />
            <s-color-field
              label="Reward tier icon"
              value={config.rewardIconColor}
              onChange={(e: Event) => {
                const value = colorFromEvent(e);
                if (value) updateConfig("rewardIconColor", value);
              }}
            />
            <s-color-field
              label="Message text"
              value={config.rewardTextColor}
              onChange={(e: Event) => {
                const value = colorFromEvent(e);
                if (value) updateConfig("rewardTextColor", value);
              }}
            />
          </s-grid>
        </>
      )}

      <s-text-field
        label="Text after completing full rewards bar"
        value={config.rewardCompleteText}
        onChange={(e: Event) =>
          updateConfig(
            "rewardCompleteText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />

      <s-select
        label="Rewards calculation"
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
        <s-option value="total">Cart total ($)</s-option>
        <s-option value="quantity">Cart quantity (#)</s-option>
      </s-select>

      <s-heading>Progress bar design</s-heading>
      <s-paragraph>
        Mix layout, fill style, and message position. Preview updates on the
        right — Save to publish to the storefront.
      </s-paragraph>

      <div className={styles.layoutPicker} role="radiogroup" aria-label="Bar layout">
        {(
          [
            ["stacked", "Bar below", "Milestones on top, progress bar underneath"],
            ["middle", "Line in middle", "Progress line runs through the icons"],
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
            onClick={() =>
              updateConfig("rewardBarLayout", value as RewardBarLayout)
            }
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
        label="Progress fill style"
        value={config.rewardBarStyle}
        onChange={(e: Event) =>
          updateConfig(
            "rewardBarStyle",
            (e.currentTarget as HTMLSelectElement).value as RewardBarStyle,
          )
        }
      >
        <s-option value="gradient">Gradient</s-option>
        <s-option value="solid">Solid</s-option>
        <s-option value="striped">Striped</s-option>
      </s-select>

      <s-select
        label="Message position"
        value={config.rewardMessagePosition}
        onChange={(e: Event) =>
          updateConfig(
            "rewardMessagePosition",
            (e.currentTarget as HTMLSelectElement)
              .value as RewardMessagePosition,
          )
        }
      >
        <s-option value="below">Below progress</s-option>
        <s-option value="above">Above progress</s-option>
      </s-select>

      <s-select
        label="Rewards animation"
        value={config.rewardAnimation}
        details="Progress bar and unlock motion on the storefront"
        onChange={(e: Event) =>
          updateConfig(
            "rewardAnimation",
            (e.currentTarget as HTMLSelectElement).value as RewardAnimation,
          )
        }
      >
        <s-option value="smooth">Smooth fill</s-option>
        <s-option value="pulse">Pulse on unlock</s-option>
        <s-option value="glow">Glow progress</s-option>
        <s-option value="bounce">Bounce milestones</s-option>
        <s-option value="none">None</s-option>
      </s-select>

      <s-heading>Tiers</s-heading>
      <div className={styles.tierTabs} role="tablist" aria-label="Reward tiers">
        {config.rewardTiers.map((t, index) => (
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
            Tier {index + 1}
            {t.enabled ? "" : " · off"}
          </button>
        ))}
      </div>

      {tier && (
        <div className={styles.tierCard} role="tabpanel">
          <s-stack direction="inline" gap="base">
            <strong>Tier {activeTier + 1}</strong>
            <s-switch
              label="Enabled"
              checked={tier.enabled}
              onChange={(e: Event) =>
                updateRewardTier(activeTier, {
                  enabled: (e.currentTarget as HTMLInputElement).checked,
                })
              }
            />
          </s-stack>

          <s-select
            label="Reward type"
            value={tier.rewardType || "custom"}
            onChange={(e: Event) =>
              updateRewardTier(activeTier, {
                rewardType: (e.currentTarget as HTMLSelectElement)
                  .value as RewardType,
              })
            }
          >
            <s-option value="shipping">Shipping</s-option>
            <s-option value="discount">Discount</s-option>
            <s-option value="product">Product</s-option>
            <s-option value="custom">Custom</s-option>
          </s-select>

          <s-number-field
            label={
              config.rewardCalcMode === "quantity"
                ? "Minimum quantity"
                : "Minimum amount"
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
            label="Reward description"
            value={tier.description}
            onChange={(e: Event) =>
              updateRewardTier(activeTier, {
                description: (e.currentTarget as HTMLInputElement).value,
              })
            }
          />
          <s-text-field
            label="Title before achieving (use [AMOUNT])"
            value={tier.titleBefore}
            onChange={(e: Event) =>
              updateRewardTier(activeTier, {
                titleBefore: (e.currentTarget as HTMLInputElement).value,
              })
            }
          />

          {tier.rewardType === "product" && (
            <>
              <s-heading>Product</s-heading>
              <s-paragraph>
                Pick a product for this milestone. When unlocked, shoppers can
                open it from the rewards strip.
              </s-paragraph>
              {tier.productTitle || tier.productHandle ? (
                <div className={styles.rewardProductRow}>
                  <div className={styles.rewardProductMeta}>
                    <strong>{tier.productTitle || "Selected product"}</strong>
                    <span>
                      {tier.productHandle
                        ? `/products/${tier.productHandle}`
                        : tier.productUrl || "No URL"}
                    </span>
                  </div>
                  <s-button variant="tertiary" onClick={pickProduct}>
                    Change
                  </s-button>
                  <s-button variant="tertiary" tone="critical" onClick={clearProduct}>
                    Remove
                  </s-button>
                </div>
              ) : (
                <s-button onClick={pickProduct}>+ Add product</s-button>
              )}
              <s-text-field
                label="Product title (optional override)"
                value={tier.productTitle || ""}
                onChange={(e: Event) =>
                  updateRewardTier(activeTier, {
                    productTitle: (e.currentTarget as HTMLInputElement).value,
                  })
                }
              />
              <s-text-field
                label="Product handle"
                value={tier.productHandle || ""}
                details="e.g. free-gift — used as /products/handle if URL is empty"
                onChange={(e: Event) =>
                  updateRewardTier(activeTier, {
                    productHandle: (e.currentTarget as HTMLInputElement).value,
                  })
                }
              />
              <s-text-field
                label="Product URL (optional)"
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
        config={config}
        updateConfig={updateConfig}
      />
    </s-stack>
  );
}
