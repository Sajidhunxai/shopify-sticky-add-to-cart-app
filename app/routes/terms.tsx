import type { MetaFunction } from "react-router";
import { Link } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Terms of service — Sticky Add to Cart" },
  {
    name: "description",
    content: "Terms for using the Sticky Add to Cart Shopify app.",
  },
];

export default function Terms() {
  return (
    <main style={page}>
      <p>
        <Link to="/">← Sticky Add to Cart</Link>
      </p>
      <h1>Terms of service</h1>
      <p>Last updated: August 18, 2026</p>
      <p>
        By installing Sticky Add to Cart from the{" "}
        <a href="https://apps.shopify.com/sticky-add-to-cart-14">
          Shopify App Store
        </a>
        , you agree to these terms and Shopify’s Partner and App Store terms.
      </p>
      <h2>The service</h2>
      <p>
        The app provides a sticky Add to cart bar on Shopify product pages via a
        Theme App Embed. Features may change. Free and paid plans are described
        on the App Store listing.
      </p>
      <h2>Billing</h2>
      <p>
        Paid plans are billed through Shopify. Trials and prices shown on the
        App Store apply. Cancel anytime from your Shopify admin.
      </p>
      <h2>Limitation</h2>
      <p>
        The app is provided as-is. We are not liable for lost sales or theme
        conflicts beyond reasonable support.
      </p>
      <h2>Contact</h2>
      <p>
        <a href="mailto:support@appmarka.com">support@appmarka.com</a>
      </p>
    </main>
  );
}

const page = {
  maxWidth: 720,
  margin: "0 auto",
  padding: "2rem 1.25rem 4rem",
  fontFamily: "Manrope, Segoe UI, sans-serif",
  lineHeight: 1.6,
  color: "#13212b",
};
