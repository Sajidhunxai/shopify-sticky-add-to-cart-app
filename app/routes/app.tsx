import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";

import { I18nProvider, resolveLocaleFromRequest, useI18n } from "../i18n";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  // eslint-disable-next-line no-undef
  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
    locale: resolveLocaleFromRequest(request),
  };
};

function AppNav() {
  const { t } = useI18n();
  return (
    <s-app-nav>
      <s-link href="/app">{t("app.navDashboard")}</s-link>
      <s-link href="/app/docs">{t("app.navDocs")}</s-link>
      <s-link href="/app/additional">{t("app.navSetup")}</s-link>
    </s-app-nav>
  );
}

export default function App() {
  const { apiKey, locale } = useLoaderData<typeof loader>();

  return (
    <AppProvider embedded apiKey={apiKey}>
      <I18nProvider initialLocale={locale}>
        <AppNav />
        <Outlet />
      </I18nProvider>
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
