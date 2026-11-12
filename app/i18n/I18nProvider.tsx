import { useRef, type ReactNode } from "react";
import { useI18nStore } from "../stores";
import { normalizeLocale } from "./translate";
import type { AppLocale } from "./types";

export function I18nProvider({
  initialLocale = "en",
  children,
}: {
  initialLocale?: AppLocale;
  children: ReactNode;
}) {
  const hydrate = useI18nStore((s) => s.hydrate);
  const didHydrate = useRef(false);
  if (!didHydrate.current) {
    hydrate(initialLocale);
    didHydrate.current = true;
  }

  return children;
}

export function useI18n() {
  const locale = useI18nStore((s) => s.locale);
  const setLocale = useI18nStore((s) => s.setLocale);
  const t = useI18nStore((s) => s.t);
  const locales = useI18nStore((s) => s.locales);
  const localeLabels = useI18nStore((s) => s.localeLabels);
  return { locale, setLocale, t, locales, localeLabels };
}

export function LanguageSelect({ className }: { className?: string }) {
  const { locale, setLocale, locales, localeLabels, t } = useI18n();
  return (
    <label
      className={className}
      style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
    >
      <span style={{ fontSize: 12, fontWeight: 650 }}>{t("app.language")}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(normalizeLocale(e.target.value))}
        style={{
          font: "inherit",
          fontSize: 13,
          padding: "6px 8px",
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.14)",
          background: "#fff",
        }}
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {localeLabels[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
