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
  { title: "Sticky bar", href: "#feature-sticky-bar" },
  { title: "Cart drawer", href: "#feature-drawer" },
  { title: "Rewards", href: "#feature-rewards" },
  { title: "Recommendations", href: "#feature-recommendations" },
  { title: "Live studio", href: "#feature-studio" },
  { title: "Templates", href: "#feature-templates" },
] as const;

const FEATURE_DETAILS = [
  {
    id: "feature-sticky-bar",
    eyebrow: "01 · Sticky bar",
    title: "Keep Add to cart visible while shoppers scroll",
    body: "Pin product image, title, price, and the ATC button on long product pages so buyers never lose the buy action — especially on mobile.",
    bullets: [
      "Toggle image, title, price, and button",
      "Brand colors, radius, shadow, theme fonts",
      "Scroll threshold and hide-when-visible rules",
      "Desktop and mobile page targeting",
    ],
    image: "/docs/display-modes.jpg",
    imageAlt: "Display mode options for the sticky Add to cart bar",
    imageFocus: "center top",
    docsHref: "/docs/design",
    docsLabel: "Design docs",
  },
  {
    id: "feature-drawer",
    eyebrow: "02 · Cart drawer",
    title: "A conversion cart that opens from the sticky bar",
    body: "Use Sticky Cart + Drawer for a slide-out cart with announcements, line controls, checkout, discounts, and trust copy — without editing theme code.",
    bullets: [
      "Header, close control, optional backdrop blur",
      "Quantity steppers and remove actions",
      "Announcement strip with countdown",
      "Summary, discount field, trust badges",
    ],
    image: "/docs/cart-drawer.jpg",
    imageAlt: "Cart drawer with rewards progress and checkout",
    imageFocus: "right center",
    docsHref: "/docs/display",
    docsLabel: "Display docs",
  },
  {
    id: "feature-rewards",
    eyebrow: "03 · Tiered rewards",
    title: "Milestones that push average order value up",
    body: "Show live progress toward free shipping, discounts, or gifts. Each tier has its own threshold, message, reward type, and icon — including custom PNGs.",
    bullets: [
      "Goals by cart total or quantity",
      "Shipping, discount, product, or custom rewards",
      "Progress colors, icon size, message position",
      "Optional Mustache HTML for full control",
    ],
    image: "/docs/rewards-bar.jpg",
    imageAlt: "Tiered rewards progress bar with milestone icons",
    imageFocus: "center center",
    docsHref: "/docs/rewards",
    docsLabel: "Rewards docs",
  },
  {
    id: "feature-recommendations",
    eyebrow: "04 · Recommendations",
    title: "Upsell in empty and filled carts",
    body: "Suggest related products from a collection or hand-picked list so shoppers can add another item without leaving the drawer.",
    bullets: [
      "Collection or manual product source",
      "Separate empty vs filled cart copy",
      "Max products, labels, optional Shop now",
      "Entrance animation and custom tile HTML",
    ],
    image: "/docs/theme-embed.jpg",
    imageAlt: "Theme app embed setup that powers storefront recommendations",
    imageFocus: "center top",
    docsHref: "/docs/recommendations",
    docsLabel: "Recommendations docs",
    mock: "recs" as const,
  },
  {
    id: "feature-studio",
    eyebrow: "05 · Admin studio",
    title: "Configure with a live preview, then save",
    body: "Edit Design, Header, Rewards, and more on the left while the drawer preview updates on the right. Save settings to sync the storefront.",
    bullets: [
      "Studio nav for every drawer block",
      "Preview updates as you configure",
      "One Save publishes to the theme embed",
      "Hard-refresh to confirm live changes",
    ],
    image: "/docs/studio-overview.jpg",
    imageAlt: "Admin studio with settings and live drawer preview",
    imageFocus: "left top",
    docsHref: "/docs/overview",
    docsLabel: "Overview docs",
  },
  {
    id: "feature-templates",
    eyebrow: "06 · Custom templates",
    title: "Go beyond defaults when you need to",
    body: "Enable HTML / CSS / JS per drawer feature. Use Mustache placeholders for cart data and tier loops while keeping progress and timers working.",
    bullets: [
      "Per-feature HTML, CSS, and JS editors",
      "{{variables}} and {{#tiers}} loops",
      "Required data attributes stay intact",
      "Safe iteration in preview before save",
    ],
    image: "/docs/custom-html.jpg",
    imageAlt: "Custom HTML CSS JS template editor",
    imageFocus: "center top",
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
        <h2 id="features-heading">Built for Shopify product pages</h2>
        <p className={styles.sectionLead}>
          Sticky bar, cart drawer, rewards, and upsells — configured in the studio,
          published with Save settings.
        </p>
        <div className={styles.featureJump}>
          {FEATURES.map((feature) => (
            <a key={feature.title} href={feature.href}>
              {feature.title}
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
              <Link className={styles.featureDocLink} to={feature.docsHref}>
                {feature.docsLabel} →
              </Link>
            </div>
            <figure className={styles.featureDetailMedia}>
              {"mock" in feature && feature.mock === "recs" ? (
                <div className={styles.recsMock} aria-hidden="true">
                  <p className={styles.recsMockTitle}>You may also like</p>
                  <div className={styles.recsMockRow}>
                    <div className={styles.recsMockCard}>
                      <span className={styles.recsMockThumb} />
                      <span>Linen tote</span>
                      <strong>$28</strong>
                      <em>Add</em>
                    </div>
                    <div className={styles.recsMockCard}>
                      <span className={styles.recsMockThumb} />
                      <span>Canvas pouch</span>
                      <strong>$18</strong>
                      <em>Add</em>
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={feature.image}
                  alt={feature.imageAlt}
                  width={960}
                  height={640}
                  loading="lazy"
                  style={{ objectPosition: feature.imageFocus }}
                />
              )}
            </figure>
          </section>
        ))}
      </div>

      <section className={styles.sectionIntro} id="how-it-works" aria-labelledby="how-heading">
        <h2 id="how-heading">How it works</h2>
        <p className={styles.sectionLead}>
          Live in minutes with a theme app embed — no theme code edits.
        </p>
        <ol className={styles.steps}>
          <li>
            <span className={styles.stepNum}>1</span>
            <div>
              <strong>Install</strong>
              <p>Get the app from the Shopify App Store and open the Dashboard.</p>
            </div>
          </li>
          <li>
            <span className={styles.stepNum}>2</span>
            <div>
              <strong>Enable embed</strong>
              <p>Turn on Sticky ATC in Theme → App embeds, then Save the theme.</p>
            </div>
          </li>
          <li>
            <span className={styles.stepNum}>3</span>
            <div>
              <strong>Configure</strong>
              <p>Set Design, Display style, Rewards, and more with live preview.</p>
            </div>
          </li>
          <li>
            <span className={styles.stepNum}>4</span>
            <div>
              <strong>Go live</strong>
              <p>Click Save settings and hard-refresh a product page.</p>
            </div>
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
