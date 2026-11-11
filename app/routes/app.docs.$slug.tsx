import type { HeadersFunction, LoaderFunctionArgs, MetaFunction } from "react-router";
import { Link, useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { DocsSidebar } from "../docs/DocsSidebar";
import { DocsArticle } from "../docs/DocsArticle";
import { getDocPage } from "../docs/content";
import styles from "../styles/docs.module.css";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = String(params.slug || "");
  if (slug === "overview") {
    throw new Response(null, {
      status: 302,
      headers: { Location: "/app/docs" },
    });
  }
  const page = getDocPage(slug);
  if (!page) {
    throw new Response("Not found", { status: 404 });
  }
  return { page };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.page
      ? `${data.page.title} — Sticky ATC Docs`
      : "Documentation — Sticky Add to Cart",
  },
  {
    name: "description",
    content: data?.page?.description || "Sticky Add to Cart documentation",
  },
];

export default function DocsSlugPage() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <s-page heading={page.title}>
      <s-button slot="primary-action" variant="primary" href="/app">
        Open dashboard
      </s-button>
      <s-button slot="secondary-actions" href="/app/docs">
        Docs home
      </s-button>
      <div className={styles.shell}>
        <DocsSidebar activeSlug={page.slug} />
        <DocsArticle page={page} basePath="/app/docs" />
      </div>
      <s-section>
        <s-paragraph>
          Need install help? See{" "}
          <Link to="/app/additional">Setup help</Link> or{" "}
          <Link to="/app/docs/troubleshooting">Troubleshooting</Link>.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
