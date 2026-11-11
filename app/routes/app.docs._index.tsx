import type { HeadersFunction, MetaFunction } from "react-router";
import { Link } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { DocsSidebar } from "../docs/DocsSidebar";
import { DocsArticle } from "../docs/DocsArticle";
import { DOC_GROUPS, DOC_PAGES, getDocPage } from "../docs/content";
import styles from "../styles/docs.module.css";

export const meta: MetaFunction = () => [
  { title: "Documentation — Sticky Add to Cart" },
];

export default function DocsIndex() {
  const page = getDocPage("overview")!;

  return (
    <s-page heading="Documentation">
      <s-button slot="primary-action" variant="primary" href="/app">
        Open dashboard
      </s-button>
      <div className={styles.shell}>
        <DocsSidebar activeSlug="overview" />
        <div>
          <DocsArticle page={page} basePath="/app/docs" />
          <div className={styles.related}>
            <p className={styles.relatedTitle}>Browse by topic</p>
            {DOC_GROUPS.filter((g) => g.title !== "Start here").map((group) => (
              <div key={group.title} style={{ marginBottom: 16 }}>
                <p className={styles.groupTitle}>{group.title}</p>
                <div className={styles.cardGrid}>
                  {group.slugs.map((slug) => {
                    const doc = DOC_PAGES.find((p) => p.slug === slug);
                    if (!doc) return null;
                    return (
                      <Link
                        key={slug}
                        to={`/app/docs/${slug}`}
                        className={styles.card}
                      >
                        <strong>{doc.title}</strong>
                        <span>{doc.description}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
