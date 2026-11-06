import type { BarConfig } from "../../../models/bar-config";
import type { PanelProps } from "../../types";

export function CartSummaryPanel({ config, updateConfig }: PanelProps) {
  return (
    <s-stack gap="base">
      <s-select
        label="After adding to cart"
        value={config.afterAdd}
        onChange={(e: Event) =>
          updateConfig(
            "afterAdd",
            (e.currentTarget as HTMLSelectElement)
              .value as BarConfig["afterAdd"],
          )
        }
      >
        <s-option value="stay">Stay on page</s-option>
        <s-option value="cart">Go to cart</s-option>
        <s-option value="drawer">Open cart drawer (if supported)</s-option>
      </s-select>
      <s-text-field
        label="Checkout button text"
        value={config.drawerCheckoutText}
        onChange={(e: Event) =>
          updateConfig(
            "drawerCheckoutText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-paragraph>
        Tip: set <strong>Display style → Cart drawer</strong> (required). “Open
        cart drawer” then opens Sticky ATC’s drawer. Also set the theme Cart
        type to <strong>Page</strong> so the header bag does not jump to /cart.
      </s-paragraph>
    </s-stack>
  );
}
