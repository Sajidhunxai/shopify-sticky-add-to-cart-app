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
          <s-list-item>View a product page (enable Collection/Home only if needed)</s-list-item>
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

      <s-section heading="Use Sticky ATC cart drawer (not the theme drawer)">
        <s-paragraph>
          Many themes open their own cart drawer when shoppers click the cart
          icon. Follow these steps to use Sticky ATC’s drawer instead.
        </s-paragraph>

        <s-heading>1. Turn on Sticky ATC Cart drawer</s-heading>
        <s-unordered-list>
          <s-list-item>
            Open the app → left menu → <strong>Display style</strong>
          </s-list-item>
          <s-list-item>
            Choose <strong>Cart drawer</strong> (Sticky Cart + Drawer)
          </s-list-item>
          <s-list-item>
            Optional: set <strong>Cart summary → After adding to cart</strong> so
            the drawer opens after Add to cart
          </s-list-item>
          <s-list-item>
            Click <strong>Save settings</strong>
          </s-list-item>
        </s-unordered-list>

        <s-heading>2. Disable the theme’s default cart drawer</s-heading>
        <s-unordered-list>
          <s-list-item>
            Go to <strong>Online Store → Themes → Customize</strong>
          </s-list-item>
          <s-list-item>
            Open <strong>Theme settings</strong> (gear icon)
          </s-list-item>
          <s-list-item>
            Find <strong>Cart</strong> (Dawn) or a similar Cart section
          </s-list-item>
          <s-list-item>
            Set <strong>Cart type</strong> to <strong>Page</strong> (not Drawer /
            Popup)
          </s-list-item>
          <s-list-item>Save the theme</s-list-item>
        </s-unordered-list>

        <s-heading>3. Test on the storefront</s-heading>
        <s-unordered-list>
          <s-list-item>Hard-refresh a product page (Ctrl+Shift+R)</s-list-item>
          <s-list-item>
            Click the header cart icon — Sticky ATC’s drawer should open
          </s-list-item>
          <s-list-item>
            Add a product from the sticky bar — the same drawer should open
          </s-list-item>
        </s-unordered-list>

        <s-banner tone="warning" heading="Theme drawer still appears?">
          Some themes hide Cart type or use a custom drawer app. Turn off any
          other cart-drawer apps, or ask your theme support how to switch cart to
          “page” mode. Sticky ATC intercepts common cart-icon clicks when Cart
          drawer mode is enabled.
        </s-banner>
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
