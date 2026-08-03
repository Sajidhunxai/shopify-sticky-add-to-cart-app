import db from "../db.server";

export type Plan = "free" | "pro";

type AdminGraphql = {
  graphql: (
    query: string,
    options?: { variables?: object },
  ) => Promise<Response>;
};

export async function getShopSettings(shop: string) {
  return db.shopSettings.upsert({
    where: { shop },
    create: { shop, plan: "free", hideBranding: false },
    update: {},
  });
}

export async function setShopPlan(shop: string, plan: Plan) {
  const hideBranding = plan === "pro";
  return db.shopSettings.upsert({
    where: { shop },
    create: { shop, plan, hideBranding },
    update: { plan, hideBranding },
  });
}

export async function syncBrandingMetafield(
  admin: AdminGraphql,
  hideBranding: boolean,
) {
  const ownerId = await getAppInstallationId(admin);

  const response = await admin.graphql(
    `#graphql
      mutation SetStickyAtcBranding($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
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
        ],
      },
    },
  );

  return response.json();
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
