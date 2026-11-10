import { useState } from "react";
import styles from "../../styles/dashboard.module.css";
import {
  FEATURE_TEMPLATE_META,
  emptyFeatureTemplate,
  type FeatureTemplate,
  type FeatureTemplateKey,
} from "../../models/feature-templates";
import type { BarConfig } from "../../models/bar-config";

type CodeTab = "html" | "css" | "js";

type Props = {
  featureKey: FeatureTemplateKey;
  config: BarConfig;
  updateConfig: <K extends keyof BarConfig>(key: K, value: BarConfig[K]) => void;
  extraKeys?: FeatureTemplateKey[];
  title?: string;
};

const CODE_TABS: { id: CodeTab; label: string }[] = [
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "js", label: "JS" },
];

const SHORT_HINTS: Record<CodeTab, string> = {
  html: "Type or paste HTML here… Use {{placeholders}} for dynamic values.",
  css: "Type or paste CSS here… Scoped to this feature automatically.",
  js: "Type or paste JS here… Runs after this feature renders (root, featureKey, slider).",
};

export function FeatureCustomTemplate({
  featureKey,
  config,
  updateConfig,
  extraKeys = [],
  title = "Custom template",
}: Props) {
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
        <s-badge tone="caution">Technical skills required</s-badge>
      </s-stack>
      <s-paragraph>
        Write your own HTML / CSS / JS for this section. The editor starts empty —
        nothing is pre-filled. Placeholders: {meta.placeholders}
      </s-paragraph>

      {featureTabs.length > 1 && (
        <div
          className={styles.tierTabs}
          role="tablist"
          aria-label={`${title} features`}
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
              {FEATURE_TEMPLATE_META[key].label}
              {templates[key]?.enabled ? " · on" : ""}
            </button>
          ))}
        </div>
      )}

      <s-stack direction="inline" gap="base">
        <s-badge tone={current.enabled ? "success" : "neutral"}>
          {current.enabled ? "Active" : "Inactive"}
        </s-badge>
        <s-switch
          label={
            current.enabled
              ? "Disable custom template"
              : "Enable custom template"
          }
          checked={current.enabled}
          onChange={(e: Event) =>
            patch({ enabled: (e.currentTarget as HTMLInputElement).checked })
          }
        />
        <s-switch
          label="Replace built-in markup"
          checked={current.replaceDefault}
          onChange={(e: Event) =>
            patch({
              replaceDefault: (e.currentTarget as HTMLInputElement).checked,
            })
          }
        />
      </s-stack>

      <div className={styles.codeEditor}>
        <div className={styles.codeEditorTabs} role="tablist" aria-label="Code">
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
                {tab.label}
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
          placeholder={SHORT_HINTS[codeTab]}
          value={editorValue}
          onChange={(e) => setEditorValue(e.target.value)}
        />
      </div>

      <s-stack direction="inline" gap="base">
        <s-button
          variant="tertiary"
          onClick={() => {
            if (codeTab === "html") {
              patch({
                enabled: true,
                replaceDefault: true,
                template: meta.example,
              });
            } else if (codeTab === "css") {
              patch({
                enabled: true,
                css: `/* ${activeFeature} */\n`,
              });
            } else {
              patch({
                enabled: true,
                js: `// ${activeFeature}\n// root = feature element, slider = cart drawer\n`,
              });
            }
          }}
        >
          Insert starter for {codeTab.toUpperCase()}
        </s-button>
        <s-button
          variant="tertiary"
          onClick={() => {
            if (codeTab === "html") patch({ template: "" });
            else if (codeTab === "css") patch({ css: "" });
            else patch({ js: "" });
          }}
        >
          Clear {codeTab.toUpperCase()}
        </s-button>
        <s-button
          variant="tertiary"
          onClick={() => patch(emptyFeatureTemplate())}
        >
          Reset all
        </s-button>
      </s-stack>
    </s-stack>
  );
}
