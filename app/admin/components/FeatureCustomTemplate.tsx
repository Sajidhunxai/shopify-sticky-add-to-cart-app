import { useState } from "react";
import styles from "../../styles/dashboard.module.css";
import {
  FEATURE_TEMPLATE_META,
  emptyFeatureTemplate,
  type FeatureTemplate,
  type FeatureTemplateKey,
} from "../../models/feature-templates";
import { useI18nStore, useStudioStore } from "../../stores";

type CodeTab = "html" | "css" | "js";

type Props = {
  featureKey: FeatureTemplateKey;
  extraKeys?: FeatureTemplateKey[];
  title?: string;
};

const CODE_TABS: { id: CodeTab; labelKey: string }[] = [
  { id: "html", labelKey: "featureTemplate.html" },
  { id: "css", labelKey: "featureTemplate.css" },
  { id: "js", labelKey: "featureTemplate.js" },
];

const SHORT_HINT_KEYS: Record<CodeTab, string> = {
  html: "featureTemplate.hintHtml",
  css: "featureTemplate.hintCss",
  js: "featureTemplate.hintJs",
};

export function FeatureCustomTemplate({
  featureKey,
  extraKeys = [],
  title: titleProp,
}: Props) {
  const t = useI18nStore((s) => s.t);
  const config = useStudioStore((s) => s.config);
  const updateConfig = useStudioStore((s) => s.updateConfig);
  const title = titleProp ?? t("featureTemplate.title");
  const featureTabs = [featureKey, ...extraKeys];
  const [activeFeature, setActiveFeature] =
    useState<FeatureTemplateKey>(featureTabs[0]);
  const [codeTab, setCodeTab] = useState<CodeTab>("html");
  const templates = config.featureTemplates;
  const current = templates[activeFeature] || emptyFeatureTemplate();
  const meta = FEATURE_TEMPLATE_META[activeFeature];

  const patch = (patchRow: Partial<FeatureTemplate>) => {
    updateConfig("featureTemplates", {
      ...templates,
      [activeFeature]: {
        ...(templates[activeFeature] || emptyFeatureTemplate()),
        ...patchRow,
      },
    });
  };

  const loadDefaultHtml = (alsoEnable = true) => {
    patch({
      ...(alsoEnable
        ? { enabled: true, replaceDefault: true }
        : {}),
      template: meta.example,
    });
  };

  const enableWithDefaults = (enabled: boolean) => {
    if (!enabled) {
      patch({ enabled: false });
      return;
    }
    // Enabling with empty HTML broke layout before — seed real default markup.
    if (!current.template.trim()) {
      patch({
        enabled: true,
        replaceDefault: true,
        template: meta.example,
      });
      setCodeTab("html");
      return;
    }
    patch({ enabled: true, replaceDefault: true });
  };

  const editorValue =
    codeTab === "html"
      ? current.template
      : codeTab === "css"
        ? current.css
        : current.js;

  const setEditorValue = (value: string) => {
    if (codeTab === "html") patch({ template: value });
    else if (codeTab === "css") patch({ css: value });
    else patch({ js: value });
  };

  const editorId = `feat-${activeFeature}-${codeTab}`;

  return (
    <s-stack gap="base">
      <s-heading>{title}</s-heading>
      <s-stack direction="inline" gap="base">
        <s-badge tone="caution">{t("featureTemplate.technical")}</s-badge>
      </s-stack>
      <s-paragraph>
        {t("featureTemplate.intro", { placeholders: meta.placeholders })}
      </s-paragraph>

      {featureTabs.length > 1 && (
        <div
          className={styles.tierTabs}
          role="tablist"
          aria-label={t("featureTemplate.featuresAria", { title })}
        >
          {featureTabs.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeFeature === key}
              className={`${styles.tierTab} ${
                activeFeature === key ? styles.tierTabActive : ""
              }`}
              onClick={() => {
                setActiveFeature(key);
                setCodeTab("html");
              }}
            >
              {t(`featureTemplate.labels.${key}`)}
              {templates[key]?.enabled ? t("featureTemplate.tabOn") : ""}
            </button>
          ))}
        </div>
      )}

      <s-stack direction="inline" gap="base">
        <s-badge tone={current.enabled ? "success" : "neutral"}>
          {current.enabled ? t("common.active") : t("featureTemplate.inactive")}
        </s-badge>
        <s-switch
          label={
            current.enabled
              ? t("featureTemplate.disableTemplate")
              : t("featureTemplate.enableTemplate")
          }
          checked={current.enabled}
          onChange={(e: Event) =>
            enableWithDefaults(
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("featureTemplate.replace")}
          checked={current.replaceDefault}
          onChange={(e: Event) => {
            const on = (e.currentTarget as HTMLInputElement).checked;
            if (on && !current.template.trim()) {
              patch({
                replaceDefault: true,
                enabled: true,
                template: meta.example,
              });
              setCodeTab("html");
              return;
            }
            patch({ replaceDefault: on });
          }}
        />
      </s-stack>

      <div className={styles.codeEditor}>
        <div className={styles.codeEditorTabs} role="tablist" aria-label={t("featureTemplate.code")}>
          {CODE_TABS.map((tab) => {
            const filled =
              tab.id === "html"
                ? Boolean(current.template.trim())
                : tab.id === "css"
                  ? Boolean(current.css.trim())
                  : Boolean(current.js.trim());
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={codeTab === tab.id}
                className={`${styles.codeEditorTab} ${
                  codeTab === tab.id ? styles.codeEditorTabActive : ""
                }`}
                onClick={() => setCodeTab(tab.id)}
              >
                {t(tab.labelKey)}
                {filled ? " ·" : ""}
              </button>
            );
          })}
        </div>
        <textarea
          id={editorId}
          key={editorId}
          className={styles.codeEditorField}
          rows={16}
          spellCheck={false}
          placeholder={t(SHORT_HINT_KEYS[codeTab])}
          value={editorValue}
          onChange={(e) => setEditorValue(e.target.value)}
        />
      </div>

      <s-stack direction="inline" gap="base">
        <s-button
          onClick={() => {
            if (codeTab === "html") loadDefaultHtml(true);
            else if (codeTab === "css") {
              patch({
                enabled: true,
                css: `/* ${activeFeature} — scoped under [data-satc-feature="${activeFeature}"] */\n`,
              });
            } else {
              patch({
                enabled: true,
                js: `// ${activeFeature}\n// root = feature element, slider = cart drawer\n`,
              });
            }
          }}
        >
          {t("featureTemplate.restoreDefault", { kind: codeTab.toUpperCase() })}
        </s-button>
        <s-button
          variant="tertiary"
          onClick={() => {
            if (codeTab === "html") patch({ template: "" });
            else if (codeTab === "css") patch({ css: "" });
            else patch({ js: "" });
          }}
        >
          {t("featureTemplate.clear", { kind: codeTab.toUpperCase() })}
        </s-button>
        <s-button
          variant="tertiary"
          onClick={() => patch(emptyFeatureTemplate())}
        >
          {t("featureTemplate.resetAll")}
        </s-button>
      </s-stack>
    </s-stack>
  );
}
