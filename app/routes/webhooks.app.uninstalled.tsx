import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { deleteShopData } from "../models/shop-cleanup.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  try {
    await deleteShopData(shop);
  } catch (error) {
    console.error(`Failed to delete shop data on ${topic} for ${shop}`, error);
  }

  return new Response(null, { status: 200 });
};
