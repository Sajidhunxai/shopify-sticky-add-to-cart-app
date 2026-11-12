import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  LOCALE_LABELS,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  type AppLocale,
  type TranslateFn,
} from "./types";
import { createTranslator, normalizeLocale } from "./translate";

type I18nContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: TranslateFn;
  locales: typeof SUPPORTED_LOCALES;
  localeLabels: typeof LOCALE_LABELS;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(fallback: AppLocale): AppLocale {
  if (typeof window === "undefined") return fallback;
  try {
    return normalizeLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY) || fallback);
  } catch {
    return fallback;
  }
}

export function I18nProvider({
  initialLocale = "en",
  children,
}: {
  initialLocale?: AppLocale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<AppLocale>(() =>
    readStoredLocale(normalizeLocale(initialLocale)),
  );

  const setLocale = useCallback((next: AppLocale) => {
    const normalized = normalizeLocale(next);
    setLocaleState(normalized);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, normalized);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useMemo(() => createTranslator(locale), [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      locales: SUPPORTED_LOCALES,
      localeLabels: LOCALE_LABELS,
    }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

export function LanguageSelect({ className }: { className?: string }) {
  const { locale, setLocale, locales, localeLabels, t } = useI18n();
  return (
    <label className={className} style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
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
