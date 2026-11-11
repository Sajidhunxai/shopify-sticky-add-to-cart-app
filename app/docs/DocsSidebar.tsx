import { Link } from "react-router";
import styles from "../styles/docs.module.css";
import { DOC_GROUPS, DOC_PAGES } from "./content";

type Props = {
  activeSlug: string;
  /** Prefix for links: "/app/docs" or "/docs" */
  basePath?: string;
};

export function DocsSidebar({ activeSlug, basePath = "/app/docs" }: Props) {
  const bySlug = Object.fromEntries(DOC_PAGES.map((p) => [p.slug, p]));

  return (
    <nav className={styles.sidebar} aria-label="Documentation">
      <Link to={basePath} className={styles.sidebarBrand}>
        <img
          src="/logo.svg"
          width={28}
          height={28}
          alt="Sticky Add to Cart logo"
        />
        <span>Documentation</span>
      </Link>
      {DOC_GROUPS.map((group) => (
        <div key={group.title} className={styles.group}>
          <p className={styles.groupTitle}>{group.title}</p>
          {group.slugs.map((slug) => {
            const page = bySlug[slug];
            if (!page) return null;
            const href =
              slug === "overview" ? basePath : `${basePath}/${slug}`;
            const active = activeSlug === slug;
            return (
              <Link
                key={slug}
                to={href}
                className={`${styles.navLink} ${
                  active ? styles.navLinkActive : ""
                }`}
              >
                {page.title}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
