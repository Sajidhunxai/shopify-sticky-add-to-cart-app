import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "react-router";
import { redirect, Form, useLoaderData } from "react-router";

import { login } from "../../shopify.server";
import styles from "./styles.module.css";

export const meta: MetaFunction = () => [
  { title: "Sticky Add to Cart — Keep checkout one tap away" },
  {
    name: "description",
    content:
      "A sticky Add to cart bar for Shopify product pages. Mobile-first, theme-ready, and simple to install.",
  },
];

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
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
      </header>

      <main className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.brand}>Sticky Add to Cart</p>
          <h1 className={styles.heading}>Keep Add to cart in view while shoppers scroll.</h1>
          <p className={styles.lead}>
            A clean sticky bar for Shopify product pages — image, price, and CTA that stay
            reachable on mobile and desktop.
          </p>

          {showForm && (
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
          )}
        </div>

        <div className={styles.stage} aria-hidden="true">
          <div className={styles.device}>
            <div className={styles.deviceChrome}>
              <span />
              <span />
              <span />
            </div>
            <div className={styles.productCard}>
              <div className={styles.productImage} />
              <div>
                <p className={styles.productTitle}>Classic Canvas Sneaker</p>
                <p className={styles.productPrice}>$68.00</p>
              </div>
            </div>
            <div className={styles.scrollHint}>Scroll preview</div>
            <div className={styles.stickyBar}>
              <div className={styles.barThumb} />
              <div className={styles.barInfo}>
                <span>Classic Canvas Sneaker</span>
                <strong>$68.00</strong>
              </div>
              <button type="button" tabIndex={-1}>
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </main>

      <section className={styles.features}>
        <article>
          <h2>Always visible CTA</h2>
          <p>The sticky bar follows the shopper so they never hunt for Add to cart again.</p>
        </article>
        <article>
          <h2>Theme-friendly</h2>
          <p>Install as an App embed, then style colors, copy, and layout from your admin.</p>
        </article>
        <article>
          <h2>Built for conversion</h2>
          <p>Show image, title, and price — or keep it minimal with just the button.</p>
        </article>
      </section>
    </div>
  );
}
