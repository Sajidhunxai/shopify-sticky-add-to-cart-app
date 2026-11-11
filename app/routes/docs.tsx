import type { MetaFunction } from "react-router";
import { Link, Outlet, useLocation } from "react-router";
import { DocsSidebar } from "../docs/DocsSidebar";
import styles from "../styles/docs.module.css";

export const meta: MetaFunction = () => [
  { title: "Documentation — Sticky Add to Cart" },
  {
    name: "description",
    content:
      "Guides for Sticky Add to Cart: design, rewards, drawer, templates, and setup.",
  },
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
      <p style={{ margin: "0 0 16px", fontSize: 13 }}>
        <Link to="/" style={{ color: "#4b5563" }}>
          ← Sticky Add to Cart
        </Link>
        {" · "}
        <Link to="/docs" style={{ color: "#4b5563" }}>
          Docs
        </Link>
        {" · "}
        <Link to="/privacy" style={{ color: "#4b5563" }}>
          Privacy
        </Link>
      </p>
      <div className={styles.shell}>
        <DocsSidebar activeSlug={activeSlug} basePath="/docs" />
        <Outlet />
      </div>
    </main>
  );
}
