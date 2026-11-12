import styles from "../../../styles/dashboard.module.css";
import { usePanelState } from "../../hooks/usePanelState";
import { colorFromEvent } from "../../fields/color";
import { FeatureCustomTemplate } from "../FeatureCustomTemplate";

export function CartItemsPanel() {
  const { config, updateConfig, t } = usePanelState();
  return (
    <s-stack gap="base">
      <s-heading>{t("cartItems.stickyHeading")}</s-heading>
      <s-paragraph>{t("cartItems.stickyHelp")}</s-paragraph>
      <div className={styles.toggleRow}>
        <s-switch
          label={t("cartItems.enableSticky")}
          checked={config.enabled}
          onChange={(e: Event) =>
            updateConfig(
              "enabled",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("cartItems.showImage")}
          checked={config.showImage}
          onChange={(e: Event) =>
            updateConfig(
              "showImage",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("cartItems.showTitle")}
          checked={config.showTitle}
          onChange={(e: Event) =>
            updateConfig(
              "showTitle",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("cartItems.showPrice")}
          checked={config.showPrice}
          onChange={(e: Event) =>
            updateConfig(
              "showPrice",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("cartItems.showQtyBar")}
          checked={config.showQuantity}
          onChange={(e: Event) =>
            updateConfig(
              "showQuantity",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
      </div>

      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-number-field
          label={t("cartItems.barImageSize")}
          value={String(config.imageSize)}
          min={32}
          max={120}
          onChange={(e: Event) =>
            updateConfig(
              "imageSize",
              Math.min(
                120,
                Math.max(
                  32,
                  Number((e.currentTarget as HTMLInputElement).value) || 64,
                ),
              ),
            )
          }
        />
        <s-number-field
          label={t("cartItems.barGap")}
          value={String(config.contentGap)}
          min={4}
          max={32}
          onChange={(e: Event) =>
            updateConfig(
              "contentGap",
              Math.min(
                32,
                Math.max(
                  4,
                  Number((e.currentTarget as HTMLInputElement).value) || 12,
                ),
              ),
            )
          }
        />
      </s-grid>

      <s-heading>{t("cartItems.drawerHeading")}</s-heading>
      <s-paragraph>{t("cartItems.drawerHelp")}</s-paragraph>

      <div className={styles.toggleRow}>
        <s-switch
          label={t("cartItems.showImage")}
          checked={config.cartLineShowImage}
          onChange={(e: Event) =>
            updateConfig(
              "cartLineShowImage",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("cartItems.showTitle")}
          checked={config.cartLineShowTitle}
          onChange={(e: Event) =>
            updateConfig(
              "cartLineShowTitle",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("cartItems.showPrice")}
          checked={config.cartLineShowPrice}
          onChange={(e: Event) =>
            updateConfig(
              "cartLineShowPrice",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("cartItems.showVariant")}
          checked={config.cartLineShowVariant}
          onChange={(e: Event) =>
            updateConfig(
              "cartLineShowVariant",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("cartItems.showLineQty")}
          checked={config.cartLineQtyEnabled}
          onChange={(e: Event) =>
            updateConfig(
              "cartLineQtyEnabled",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("cartItems.showRemove")}
          checked={config.cartLineRemoveEnabled}
          onChange={(e: Event) =>
            updateConfig(
              "cartLineRemoveEnabled",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
      </div>

      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-number-field
          label={t("cartItems.lineImageSize")}
          value={String(config.cartLineImageSize)}
          min={32}
          max={120}
          onChange={(e: Event) =>
            updateConfig(
              "cartLineImageSize",
              Math.min(
                120,
                Math.max(
                  32,
                  Number((e.currentTarget as HTMLInputElement).value) || 56,
                ),
              ),
            )
          }
        />
        <s-number-field
          label={t("cartItems.imageRadius")}
          value={String(config.cartLineImageRadius)}
          min={0}
          max={40}
          onChange={(e: Event) =>
            updateConfig(
              "cartLineImageRadius",
              Math.min(
                40,
                Math.max(
                  0,
                  Number((e.currentTarget as HTMLInputElement).value) || 0,
                ),
              ),
            )
          }
        />
        <s-number-field
          label={t("cartItems.titleSize")}
          value={String(config.cartLineTitleSize)}
          min={10}
          max={22}
          onChange={(e: Event) =>
            updateConfig(
              "cartLineTitleSize",
              Math.min(
                22,
                Math.max(
                  10,
                  Number((e.currentTarget as HTMLInputElement).value) || 14,
                ),
              ),
            )
          }
        />
        <s-number-field
          label={t("cartItems.priceSize")}
          value={String(config.cartLinePriceSize)}
          min={10}
          max={22}
          onChange={(e: Event) =>
            updateConfig(
              "cartLinePriceSize",
              Math.min(
                22,
                Math.max(
                  10,
                  Number((e.currentTarget as HTMLInputElement).value) || 14,
                ),
              ),
            )
          }
        />
        <s-number-field
          label={t("cartItems.contentGap")}
          value={String(config.cartLineGap)}
          min={4}
          max={28}
          onChange={(e: Event) =>
            updateConfig(
              "cartLineGap",
              Math.min(
                28,
                Math.max(
                  4,
                  Number((e.currentTarget as HTMLInputElement).value) || 12,
                ),
              ),
            )
          }
        />
      </s-grid>

      <s-heading>{t("cartItems.qtyHeading")}</s-heading>
      <s-select
        label={t("cartItems.qtyStyle")}
        value={config.cartLineQtyStyle}
        onChange={(e: Event) => {
          const value = (e.currentTarget as HTMLSelectElement).value;
          updateConfig(
            "cartLineQtyStyle",
            value === "plain" ? "plain" : "stepper",
          );
        }}
      >
        <s-option value="stepper">{t("cartItems.qtyStepper")}</s-option>
        <s-option value="plain">{t("cartItems.qtyPlain")}</s-option>
      </s-select>
      <s-select
        label={t("cartItems.qtySize")}
        value={config.cartLineQtySize}
        onChange={(e: Event) => {
          const value = (e.currentTarget as HTMLSelectElement).value;
          updateConfig(
            "cartLineQtySize",
            value === "small" || value === "large" ? value : "medium",
          );
        }}
      >
        <s-option value="small">{t("common.small")}</s-option>
        <s-option value="medium">{t("common.medium")}</s-option>
        <s-option value="large">{t("common.large")}</s-option>
      </s-select>

      <s-heading>{t("cartItems.removeHeading")}</s-heading>
      <s-select
        label={t("cartItems.removeStyle")}
        value={config.cartLineRemoveStyle}
        onChange={(e: Event) => {
          const value = (e.currentTarget as HTMLSelectElement).value;
          updateConfig(
            "cartLineRemoveStyle",
            value === "delete" || value === "remove" || value === "trash"
              ? value
              : "x",
          );
        }}
      >
        <s-option value="x">{t("cartItems.removeX")}</s-option>
        <s-option value="delete">{t("cartItems.removeDelete")}</s-option>
        <s-option value="remove">{t("cartItems.removeRemove")}</s-option>
        <s-option value="trash">{t("cartItems.removeTrash")}</s-option>
      </s-select>
      <s-select
        label={t("cartItems.removeSize")}
        value={config.cartLineRemoveSize}
        onChange={(e: Event) => {
          const value = (e.currentTarget as HTMLSelectElement).value;
          updateConfig(
            "cartLineRemoveSize",
            value === "small" || value === "large" ? value : "medium",
          );
        }}
      >
        <s-option value="small">{t("common.small")}</s-option>
        <s-option value="medium">{t("common.medium")}</s-option>
        <s-option value="large">{t("common.large")}</s-option>
      </s-select>

      <s-heading>{t("cartItems.colorsHeading")}</s-heading>
      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-color-field
          label={t("cartItems.lineBg")}
          value={
            config.cartLineBg === "transparent" ? "#ffffff" : config.cartLineBg
          }
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("cartLineBg", value);
          }}
        />
        <s-color-field
          label={t("cartItems.lineText")}
          value={config.cartLineTextColor || config.textColor || "#111111"}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("cartLineTextColor", value);
          }}
        />
        <s-color-field
          label={t("cartItems.lineBorder")}
          value={
            config.cartLineBorderColor.startsWith("#")
              ? config.cartLineBorderColor
              : "#e5e7eb"
          }
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("cartLineBorderColor", value);
          }}
        />
        <s-color-field
          label={t("cartItems.qtyBg")}
          value={
            config.cartLineQtyBg === "transparent"
              ? "#ffffff"
              : config.cartLineQtyBg
          }
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("cartLineQtyBg", value);
          }}
        />
        <s-color-field
          label={t("cartItems.qtyText")}
          value={
            config.cartLineQtyText ||
            config.cartLineTextColor ||
            config.textColor ||
            "#111111"
          }
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("cartLineQtyText", value);
          }}
        />
        <s-color-field
          label={t("cartItems.removeColor")}
          value={
            config.cartLineRemoveColor ||
            config.cartLineTextColor ||
            config.textColor ||
            "#111111"
          }
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("cartLineRemoveColor", value);
          }}
        />
      </s-grid>
      <s-paragraph>{t("cartItems.colorsTip")}</s-paragraph>

      <FeatureCustomTemplate
        featureKey="cartItem"
        title={t("cartItems.customHtml")}
      />
      <s-paragraph>{t("cartItems.customHtmlHelp")}</s-paragraph>
    </s-stack>
  );
}
