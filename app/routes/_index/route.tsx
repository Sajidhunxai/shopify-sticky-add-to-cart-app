import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "react-router";
import { redirect, Form, Link, useLoaderData } from "react-router";

import { login } from "../../shopify.server";
import styles from "./styles.module.css";

const APP_STORE_URL = "https://apps.shopify.com/sticky-add-to-cart-14";
const DEMO_VIDEO_ID = "ApBgbYCQHZM";
const DEMO_THUMB = `https://img.youtube.com/vi/${DEMO_VIDEO_ID}/hqdefault.jpg`;

export const meta: MetaFunction = () => [
  { title: "Sticky Add to Cart for Shopify — Keep ATC visible while shoppers scroll" },
  {
    name: "description",
    content:
      "A customizable sticky Add to Cart bar for Shopify product pages. Install as a theme app embed — no code. Free plan available, Pro from $6.99/month.",
  },
  { property: "og:title", content: "Sticky Add to Cart for Shopify" },
  {
    property: "og:description",
    content:
      "Keep Add to cart in view on product pages. Mobile-friendly, theme-ready, and simple to install.",
  },
  { property: "og:image", content: DEMO_THUMB },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:image", content: DEMO_THUMB },
];

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  { rel: "preconnect", href: "https://www.youtube.com" },
  { rel: "canonical", href: "https://atc.appmarka.com/" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,560;9..144,700&family=Manrope:wght@400;500;600;700&display=swap",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function Landing() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <header className={styles.topbar}>
        <span className={styles.logoMark} aria-hidden="true" />
        <span className={styles.logo}>Sticky Add to Cart</span>
        <nav className={styles.nav} aria-label="Page">
          <a href="#demo">Demo</a>
          <a href="#pricing">Pricing</a>
          <a
            className={styles.navCta}
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Install on Shopify
          </a>
        </nav>
      </header>

      <main className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Shopify App Store</p>
          <h1 className={styles.brand}>Keep Add to cart in view while shoppers scroll.</h1>
          <p className={styles.lead}>
            A customizable sticky bar for Shopify product pages — product, price, and
            Add to cart stay reachable on mobile and desktop. Install as a theme app
            embed. No code edits.
          </p>

          <div className={styles.ctaRow}>
            <a
              className={styles.button}
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-conversion="install"
            >
              Install on Shopify
            </a>
            <a className={styles.buttonGhost} href="#demo">
              Watch demo
            </a>
          </div>
          <p className={styles.ctaNote}>Free plan available · 39-day Pro trial</p>
        </div>

        <div className={styles.stage} id="demo">
          <div className={styles.videoFrame}>
            <iframe
              className={styles.video}
              src={`https://www.youtube.com/embed/${DEMO_VIDEO_ID}?rel=0`}
              title="Sticky Add to Cart demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <p className={styles.videoCaption}>
            See the bar stay visible as shoppers scroll a product page.
          </p>
        </div>
      </main>

      <section className={styles.features} id="features">
        <article>
          <h2>Always visible CTA</h2>
          <p>The sticky bar follows the shopper so they never hunt for Add to cart again.</p>
        </article>
        <article>
          <h2>No theme code</h2>
          <p>Install as a Theme App Embed, then style colors and button copy from admin.</p>
        </article>
        <article>
          <h2>Product + variant info</h2>
          <p>Show image, title, price, and the selected variant in one compact bar.</p>
        </article>
      </section>

      <section className={styles.pricing} id="pricing">
        <h2>Simple pricing</h2>
        <p className={styles.pricingLead}>Start free. Upgrade when you want branding removed.</p>
        <div className={styles.pricingGrid}>
          <article className={styles.priceCard}>
            <h3>Free</h3>
            <p className={styles.price}>$0</p>
            <ul>
              <li>Sticky Add to cart bar</li>
              <li>Desktop and mobile</li>
              <li>Colors and button text</li>
              <li>Small branding label</li>
            </ul>
            <a
              className={styles.buttonGhost}
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Start free
            </a>
          </article>
          <article className={`${styles.priceCard} ${styles.priceCardFeatured}`}>
            <p className={styles.priceBadge}>Most stores</p>
            <h3>Pro</h3>
            <p className={styles.price}>
              $6.99<span>/month</span>
            </p>
            <ul>
              <li>Everything in Free</li>
              <li>No branding on the bar</li>
              <li>39-day free trial</li>
            </ul>
            <a
              className={styles.button}
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-conversion="install-pro"
            >
              Start Pro trial
            </a>
          </article>
        </div>
      </section>

      {showForm && (
        <section className={styles.existing} id="open-app">
          <h2>Already installed?</h2>
          <p>Open the app with your shop domain.</p>
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label} htmlFor="shop">
              Shop domain
            </label>
            <div className={styles.formRow}>
              <input
                id="shop"
                className={styles.input}
                type="text"
                name="shop"
                placeholder="your-store.myshopify.com"
                autoComplete="on"
                required
              />
              <button className={styles.button} type="submit">
                Open app
              </button>
            </div>
          </Form>
        </section>
      )}

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Sticky Add to Cart · Login solutions</p>
        <nav aria-label="Legal">
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
            Shopify App Store
          </a>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <a href="mailto:support@appmarka.com">Support</a>
        </nav>
      </footer>
    </div>
  );
}
