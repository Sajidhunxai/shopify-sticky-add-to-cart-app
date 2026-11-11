import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { DocsArticle } from "../docs/DocsArticle";
import { getDocPage } from "../docs/content";

const SITE_URL = "https://atc.appmarka.com";
const LOGO_URL = `${SITE_URL}/logo.svg`;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = String(params.slug || "");
  if (slug === "overview") {
    throw new Response(null, {
      status: 302,
      headers: { Location: "/docs" },
    });
  }
  const page = getDocPage(slug);
  if (!page) {
    throw new Response("Not found", { status: 404 });
  }
  return { page };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.page
    ? `${data.page.title} — Sticky ATC Docs`
    : "Documentation — Sticky Add to Cart";
  const description =
    data?.page?.description || "Sticky Add to Cart documentation";
  const url = data?.page
    ? `${SITE_URL}/docs/${data.page.slug}`
    : `${SITE_URL}/docs`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: "Sticky Add to Cart" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: LOGO_URL },
    { property: "og:logo", content: LOGO_URL },
    { property: "og:url", content: url },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:image", content: LOGO_URL },
    { tagName: "link", rel: "canonical", href: url },
  ];
};

export default function PublicDocsSlug() {
  const { page } = useLoaderData<typeof loader>();

  const faqLd =
    page.slug === "faq"
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.sections.map((section) => ({
            "@type": "Question",
            name: section.title,
            acceptedAnswer: {
              "@type": "Answer",
              text: (section.paragraphs || []).join(" "),
            },
          })),
        }
      : null;

  return (
    <>
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}
      <DocsArticle page={page} basePath="/docs" />
    </>
  );
}
