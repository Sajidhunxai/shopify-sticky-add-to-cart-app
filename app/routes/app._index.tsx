import { useEffect } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import {
  getShopSettings,
  setShopPlan,
  syncBrandingMetafield,
} from "../models/settings.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await getShopSettings(session.shop);

  return {
    shop: session.shop,
    plan: settings.plan,
    hideBranding: settings.hideBranding,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");

  if (intent === "upgrade") {
    const settings = await setShopPlan(session.shop, "pro");
    await syncBrandingMetafield(admin, settings.hideBranding);
    return { ok: true, message: "Upgraded to Pro (demo). Branding removed." };
  }

  if (intent === "downgrade") {
    const settings = await setShopPlan(session.shop, "free");
    await syncBrandingMetafield(admin, settings.hideBranding);
    return { ok: true, message: "Back on Free plan. Branding enabled." };
  }

  if (intent === "sync") {
    const settings = await getShopSettings(session.shop);
    await syncBrandingMetafield(admin, settings.hideBranding);
    return { ok: true, message: "Storefront settings synced." };
  }

  return { ok: false, message: "Unknown action" };
};

export default function Index() {
  const { shop, plan, hideBranding } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const shopify = useAppBridge();
  const busy = navigation.state !== "idle";

  useEffect(() => {
    if (actionData?.message) {
      shopify.toast.show(actionData.message);
    }
  }, [actionData?.message, shopify]);

  return (
    <s-page heading="Sticky Add to Cart">
      <s-section heading="Enable on your storefront">
        <s-paragraph>
          Your app is installed on <strong>{shop}</strong>. Add the sticky bar
          with the Theme Editor — it takes about 30 seconds.
        </s-paragraph>
        <s-unordered-list>
          <s-list-item>
            Open <strong>Online Store → Themes → Customize</strong>
          </s-list-item>
          <s-list-item>
            Open a <strong>product</strong> template
          </s-list-item>
          <s-list-item>
            Go to <strong>App embeds</strong> and enable{" "}
            <strong>Sticky Add to Cart</strong>
          </s-list-item>
          <s-list-item>Save the theme</s-list-item>
        </s-unordered-list>
        <s-stack direction="inline" gap="base">
          <s-button href={`https://${shop}/admin/themes/current/editor`} target="_blank">
            Open Theme Editor
          </s-button>
          <Form method="post">
            <input type="hidden" name="intent" value="sync" />
            <s-button type="submit" variant="secondary" {...(busy ? { loading: true } : {})}>
              Sync storefront settings
            </s-button>
          </Form>
        </s-stack>
      </s-section>

      <s-section heading="Plan">
        <s-paragraph>
          Current plan: <strong>{plan === "pro" ? "Pro" : "Free"}</strong>
          {" · "}
          Branding:{" "}
          <strong>{hideBranding ? "Hidden (Pro)" : "Visible (Free)"}</strong>
        </s-paragraph>
        <s-paragraph>
          Free includes the sticky bar with a small “Powered by Sticky ATC”
          label. Pro removes branding — ready for Shopify Billing when you
          publish.
        </s-paragraph>
        <s-stack direction="inline" gap="base">
          {plan === "free" ? (
            <Form method="post">
              <input type="hidden" name="intent" value="upgrade" />
              <s-button type="submit" {...(busy ? { loading: true } : {})}>
                Upgrade to Pro (demo)
              </s-button>
            </Form>
          ) : (
            <Form method="post">
              <input type="hidden" name="intent" value="downgrade" />
              <s-button type="submit" variant="secondary" {...(busy ? { loading: true } : {})}>
                Switch to Free (demo)
              </s-button>
            </Form>
          )}
        </s-stack>
      </s-section>

      <s-section slot="aside" heading="What merchants get">
        <s-unordered-list>
          <s-list-item>Mobile sticky Add to cart bar</s-list-item>
          <s-list-item>Optional desktop floating bar</s-list-item>
          <s-list-item>Auto-hide near the native ATC button</s-list-item>
          <s-list-item>Color + label controls in the theme editor</s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section slot="aside" heading="Next for App Store">
        <s-unordered-list>
          <s-list-item>Connect real Shopify Billing API</s-list-item>
          <s-list-item>Privacy policy + support email</s-list-item>
          <s-list-item>Screenshots of the sticky bar</s-list-item>
          <s-list-item>Submit for App Store review</s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
