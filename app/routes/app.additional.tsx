import type { HeadersFunction } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";

export default function HelpPage() {
  return (
    <s-page heading="Setup help">
      <s-banner tone="info" heading="Most issues are embed-related">
        The sticky bar only renders on product pages after the App embed is
        enabled and the theme is saved.
      </s-banner>

      <s-section heading="Sticky bar not showing?">
        <s-unordered-list>
          <s-list-item>
            Confirm the App embed is enabled and the theme was saved
          </s-list-item>
          <s-list-item>View a product page (not home or collection)</s-list-item>
          <s-list-item>
            Scroll past the threshold set in Style & layout (default 180px)
          </s-list-item>
          <s-list-item>
            If “Hide when main Add to cart is visible” is on, scroll past the
            product form
          </s-list-item>
          <s-list-item>
            In the app, click <strong>Save settings</strong> then hard-refresh
            the storefront
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

      <s-section heading="Branding still visible on Pro?">
        <s-paragraph>
          Upgrade to Pro, then click <strong>Sync storefront</strong> on Home and
          hard-refresh the product page.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
