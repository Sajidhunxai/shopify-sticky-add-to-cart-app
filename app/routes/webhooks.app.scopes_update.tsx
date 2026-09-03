import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  const current = payload.current as string[];
  if (session) {
    try {
      await db.session.update({
        where: { id: session.id },
        data: { scope: current.toString() },
      });
    } catch (error) {
      console.error(`Failed to update scopes for ${shop}`, error);
    }
  }

  return new Response(null, { status: 200 });
};
