import fs from "node:fs";
import path from "node:path";

const en = JSON.parse(
  fs.readFileSync("app/i18n/locales/en.json", "utf8"),
);

function deepMerge(base, over) {
  if (
    Array.isArray(base) ||
    Array.isArray(over) ||
    typeof base !== "object" ||
    typeof over !== "object" ||
    !base ||
    !over
  ) {
    return over ?? base;
  }
  const out = { ...base };
  for (const k of Object.keys(over)) out[k] = deepMerge(base[k], over[k]);
  return out;
}

/** Partial overlays; missing keys fall back to English via deepMerge + runtime fallback. */
const overlays = {
  de: JSON.parse(fs.readFileSync("scripts/locale-overlays/de.json", "utf8")),
  es: JSON.parse(fs.readFileSync("scripts/locale-overlays/es.json", "utf8")),
  fr: JSON.parse(fs.readFileSync("scripts/locale-overlays/fr.json", "utf8")),
  it: JSON.parse(fs.readFileSync("scripts/locale-overlays/it.json", "utf8")),
  ja: JSON.parse(fs.readFileSync("scripts/locale-overlays/ja.json", "utf8")),
  "pt-BR": JSON.parse(
    fs.readFileSync("scripts/locale-overlays/pt-BR.json", "utf8"),
  ),
};

for (const [locale, over] of Object.entries(overlays)) {
  const merged = deepMerge(en, over);
  const out = path.join("app/i18n/locales", `${locale}.json`);
  fs.writeFileSync(out, `${JSON.stringify(merged, null, 2)}\n`);
  console.log("wrote", out);
}
