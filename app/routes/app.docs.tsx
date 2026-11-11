import type { HeadersFunction } from "react-router";
import { Outlet } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";

/**
 * Docs layout shell — child routes render the page body inside s-page.
 */
export default function DocsLayout() {
  return <Outlet />;
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
