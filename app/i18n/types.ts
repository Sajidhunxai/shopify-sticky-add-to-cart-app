export const SUPPORTED_LOCALES = [
  "en",
  "de",
  "es",
  "fr",
  "it",
  "ja",
  "pt-BR",
] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export type TranslateFn = (
  key: string,
  vars?: Record<string, string | number>,
) => string;

export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  ja: "日本語",
  "pt-BR": "Português (Brasil)",
};

export const LOCALE_STORAGE_KEY = "satc-admin-locale";
