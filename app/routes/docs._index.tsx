import { Link } from "react-router";
import { DocsArticle } from "../docs/DocsArticle";
import { DOC_GROUPS, DOC_PAGES, getDocPage } from "../docs/content";
import styles from "../styles/docs.module.css";

export default function PublicDocsIndex() {
  const page = getDocPage("overview")!;

  return (
    <div>
      <DocsArticle page={page} basePath="/docs" />
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
                    to={`/docs/${slug}`}
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
  );
}
