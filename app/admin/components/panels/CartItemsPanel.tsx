import styles from "../../../styles/dashboard.module.css";
import { FeatureCustomTemplate } from "../FeatureCustomTemplate";
import type { PanelProps } from "../../types";

export function CartItemsPanel({ config, updateConfig }: PanelProps) {
  return (
    <s-stack gap="base">
      <s-heading>Sticky bar (product page)</s-heading>
      <s-paragraph>
        These options control the sticky Add to cart bar, not the cart drawer
        lines.
      </s-paragraph>
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

      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-number-field
          label="Sticky bar image size"
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
          label="Sticky bar content gap"
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

      <s-heading>Cart drawer line items</s-heading>
      <s-paragraph>
        Layout and controls for products already in the cart drawer. Uncheck
        “Show empty cart” in the preview to see sample lines.
      </s-paragraph>

      <div className={styles.toggleRow}>
        <s-switch
          label="Show product image"
          checked={config.cartLineShowImage}
          onChange={(e: Event) =>
            updateConfig(
              "cartLineShowImage",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Show product title"
          checked={config.cartLineShowTitle}
          onChange={(e: Event) =>
            updateConfig(
              "cartLineShowTitle",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Show price"
          checked={config.cartLineShowPrice}
          onChange={(e: Event) =>
            updateConfig(
              "cartLineShowPrice",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Show variant / options"
          checked={config.cartLineShowVariant}
          onChange={(e: Event) =>
            updateConfig(
              "cartLineShowVariant",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
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
          label="Show remove control"
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
          label="Line image size"
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
          label="Image corner radius"
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
          label="Title size"
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
          label="Price size"
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
          label="Content gap"
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

      <s-heading>Quantity control</s-heading>
      <s-select
        label="Quantity style"
        value={config.cartLineQtyStyle}
        onChange={(e: Event) => {
          const value = (e.currentTarget as HTMLSelectElement).value;
          updateConfig(
            "cartLineQtyStyle",
            value === "plain" ? "plain" : "stepper",
          );
        }}
      >
        <s-option value="stepper">Stepper (− / +)</s-option>
        <s-option value="plain">Plain text (Qty 1)</s-option>
      </s-select>
      <s-select
        label="Quantity size"
        value={config.cartLineQtySize}
        onChange={(e: Event) => {
          const value = (e.currentTarget as HTMLSelectElement).value;
          updateConfig(
            "cartLineQtySize",
            value === "small" || value === "large" ? value : "medium",
          );
        }}
      >
        <s-option value="small">Small</s-option>
        <s-option value="medium">Medium</s-option>
        <s-option value="large">Large</s-option>
      </s-select>

      <s-heading>Remove control</s-heading>
      <s-select
        label="Remove style"
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
        <s-option value="x">× icon</s-option>
        <s-option value="delete">Delete text</s-option>
        <s-option value="remove">Remove text</s-option>
        <s-option value="trash">Trash icon</s-option>
      </s-select>
      <s-select
        label="Remove size"
        value={config.cartLineRemoveSize}
        onChange={(e: Event) => {
          const value = (e.currentTarget as HTMLSelectElement).value;
          updateConfig(
            "cartLineRemoveSize",
            value === "small" || value === "large" ? value : "medium",
          );
        }}
      >
        <s-option value="small">Small</s-option>
        <s-option value="medium">Medium</s-option>
        <s-option value="large">Large</s-option>
      </s-select>

      <FeatureCustomTemplate
        featureKey="cartItem"
        config={config}
        updateConfig={updateConfig}
        title="Custom cart line template"
      />
    </s-stack>
  );
}
