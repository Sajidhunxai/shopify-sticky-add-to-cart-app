import db from "../db.server";
import {
  DEFAULT_BAR_CONFIG,
  parseBarConfig,
  type BarConfig,
  type Plan,
} from "./bar-config";
import { storefrontConfigForLocale } from "./locale-default-copy";

export type { BarConfig, Plan } from "./bar-config";
export {
  DEFAULT_BAR_CONFIG,
  parseBarConfig,
  barConfigFromFormData,
  validateBarConfig,
} from "./bar-config";

type AdminGraphql = {
  graphql: (
    query: string,
    options?: { variables?: object },
  ) => Promise<Response>;
};

export async function getShopSettings(shop: string) {
  const row = await db.shopSettings.upsert({
    where: { shop },
    create: {
      shop,
      plan: "free",
      hideBranding: false,
      barConfig: JSON.stringify(DEFAULT_BAR_CONFIG),
    },
    update: {},
  });

  return {
    ...row,
    config: parseBarConfig(row.barConfig),
  };
}

export async function setShopPlan(shop: string, plan: Plan) {
  const hideBranding = plan === "pro";
  return db.shopSettings.upsert({
    where: { shop },
    create: {
      shop,
      plan,
      hideBranding,
      barConfig: JSON.stringify(DEFAULT_BAR_CONFIG),
    },
    update: { plan, hideBranding },
  });
}

export async function saveBarConfig(shop: string, config: BarConfig) {
  return db.shopSettings.upsert({
    where: { shop },
    create: {
      shop,
      plan: "free",
      hideBranding: false,
      barConfig: JSON.stringify(config),
    },
    update: { barConfig: JSON.stringify(config) },
  });
}

export async function syncStorefrontSettings(
  admin: AdminGraphql,
  hideBranding: boolean,
  config: BarConfig,
) {
  const ownerId = await getAppInstallationId(admin);

  const response = await admin.graphql(
    `#graphql
      mutation SetStickyAtcSettings($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
          }
          userErrors {
            field
            message
          }
        }
      }`,
    {
      variables: {
        metafields: [
          {
            namespace: "sticky_atc",
            key: "hide_branding",
            type: "boolean",
            value: hideBranding ? "true" : "false",
            ownerId,
          },
          {
            namespace: "sticky_atc",
            key: "config",
            type: "json",
            value: JSON.stringify(storefrontConfigForLocale(config)),
            ownerId,
          },
        ],
      },
    },
  );

  const json = await response.json();
  const errors = json?.data?.metafieldsSet?.userErrors;
  if (Array.isArray(errors) && errors.length) {
    throw new Error(
      errors.map((e: { message?: string }) => e.message || "metafield error").join("; "),
    );
  }
  return json;
}

/**
 * @deprecated Never call this — it would overwrite storefront config with defaults.
 * Use syncStorefrontSettings(admin, hideBranding, currentConfig) instead.
 */
export async function syncBrandingMetafield(
  _admin: AdminGraphql,
  _hideBranding: boolean,
): Promise<never> {
  throw new Error(
    "syncBrandingMetafield is removed. Use syncStorefrontSettings with the shop's current BarConfig.",
  );
}

async function getAppInstallationId(admin: AdminGraphql) {
  const response = await admin.graphql(
    `#graphql
      query StickyAtcAppInstallation {
        currentAppInstallation {
          id
        }
      }`,
  );
  const json = await response.json();
  return json.data.currentAppInstallation.id as string;
}
