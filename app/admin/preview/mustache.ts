export type MustacheData = Record<string, unknown>;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strip scripts / inline handlers from merchant HTML before preview. */
export function sanitizeFeatureHtml(html: string): string {
  return String(html || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript\s*:/gi, "");
}

/**
 * Small Mustache subset: {{var}}, {{{raw}}}, {{#list}}…{{/list}},
 * and truthy scalar sections {{#flag}}…{{/flag}}.
 */
export function renderMustache(tpl: string, data: MustacheData): string {
  let out = String(tpl || "");
  out = out.replace(
    /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
    (_, key: string, inner: string) => {
      const list = data[key];
      if (Array.isArray(list)) {
        return list
          .map((item) =>
            renderMustache(inner, {
              ...data,
              ...(item && typeof item === "object" && !Array.isArray(item)
                ? (item as MustacheData)
                : { value: item as string | number | boolean }),
            }),
          )
          .join("");
      }
      if (list == null || list === false || list === "") return "";
      return renderMustache(inner, data);
    },
  );
  out = out.replace(/\{\{\{(\w+)\}\}\}/g, (_, key: string) =>
    data[key] == null ? "" : String(data[key]),
  );
  out = out.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    escapeHtml(data[key] == null ? "" : String(data[key])),
  );
  return out;
}
