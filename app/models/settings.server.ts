import db from "../db.server";
import {
  DEFAULT_BAR_CONFIG,
  parseBarConfig,
  type BarConfig,
  type Plan,
} from "./bar-config";

export type { BarConfig, Plan } from "./bar-config";
export { DEFAULT_BAR_CONFIG, parseBarConfig, barConfigFromFormData } from "./bar-config";

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
            value: JSON.stringify(config),
            ownerId,
          },
        ],
      },
    },
  );

  return response.json();
}

/** @deprecated use syncStorefrontSettings */
export async function syncBrandingMetafield(
  admin: AdminGraphql,
  hideBranding: boolean,
) {
  return syncStorefrontSettings(admin, hideBranding, DEFAULT_BAR_CONFIG);
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
