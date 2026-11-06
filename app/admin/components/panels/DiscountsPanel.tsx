import type { PanelProps } from "../../types";

export function DiscountsPanel({ config, updateConfig }: PanelProps) {
  return (
    <s-stack gap="base">
      <s-switch
        label="Show discount code field"
        checked={config.discountEnabled}
        onChange={(e: Event) =>
          updateConfig(
            "discountEnabled",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />
      <s-text-field
        label="Input placeholder"
        value={config.discountPlaceholder}
        onChange={(e: Event) =>
          updateConfig(
            "discountPlaceholder",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-text-field
        label="Apply button text"
        value={config.discountButtonText}
        onChange={(e: Event) =>
          updateConfig(
            "discountButtonText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-paragraph>
        Applying a code sends shoppers through Shopify’s discount URL, then they
        can return to checkout.
      </s-paragraph>
    </s-stack>
  );
}
