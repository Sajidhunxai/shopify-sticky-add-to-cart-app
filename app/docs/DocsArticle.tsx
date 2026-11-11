import { Link } from "react-router";
import styles from "../styles/docs.module.css";
import type { DocImage, DocPage } from "./content";

type Props = {
  page: DocPage;
  basePath?: string;
  showIndexCards?: boolean;
};

function resolveDocHref(href: string, basePath: string): string {
  if (basePath === "/docs") {
    return href
      .replace(/^\/app\/docs/, "/docs")
      .replace(/^\/app\/additional/, "/docs/troubleshooting")
      .replace(/^\/app$/, "/");
  }
  return href;
}

function DocFigure({ image }: { image: DocImage }) {
  return (
    <figure className={styles.figure}>
      <img
        className={styles.figureImg}
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
      />
      {image.caption ? (
        <figcaption className={styles.figureCaption}>{image.caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function DocsArticle({
  page,
  basePath = "/app/docs",
  showIndexCards = false,
}: Props) {
  return (
    <article className={styles.article}>
      <p className={styles.crumb}>
        <Link to={basePath}>Docs</Link>
        {" / "}
        <span>{page.group}</span>
        {" / "}
        <span>{page.title}</span>
      </p>
      <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 750 }}>
        {page.title}
      </h1>
      <p className={styles.lead}>{page.description}</p>

      {page.studioNav ? (
        <p className={styles.lead} style={{ marginTop: -8 }}>
          In the app: Dashboard → left menu → <strong>{page.title}</strong>
          {page.studioNav === "setup" ? " / Setup" : ""}.
        </p>
      ) : null}

      {page.hero ? <DocFigure image={page.hero} /> : null}

      <nav className={styles.toc} aria-label="On this page">
        <p className={styles.tocTitle}>On this page</p>
        <ol className={styles.tocList}>
          {page.sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
            </li>
          ))}
        </ol>
      </nav>

      {showIndexCards ? (
        <div className={styles.cardGrid}>
          {/* filled by overview page via related + groups externally if needed */}
        </div>
      ) : null}

      {page.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className={styles.section}
        >
          <h2>{section.title}</h2>
          {section.paragraphs?.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
          {section.images?.map((image) => (
            <DocFigure key={image.src + image.alt} image={image} />
          ))}
          {section.steps?.length ? (
            <ol>
              {section.steps.map((step) => (
                <li key={step.slice(0, 48)}>{step}</li>
              ))}
            </ol>
          ) : null}
          {section.bullets?.length ? (
            <ul>
              {section.bullets.map((b) => (
                <li key={b.slice(0, 48)}>{b}</li>
              ))}
            </ul>
          ) : null}
          {section.note ? <p className={styles.note}>{section.note}</p> : null}
          {section.links?.length ? (
            <ul>
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link to={resolveDocHref(link.href, basePath)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      {page.related?.length ? (
        <div className={styles.related}>
          <p className={styles.relatedTitle}>Related guides</p>
          <ul className={styles.relatedList}>
            {page.related.map((r) => (
              <li key={r.slug}>
                <Link
                  to={
                    r.slug === "overview"
                      ? basePath
                      : `${basePath}/${r.slug}`
                  }
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
