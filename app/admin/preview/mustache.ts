/** Minimal Mustache-style renderer shared by admin preview (mirrors storefront). */

function escapeHtml(str: unknown): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type MustacheData = Record<string, unknown>;

/**
 * Supports:
 * - `{{name}}` escaped
 * - `{{{name}}}` raw HTML
 * - `{{#list}}...{{/list}}` for arrays of objects (nested mustache)
 */
export function renderMustache(tpl: string, data: MustacheData): string {
  let out = String(tpl || "");
  out = out.replace(
    /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
    (_m, key: string, inner: string) => {
      const list = data[key];
      if (!Array.isArray(list)) return "";
      return list
        .map((item) =>
          renderMustache(inner, {
            ...data,
            ...(item && typeof item === "object"
              ? (item as MustacheData)
              : { value: item }),
          }),
        )
        .join("");
    },
  );
  out = out.replace(/\{\{\{(\w+)\}\}\}/g, (_m, key: string) =>
    data[key] == null ? "" : String(data[key]),
  );
  out = out.replace(/\{\{(\w+)\}\}/g, (_m, key: string) =>
    escapeHtml(data[key] == null ? "" : String(data[key])),
  );
  return out;
}

export function sanitizeFeatureHtml(html: string): string {
  return String(html || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript\s*:/gi, "");
}
