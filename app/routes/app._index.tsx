import { useEffect } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import {
  barConfigFromFormData,
  getShopSettings,
  saveBarConfig,
  setShopPlan,
  syncStorefrontSettings,
  validateBarConfig,
} from "../models/settings.server";
import { StudioNav } from "../admin/components/StudioNav";
import { StudioPreview } from "../admin/components/StudioPreview";
import { AnnouncementsPanel } from "../admin/components/panels/AnnouncementsPanel";
import { BehaviorPanel } from "../admin/components/panels/BehaviorPanel";
import { CartItemsPanel } from "../admin/components/panels/CartItemsPanel";
import { CartSummaryPanel } from "../admin/components/panels/CartSummaryPanel";
import { DesignPanel } from "../admin/components/panels/DesignPanel";
import { DiscountsPanel } from "../admin/components/panels/DiscountsPanel";
import { DisplayPanel } from "../admin/components/panels/DisplayPanel";
import { HeaderPanel } from "../admin/components/panels/HeaderPanel";
import { PagesPanel } from "../admin/components/panels/PagesPanel";
import { PlanPanel } from "../admin/components/panels/PlanPanel";
import { RecommendationsPanel } from "../admin/components/panels/RecommendationsPanel";
import { RewardsPanel } from "../admin/components/panels/RewardsPanel";
import { SetupPanel } from "../admin/components/panels/SetupPanel";
import { TemplatesPanel } from "../admin/components/panels/TemplatesPanel";
import { TrustPanel } from "../admin/components/panels/TrustPanel";
import { useBarConfigStudio } from "../admin/hooks/useBarConfigStudio";
import { getNavLabel } from "../admin/nav";
import { serializeBarConfigToFormData } from "../admin/serialize-config";
import { LanguageSelect } from "../i18n";
import { useI18nStore, useSessionStore, useStudioStore } from "../stores";
import styles from "../styles/dashboard.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await getShopSettings(session.shop);

  return {
    shop: session.shop,
    plan: settings.plan,
    hideBranding: settings.hideBranding,
    config: settings.config,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");

  if (intent === "save") {
    const config = barConfigFromFormData(formData);
    const validationErrors = validateBarConfig(config);
    if (validationErrors.length) {
      return {
        ok: false,
        message: `Invalid settings: ${validationErrors.join("; ")}`,
      };
    }
    const settings = await saveBarConfig(session.shop, config);
    try {
    await syncStorefrontSettings(admin, settings.hideBranding, config);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to sync storefront metafields";
      return { ok: false, message: `Saved locally, but storefront sync failed: ${message}` };
    }
    return { ok: true, message: "Settings saved and synced to storefront." };
  }

  if (intent === "upgrade") {
    const settings = await setShopPlan(session.shop, "pro");
    const current = await getShopSettings(session.shop);
    await syncStorefrontSettings(admin, settings.hideBranding, current.config);
    return { ok: true, message: "Upgraded to Pro. Branding removed." };
  }

  if (intent === "downgrade") {
    const settings = await setShopPlan(session.shop, "free");
    const current = await getShopSettings(session.shop);
    await syncStorefrontSettings(admin, settings.hideBranding, current.config);
    return { ok: true, message: "Switched to Free. Branding enabled." };
  }

  if (intent === "sync") {
    const settings = await getShopSettings(session.shop);
    await syncStorefrontSettings(admin, settings.hideBranding, settings.config);
    return { ok: true, message: "Storefront settings synced." };
  }

  if (intent === "resolve-file") {
    const fileId = String(formData.get("fileId") || "").trim();
    const tierIndex = Number(formData.get("tierIndex") || 0);
    if (!fileId.startsWith("gid://")) {
      return { ok: false, message: "Invalid file id", intent: "resolve-file" };
    }
    try {
      const response = await admin.graphql(
        `#graphql
          query StickyAtcFileUrl($id: ID!) {
            node(id: $id) {
              __typename
              ... on MediaImage {
                image {
                  url
                  altText
                }
              }
              ... on GenericFile {
                url
                mimeType
              }
              ... on Video {
                preview {
                  image {
                    url
                  }
                }
              }
            }
          }`,
        { variables: { id: fileId } },
      );
      const json = await response.json();
      const node = json?.data?.node;
      let url = "";
      if (node?.__typename === "MediaImage") {
        url = String(node.image?.url || "");
      } else if (node?.__typename === "GenericFile") {
        url = String(node.url || "");
      } else if (node?.__typename === "Video") {
        url = String(node.preview?.image?.url || "");
      }
      if (!url) {
        return {
          ok: false,
          message: "Could not resolve file URL. Try an image or SVG.",
          intent: "resolve-file",
          tierIndex,
        };
      }
      return {
        ok: true,
        message: "File selected",
        intent: "resolve-file",
        url,
        fileId,
        tierIndex,
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load Shopify file";
      return {
        ok: false,
        message,
        intent: "resolve-file",
        tierIndex,
      };
    }
  }

  return { ok: false, message: "Unknown action" };
};

export default function Index() {
  const { shop, plan, hideBranding, config: initialConfig } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const shopify = useAppBridge();
  const t = useI18nStore((s) => s.t);
  const locale = useI18nStore((s) => s.locale);
  const hydrateSession = useSessionStore((s) => s.hydrate);
  const setBusy = useSessionStore((s) => s.setBusy);
  const config = useStudioStore((s) => s.config);
  const nav = useStudioStore((s) => s.nav);
  const busy = navigation.state !== "idle";

  useBarConfigStudio(initialConfig);

  useEffect(() => {
    hydrateSession({
      shop,
      plan: plan === "pro" ? "pro" : "free",
      hideBranding,
    });
  }, [hydrateSession, shop, plan, hideBranding]);

  useEffect(() => {
    setBusy(busy);
  }, [busy, setBusy]);

  useEffect(() => {
    if (actionData?.message) {
      shopify.toast.show(actionData.message);
    }
  }, [actionData?.message, shopify]);

  const handleSave = () => {
    submit(serializeBarConfigToFormData(config), { method: "post" });
  };

  const activeLabel = getNavLabel(nav, t);

  return (
    <s-page heading={t("app.name")}>
      <s-button
        slot="primary-action"
        variant="primary"
        onClick={handleSave}
        {...(busy ? { loading: true } : {})}
      >
        {t("app.saveSettings")}
      </s-button>

      <div style={{ margin: "0 0 12px" }}>
        <LanguageSelect />
      </div>

      <s-banner
        tone={config.enabled ? "success" : "warning"}
        heading={config.enabled ? t("app.bannerOn") : t("app.bannerOff")}
      >
        {config.enabled ? t("app.bannerOnBody") : t("app.bannerOffBody")}
      </s-banner>

      <div className={styles.studio}>
        <StudioNav />

        <section className={styles.studioPanel}>
          <header className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>{activeLabel}</h2>
            <p className={styles.panelSub}>{t("app.panelHint")}</p>
          </header>

          {/* Remount Polaris web components so labels refresh on locale change */}
          <div key={locale}>
            {nav === "design" && <DesignPanel />}
            {nav === "header" && <HeaderPanel />}
            {nav === "display" && <DisplayPanel />}
            {nav === "cart-items" && <CartItemsPanel />}
            {nav === "announcements" && <AnnouncementsPanel />}
            {nav === "rewards" && <RewardsPanel />}
            {nav === "recommendations" && <RecommendationsPanel />}
            {nav === "discounts" && <DiscountsPanel />}
            {nav === "trust" && <TrustPanel />}
            {nav === "cart-summary" && <CartSummaryPanel />}
            {nav === "pages" && <PagesPanel />}
            {nav === "behavior" && <BehaviorPanel />}
            {nav === "templates" && <TemplatesPanel />}
            {nav === "plan" && <PlanPanel />}
            {nav === "setup" && <SetupPanel />}
          </div>
        </section>

        <StudioPreview />
      </div>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
