import type { HeadersFunction } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";

export default function HelpPage() {
  return (
    <s-page heading="Setup help">
      <s-section heading="Sticky bar not showing?">
        <s-unordered-list>
          <s-list-item>
            Confirm the App embed is enabled and the theme was saved
          </s-list-item>
          <s-list-item>View a product page (not home or collection)</s-list-item>
          <s-list-item>Scroll down a little — the bar appears after scroll</s-list-item>
          <s-list-item>
            If “Hide when main Add to cart is visible” is on, scroll past the
            product form
          </s-list-item>
        </s-unordered-list>
      </s-section>
      <s-section heading="Variant / price tips">
        <s-paragraph>
          The bar uses the selected variant from the product form. If your theme
          uses a custom form, open an issue with the theme name so selectors can
          be extended.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
