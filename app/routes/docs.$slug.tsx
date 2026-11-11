import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { DocsArticle } from "../docs/DocsArticle";
import { getDocPage } from "../docs/content";

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

export default function PublicDocsSlug() {
  const { page } = useLoaderData<typeof loader>();
  return <DocsArticle page={page} basePath="/docs" />;
}
