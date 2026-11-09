import { useState } from "react";
import styles from "../../../styles/dashboard.module.css";
import {
  FEATURE_TEMPLATE_KEYS,
  FEATURE_TEMPLATE_META,
  emptyFeatureTemplate,
  type FeatureTemplate,
  type FeatureTemplateKey,
} from "../../../models/feature-templates";
import type { PanelProps } from "../../types";

export function TemplatesPanel({ config, updateConfig }: PanelProps) {
  const [active, setActive] = useState<FeatureTemplateKey>("recommendations");
  const templates = config.featureTemplates;
  const current = templates[active] || emptyFeatureTemplate();
  const meta = FEATURE_TEMPLATE_META[active];

  const patchFeature = (patch: Partial<FeatureTemplate>) => {
    updateConfig("featureTemplates", {
      ...templates,
      [active]: { ...current, ...patch },
    });
  };

  const resetFeature = () => {
    patchFeature(emptyFeatureTemplate());
  };

  const loadExample = () => {
    patchFeature({
      enabled: true,
      replaceDefault: true,
      template: meta.example,
    });
  };

  return (
    <s-stack gap="base">
      <s-paragraph>
        Add custom HTML, CSS, and Mustache templates per cart-drawer feature.
        Leave a template empty to keep the built-in design. Use{" "}
        <code>{"{{name}}"}</code> for escaped values and{" "}
        <code>{"{{{html}}}"}</code> for raw HTML fragments.
      </s-paragraph>

      <label className={styles.codeFieldLabel} htmlFor="global-custom-css">
        Global drawer CSS
      </label>
      <textarea
        id="global-custom-css"
        className={styles.codeField}
        rows={5}
        spellCheck={false}
        placeholder=".satc-slider__panel { /* your styles */ }"
        value={config.customCss}
        onChange={(e) => updateConfig("customCss", e.target.value)}
      />
      <s-paragraph>
        Applied to the whole cart drawer. Prefer per-feature CSS below when
        possible.
      </s-paragraph>

      <div className={styles.tierTabs} role="tablist" aria-label="Features">
        {FEATURE_TEMPLATE_KEYS.map((key) => {
          const on = templates[key]?.enabled;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active === key}
              className={`${styles.tierTab} ${
                active === key ? styles.tierTabActive : ""
              }`}
              onClick={() => setActive(key)}
            >
              {FEATURE_TEMPLATE_META[key].label}
              {on ? " · on" : ""}
            </button>
          );
        })}
      </div>

      <s-stack direction="inline" gap="base">
        <s-badge tone={current.enabled ? "success" : "neutral"}>
          {current.enabled ? "Custom active" : "Built-in"}
        </s-badge>
        <s-switch
          label={
            current.enabled
              ? "Disable custom template"
              : "Enable custom template"
          }
          checked={current.enabled}
          onChange={(e: Event) =>
            patchFeature({
              enabled: (e.currentTarget as HTMLInputElement).checked,
            })
          }
        />
        <s-switch
          label="Replace built-in markup"
          checked={current.replaceDefault}
          onChange={(e: Event) =>
            patchFeature({
              replaceDefault: (e.currentTarget as HTMLInputElement).checked,
            })
          }
        />
      </s-stack>

      <s-paragraph>
        Placeholders for <strong>{meta.label}</strong>: {meta.placeholders}
      </s-paragraph>

      <label className={styles.codeFieldLabel} htmlFor={`tpl-${active}`}>
        HTML template
      </label>
      <textarea
        id={`tpl-${active}`}
        className={styles.codeField}
        rows={10}
        spellCheck={false}
        placeholder={meta.example}
        value={current.template}
        onChange={(e) => patchFeature({ template: e.target.value })}
      />

      <label className={styles.codeFieldLabel} htmlFor={`html-${active}`}>
        Extra HTML (injected when enabled)
      </label>
      <textarea
        id={`html-${active}`}
        className={styles.codeField}
        rows={5}
        spellCheck={false}
        placeholder="Optional HTML appended after this feature"
        value={current.html}
        onChange={(e) => patchFeature({ html: e.target.value })}
      />

      <label className={styles.codeFieldLabel} htmlFor={`css-${active}`}>
        Feature CSS
      </label>
      <textarea
        id={`css-${active}`}
        className={styles.codeField}
        rows={6}
        spellCheck={false}
        placeholder={`[data-satc-feature="${active}"] .my-class { color: red; }`}
        value={current.css}
        onChange={(e) => patchFeature({ css: e.target.value })}
      />

      <s-stack direction="inline" gap="base">
        <s-button onClick={loadExample}>Load example template</s-button>
        <s-button variant="tertiary" onClick={resetFeature}>
          Reset this feature
        </s-button>
      </s-stack>
    </s-stack>
  );
}
