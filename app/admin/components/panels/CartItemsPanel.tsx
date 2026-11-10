import styles from "../../../styles/dashboard.module.css";
import { FeatureCustomTemplate } from "../FeatureCustomTemplate";
import type { PanelProps } from "../../types";

export function CartItemsPanel({ config, updateConfig }: PanelProps) {
  return (
    <s-stack gap="base">
      <div className={styles.toggleRow}>
        <s-switch
          label="Enable sticky bar"
          checked={config.enabled}
          onChange={(e: Event) =>
            updateConfig(
              "enabled",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Show product image"
          checked={config.showImage}
          onChange={(e: Event) =>
            updateConfig(
              "showImage",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Show product title"
          checked={config.showTitle}
          onChange={(e: Event) =>
            updateConfig(
              "showTitle",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Show price"
          checked={config.showPrice}
          onChange={(e: Event) =>
            updateConfig(
              "showPrice",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Show quantity selector on sticky bar"
          checked={config.showQuantity}
          onChange={(e: Event) =>
            updateConfig(
              "showQuantity",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
      </div>

      <s-heading>Cart drawer line items</s-heading>
      <s-paragraph>
        Controls for products already in the cart drawer.
      </s-paragraph>
      <div className={styles.toggleRow}>
        <s-switch
          label="Show quantity +/- on cart lines"
          checked={config.cartLineQtyEnabled}
          onChange={(e: Event) =>
            updateConfig(
              "cartLineQtyEnabled",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Show remove (×) on cart lines"
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
          label="Image size"
          value={String(config.imageSize)}
          min={32}
          max={120}
          onChange={(e: Event) =>
            updateConfig(
              "imageSize",
              Number((e.currentTarget as HTMLInputElement).value),
            )
          }
        />
        <s-number-field
          label="Content gap"
          value={String(config.contentGap)}
          min={4}
          max={32}
          onChange={(e: Event) =>
            updateConfig(
              "contentGap",
              Number((e.currentTarget as HTMLInputElement).value),
            )
          }
        />
      </s-grid>

      <FeatureCustomTemplate
        featureKey="cartItem"
        config={config}
        updateConfig={updateConfig}
        title="Custom cart line template"
      />
    </s-stack>
  );
}
