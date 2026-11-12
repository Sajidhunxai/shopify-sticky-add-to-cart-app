import type { AppLocale, TranslateFn } from "./types";
import { SUPPORTED_LOCALES } from "./types";
import en from "./locales/en.json";
import de from "./locales/de.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import ja from "./locales/ja.json";
import ptBR from "./locales/pt-BR.json";

type Dict = Record<string, unknown>;

const CATALOGS: Record<AppLocale, Dict> = {
  en: en as Dict,
  de: de as Dict,
  es: es as Dict,
  fr: fr as Dict,
  it: it as Dict,
  ja: ja as Dict,
  "pt-BR": ptBR as Dict,
};

function getPath(dict: Dict, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Dict)) {
      return (acc as Dict)[part];
    }
    return undefined;
  }, dict);
}

export function normalizeLocale(raw: string | null | undefined): AppLocale {
  if (!raw) return "en";
  const cleaned = raw.trim().replace("_", "-");
  if ((SUPPORTED_LOCALES as readonly string[]).includes(cleaned)) {
    return cleaned as AppLocale;
  }
  const base = cleaned.split("-")[0]?.toLowerCase();
  if (base === "pt") return "pt-BR";
  const match = SUPPORTED_LOCALES.find((l) => l.toLowerCase().startsWith(base || "en"));
  return match || "en";
}

export function resolveLocaleFromRequest(request: Request): AppLocale {
  const url = new URL(request.url);
  const fromQuery = url.searchParams.get("locale");
  if (fromQuery) return normalizeLocale(fromQuery);
  const accept = request.headers.get("Accept-Language") || "";
  const first = accept.split(",")[0]?.trim();
  return normalizeLocale(first);
}

export function createTranslator(locale: AppLocale): TranslateFn {
  const primary = CATALOGS[locale] || CATALOGS.en;
  const fallback = CATALOGS.en;
  return (key, vars) => {
    let value = getPath(primary, key);
    if (typeof value !== "string") value = getPath(fallback, key);
    if (typeof value !== "string") return key;
    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, (_, name: string) =>
      vars[name] == null ? "" : String(vars[name]),
    );
  };
}

export function getCatalog(locale: AppLocale): Dict {
  return CATALOGS[locale] || CATALOGS.en;
}
