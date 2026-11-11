import type { LinksFunction, MetaFunction } from "react-router";
import { Link, Outlet, useLocation } from "react-router";
import { DocsSidebar } from "../docs/DocsSidebar";
import styles from "../styles/docs.module.css";

const SITE_URL = "https://atc.appmarka.com";
const LOGO_URL = `${SITE_URL}/logo.svg`;

export const meta: MetaFunction = () => [
  { title: "Documentation — Sticky Add to Cart" },
  {
    name: "description",
    content:
      "Guides for Sticky Add to Cart: design, rewards, drawer, templates, and setup.",
  },
  { property: "og:site_name", content: "Sticky Add to Cart" },
  { property: "og:title", content: "Documentation — Sticky Add to Cart" },
  {
    property: "og:description",
    content:
      "Setup, rewards, cart drawer, templates, and troubleshooting for Sticky ATC.",
  },
  { property: "og:image", content: LOGO_URL },
  { property: "og:logo", content: LOGO_URL },
  { property: "og:url", content: `${SITE_URL}/docs` },
  { name: "twitter:card", content: "summary" },
  { name: "twitter:image", content: LOGO_URL },
];

export const links: LinksFunction = () => [
  { rel: "canonical", href: `${SITE_URL}/docs` },
  { rel: "icon", href: "/logo.svg", type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: "/logo.jpg" },
];

function activeSlugFromPath(pathname: string): string {
  const parts = pathname.replace(/\/+$/, "").split("/");
  const last = parts[parts.length - 1] || "overview";
  return last === "docs" ? "overview" : last;
}

export default function PublicDocsLayout() {
  const location = useLocation();
  const activeSlug = activeSlugFromPath(location.pathname);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 48px" }}>
      <header className={styles.docsTopbar}>
        <Link to="/" className={styles.docsBrand} aria-label="Sticky Add to Cart home">
          <img src="/logo.svg" width={32} height={32} alt="Sticky Add to Cart logo" />
          <span>Sticky Add to Cart</span>
        </Link>
        <nav className={styles.docsTopNav} aria-label="Site">
          <Link to="/docs">Docs</Link>
          <Link to="/#features">Features</Link>
          <Link to="/#faq">FAQ</Link>
          <Link to="/privacy">Privacy</Link>
        </nav>
      </header>
      <div className={styles.shell}>
        <DocsSidebar activeSlug={activeSlug} basePath="/docs" />
        <Outlet />
      </div>
    </main>
  );
}
