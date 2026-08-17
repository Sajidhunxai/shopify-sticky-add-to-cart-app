/**
 * Resolves the app's public URL. On Vercel, SHOPIFY_APP_URL is not known at
 * build time for preview deployments, so fall back to the system-provided
 * production domain.
 */
export function getAppUrl(): string {
  const explicit = process.env.SHOPIFY_APP_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}
