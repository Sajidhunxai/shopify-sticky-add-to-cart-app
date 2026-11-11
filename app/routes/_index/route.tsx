import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "react-router";
import { redirect, Form, Link, useLoaderData } from "react-router";

import { login } from "../../shopify.server";
import styles from "./styles.module.css";

const SITE_URL = "https://atc.appmarka.com";
const APP_STORE_URL = "https://apps.shopify.com/sticky-add-to-cart-14";
const LOGO_URL = `${SITE_URL}/logo.svg`;
const OG_IMAGE = `${SITE_URL}/docs/studio-overview.jpg`;
const DEMO_VIDEO_ID = "ApBgbYCQHZM";

const FEATURES = [
  {
    title: "Sticky Add to cart bar",
    body: "Product image, title, price, and ATC stay in view while shoppers scroll — especially on mobile.",
    href: "#feature-sticky-bar",
  },
  {
    title: "Cart drawer",
    body: "Optional slide-out cart with announcements, line items, checkout, and trust badges.",
    href: "#feature-drawer",
  },
  {
    title: "Tiered rewards",
    body: "Free shipping / gift milestones with progress fill, icons, colors, and custom HTML.",
    href: "#feature-rewards",
  },
  {
    title: "Recommendations",
    body: "Upsell from a collection or hand-picked products in empty and filled carts.",
    href: "#feature-recommendations",
  },
  {
    title: "Live admin preview",
    body: "Configure Design, Header, Rewards, and more with a live drawer preview before you save.",
    href: "#feature-studio",
  },
  {
    title: "Custom templates",
    body: "Optional HTML / CSS / JS per drawer block when you need full control.",
    href: "#feature-templates",
  },
] as const;

const FEATURE_DETAILS = [
  {
    id: "feature-sticky-bar",
    eyebrow: "Sticky bar",
    title: "Keep Add to cart visible while shoppers scroll",
    body: "On product pages the sticky bar pins product image, title, price, variants summary, and the Add to cart button so buyers never lose the buy action — especially on long mobile product pages.",
    bullets: [
      "Show or hide image, title, price, and button independently",
      "Match your brand with colors, radius, shadow, and optional theme fonts",
      "Control when it appears (scroll threshold, hide when main ATC is in view)",
      "Works on desktop and mobile with Pages & devices settings",
    ],
    image: "/docs/display-modes.jpg",
    imageAlt: "Sticky Add to Cart display modes including the sticky bar",
    docsHref: "/docs/design",
    docsLabel: "Design docs",
  },
  {
    id: "feature-drawer",
    eyebrow: "Cart drawer",
    title: "A conversion-focused cart that opens from the sticky bar",
    body: "Switch Display style to Sticky Cart + Drawer to open a slide-out cart instead of relying only on the theme cart. Add announcements, line controls, checkout, discounts, and trust copy in one place.",
    bullets: [
      "Header title, close control, and optional backdrop blur",
      "Line items with quantity steppers and remove actions",
      "Announcement strip with optional countdown timer",
      "Cart summary, discount field, and trust badges under checkout",
    ],
    image: "/docs/cart-drawer.jpg",
    imageAlt: "Sticky ATC cart drawer with announcement, rewards, and checkout",
    docsHref: "/docs/display",
    docsLabel: "Display style docs",
  },
  {
    id: "feature-rewards",
    eyebrow: "Tiered rewards",
    title: "Free shipping and gift milestones that push AOV up",
    body: "Show a live progress bar toward cart goals (spend amount or item quantity). Each tier has its own threshold, label, unlock message, reward type, and icon — including custom PNG icons from Shopify Files.",
    bullets: [
      "Multiple tiers: free shipping, discount, free product, or custom",
      "Progress fill, track colors, icon size/color, and message position",
      "Layouts such as line-in-middle or icons above the track",
      "Optional custom HTML template with Mustache placeholders for tiers",
    ],
    image: "/docs/rewards-bar.jpg",
    imageAlt: "Tiered rewards progress bar with milestone icons in the cart drawer",
    docsHref: "/docs/rewards",
    docsLabel: "Rewards docs",
  },
  {
    id: "feature-recommendations",
    eyebrow: "Recommendations",
    title: "Upsell in empty and filled carts",
    body: "Surface related products from a collection or hand-picked products so shoppers can add another item without leaving the drawer. Great for bundles, bestsellers, and “complete the look.”",
    bullets: [
      "Source from a collection or manual product picker",
      "Header copy, Add button label, and max products shown",
      "Show differently for empty cart vs items already in cart",
      "Optional entrance animation and custom tile HTML",
    ],
    image: "/docs/cart-drawer.jpg",
    imageAlt: "Cart drawer ready for product recommendations and upsells",
    docsHref: "/docs/recommendations",
    docsLabel: "Recommendations docs",
  },
  {
    id: "feature-studio",
    eyebrow: "Admin studio",
    title: "Configure everything with a live preview",
    body: "The Dashboard studio mirrors the storefront drawer: change Design, Header, Rewards, Recommendations, and more on the left, watch the preview update on the right, then Save settings to publish.",
    bullets: [
      "Left nav for Design, Display, Rewards, Templates, and more",
      "Preview updates as you edit supported settings",
      "Save settings syncs metafield config to the theme app embed",
      "Hard-refresh the storefront after save to confirm live changes",
    ],
    image: "/docs/studio-overview.jpg",
    imageAlt: "Sticky ATC admin studio with settings and live cart drawer preview",
    docsHref: "/docs/overview",
    docsLabel: "Overview docs",
  },
  {
    id: "feature-templates",
    eyebrow: "Custom HTML",
    title: "Go beyond defaults with per-feature templates",
    body: "When you need full control, enable custom HTML / CSS / JS for rewards, announcements, recommendations, and other drawer blocks. Use Mustache placeholders for cart data and tier loops.",
    bullets: [
      "Per-feature HTML, CSS, and JS editors in Templates",
      "Mustache support for {{variables}} and {{#tiers}} loops",
      "Keep required data attributes so timers and progress still work",
      "Preview-friendly defaults so you can iterate safely before save",
    ],
    image: "/docs/custom-html.jpg",
    imageAlt: "Custom HTML CSS JS template editor for Sticky ATC drawer features",
    docsHref: "/docs/templates",
    docsLabel: "Templates docs",
  },
] as const;

const FAQS = [
  {
    q: "How do I install Sticky Add to Cart?",
    a: "Install from the Shopify App Store, open the app, enable the Sticky ATC App embed in Online Store → Themes → Customize → App embeds, save the theme, then configure and Save settings in the Dashboard.",
  },
  {
    q: "Does it work with my theme?",
    a: "Yes for most Online Store 2.0 themes that support app embeds (including Dawn). Use Cart drawer mode and set your theme cart type to Page if you want Sticky ATC’s drawer instead of the theme drawer.",
  },
  {
    q: "What is included in Free vs Pro?",
    a: "Free includes the sticky bar with colors and copy on desktop and mobile, with a small branding label. Pro removes branding and includes a 39-day trial.",
  },
  {
    q: "Can I show free shipping progress in the cart?",
    a: "Yes. Switch Display style to Sticky Cart + Drawer, then open Tiered rewards to set milestones, icons, and progress bar design.",
  },
  {
    q: "Where are the docs?",
    a: "Read the full guides at atc.appmarka.com/docs or open Docs inside the app after install.",
  },
  {
    q: "The sticky bar is not showing — what should I check?",
    a: "Confirm the App embed is on and the theme is saved, view a product page, scroll past the visibility threshold, click Save settings in the app, then hard-refresh the storefront.",
  },
] as const;

export const meta: MetaFunction = () => [
  {
    title:
      "Sticky Add to Cart for Shopify — Sticky bar, cart drawer & rewards",
  },
  {
    name: "description",
    content:
      "Sticky Add to Cart for Shopify: sticky ATC bar, cart drawer, tiered free-shipping rewards, recommendations, and live preview. Theme app embed — no code. Free plan available.",
  },
  { name: "keywords", content: "Shopify sticky add to cart, cart drawer, free shipping bar, Shopify app embed, ATC bar" },
  { property: "og:site_name", content: "Sticky Add to Cart" },
  { property: "og:title", content: "Sticky Add to Cart for Shopify" },
  {
    property: "og:description",
    content:
      "Sticky ATC bar, cart drawer, tiered rewards, and recommendations. Install as a theme app embed.",
  },
  { property: "og:image", content: OG_IMAGE },
  { property: "og:image:alt", content: "Sticky Add to Cart admin studio and cart drawer" },
  { property: "og:url", content: `${SITE_URL}/` },
  { property: "og:type", content: "website" },
  { property: "og:logo", content: LOGO_URL },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Sticky Add to Cart for Shopify" },
  {
    name: "twitter:description",
    content:
      "Keep Add to cart visible. Optional cart drawer with rewards and recommendations.",
  },
  { name: "twitter:image", content: OG_IMAGE },
  { name: "twitter:image:alt", content: "Sticky Add to Cart" },
];

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  { rel: "preconnect", href: "https://www.youtube.com" },
  { rel: "canonical", href: `${SITE_URL}/` },
  { rel: "icon", href: "/logo.svg", type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: "/logo.jpg" },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Sticky Add to Cart",
      url: SITE_URL,
      logo: LOGO_URL,
      email: "support@appmarka.com",
      brand: { "@type": "Brand", name: "Sticky Add to Cart" },
      sameAs: [APP_STORE_URL],
    },
    {
      "@type": "WebSite",
      name: "Sticky Add to Cart",
      url: SITE_URL,
      publisher: { "@type": "Organization", name: "Sticky Add to Cart", logo: { "@type": "ImageObject", url: LOGO_URL } },
    },
    {
      "@type": "SoftwareApplication",
      name: "Sticky Add to Cart",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Shopify",
      url: SITE_URL,
      image: LOGO_URL,
      offers: [
        {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          name: "Free",
        },
        {
          "@type": "Offer",
          price: "6.99",
          priceCurrency: "USD",
          name: "Pro",
        },
      ],
      description:
        "Sticky Add to cart bar and cart drawer for Shopify with tiered rewards and recommendations.",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function Landing() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.glow} aria-hidden="true" />
      <header className={styles.topbar}>
        <Link to="/" className={styles.brandLink} aria-label="Sticky Add to Cart home">
          <img
            className={styles.logoImg}
            src="/logo.svg"
            width={32}
            height={32}
            alt="Sticky Add to Cart logo"
          />
          <span className={styles.logo}>Sticky Add to Cart</span>
        </Link>
        <nav className={styles.nav} aria-label="Page">
          <a href="#features">Features</a>
          <a href="#demo">Demo</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <Link to="/docs">Docs</Link>
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
          <h1 className={styles.brand}>
            Keep Add to cart in view — and turn the cart into a conversion drawer.
          </h1>
          <p className={styles.lead}>
            Sticky Add to Cart adds a customizable sticky ATC bar on product pages,
            plus an optional cart drawer with tiered rewards, recommendations,
            announcements, and discounts. Theme app embed. No code edits.
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
            <Link className={styles.buttonGhost} to="/docs">
              Read docs
            </Link>
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
            See the sticky bar and cart drawer stay useful as shoppers scroll.
          </p>
        </div>
      </main>

      <section className={styles.sectionIntro} id="features" aria-labelledby="features-heading">
        <h2 id="features-heading">Features built for Shopify product pages</h2>
        <p className={styles.sectionLead}>
          Everything you configure in the Dashboard studio syncs to your storefront
          after Save settings. Jump to a detailed section below.
        </p>
        <div className={styles.features}>
          {FEATURES.map((feature) => (
            <a key={feature.title} className={styles.featureCard} href={feature.href}>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </a>
          ))}
        </div>
      </section>

      <div className={styles.featureDetails} aria-label="Feature details">
        {FEATURE_DETAILS.map((feature, index) => (
          <section
            key={feature.id}
            id={feature.id}
            className={`${styles.featureDetail} ${
              index % 2 === 1 ? styles.featureDetailReverse : ""
            }`}
            aria-labelledby={`${feature.id}-heading`}
          >
            <div className={styles.featureDetailCopy}>
              <p className={styles.featureEyebrow}>{feature.eyebrow}</p>
              <h2 id={`${feature.id}-heading`}>{feature.title}</h2>
              <p className={styles.featureDetailBody}>{feature.body}</p>
              <ul className={styles.featureBullets}>
                {feature.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <p className={styles.inlineLinks}>
                <Link to={feature.docsHref}>{feature.docsLabel}</Link>
                {" · "}
                <a href="#features">Back to features</a>
              </p>
            </div>
            <figure className={styles.featureDetailMedia}>
              <img
                src={feature.image}
                alt={feature.imageAlt}
                width={960}
                height={640}
                loading="lazy"
              />
            </figure>
          </section>
        ))}
      </div>

      <section className={styles.sectionIntro} id="how-it-works" aria-labelledby="how-heading">
        <h2 id="how-heading">How it works</h2>
        <ol className={styles.steps}>
          <li>
            <strong>Install</strong> from the Shopify App Store and open the app.
          </li>
          <li>
            <strong>Enable</strong> the Sticky ATC App embed in your theme, then Save.
          </li>
          <li>
            <strong>Configure</strong> Design, Display style, Rewards, and more with live preview.
          </li>
          <li>
            <strong>Save settings</strong> and hard-refresh a product page to go live.
          </li>
        </ol>
        <p className={styles.inlineLinks}>
          Full walkthrough in the{" "}
          <Link to="/docs/getting-started">Getting started guide</Link>.
        </p>
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

      <section className={styles.faq} id="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading">Frequently asked questions</h2>
        <div className={styles.faqList}>
          {FAQS.map((item) => (
            <details key={item.q} className={styles.faqItem}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <p className={styles.inlineLinks}>
          More answers in the{" "}
          <Link to="/docs/faq">docs FAQ</Link>
          {" · "}
          <Link to="/docs/troubleshooting">Troubleshooting</Link>
          {" · "}
          <Link to="/docs">full documentation</Link>.
        </p>
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
        <div className={styles.footerBrand}>
          <img src="/logo.svg" width={28} height={28} alt="" />
          <p>© {new Date().getFullYear()} Sticky Add to Cart · Login solutions</p>
        </div>
        <nav aria-label="Legal">
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
            Shopify App Store
          </a>
          <Link to="/docs">Docs</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <a href="mailto:support@appmarka.com">Support</a>
        </nav>
      </footer>
    </div>
  );
}
