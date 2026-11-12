import { create } from "zustand";
import {
  LOCALE_LABELS,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  type AppLocale,
  type TranslateFn,
} from "../i18n/types";
import { createTranslator, normalizeLocale } from "../i18n/translate";

function readStoredLocale(fallback: AppLocale): AppLocale {
  if (typeof window === "undefined") return fallback;
  try {
    return normalizeLocale(
      window.localStorage.getItem(LOCALE_STORAGE_KEY) || fallback,
    );
  } catch {
    return fallback;
  }
}

type I18nState = {
  locale: AppLocale;
  t: TranslateFn;
  locales: typeof SUPPORTED_LOCALES;
  localeLabels: typeof LOCALE_LABELS;
  hydrate: (initialLocale?: AppLocale) => void;
  setLocale: (locale: AppLocale) => void;
};

export const useI18nStore = create<I18nState>((set) => {
  const initial = "en" as AppLocale;
  return {
    locale: initial,
    t: createTranslator(initial),
    locales: SUPPORTED_LOCALES,
    localeLabels: LOCALE_LABELS,

    hydrate: (initialLocale = "en") => {
      const locale = readStoredLocale(normalizeLocale(initialLocale));
      set({ locale, t: createTranslator(locale) });
    },

    setLocale: (next) => {
      const locale = normalizeLocale(next);
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
      } catch {
        /* ignore */
      }
      set({ locale, t: createTranslator(locale) });
    },
  };
});
