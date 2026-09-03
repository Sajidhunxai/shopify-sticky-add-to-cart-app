import db from "../db.server";

/** Best-effort shop data wipe for uninstall / shop redact. */
export async function deleteShopData(shop: string) {
  await Promise.all([
    db.session.deleteMany({ where: { shop } }),
    db.shopSettings.deleteMany({ where: { shop } }),
  ]);
}
