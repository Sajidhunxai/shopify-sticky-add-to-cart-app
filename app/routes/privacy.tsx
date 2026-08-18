import type { MetaFunction } from "react-router";
import { Link } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Privacy policy — Sticky Add to Cart" },
  {
    name: "description",
    content: "How Sticky Add to Cart collects and uses store data.",
  },
];

export default function Privacy() {
  return (
    <main style={page}>
      <p>
        <Link to="/">← Sticky Add to Cart</Link>
      </p>
      <h1>Privacy policy</h1>
      <p>Last updated: August 18, 2026</p>
      <p>
        Sticky Add to Cart (“the app”), provided by Login solutions, is a Shopify
        application that adds a sticky Add to cart bar on product pages.
      </p>
      <h2>Data we access</h2>
      <p>
        The app uses Shopify session and authentication data so merchants can
        open the embedded admin and save settings. Depending on Shopify
        permissions, this may include the store owner’s name, email, phone, and
        address. We do not sell personal data.
      </p>
      <h2>How we use data</h2>
      <ul>
        <li>Authenticate the merchant and keep the app session</li>
        <li>Store bar settings (colors, copy, layout) for that shop</li>
        <li>Respond to Shopify GDPR webhooks (data request, redact)</li>
      </ul>
      <h2>Storage</h2>
      <p>
        Session and shop settings are stored in our database so the app can load
        after install. We retain this data while the app is installed and delete
        shop data when Shopify sends a shop/redact or uninstall webhook.
      </p>
      <h2>Contact</h2>
      <p>
        Questions: <a href="mailto:support@appmarka.com">support@appmarka.com</a>
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
