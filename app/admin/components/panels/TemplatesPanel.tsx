import styles from "../../../styles/dashboard.module.css";
import { FeatureCustomTemplate } from "../FeatureCustomTemplate";
import type { PanelProps } from "../../types";

export function TemplatesPanel({ config, updateConfig }: PanelProps) {
  return (
    <s-stack gap="base">
      <s-paragraph>
        Custom HTML / CSS / JS per cart-drawer feature. Editors start empty —
        use the tabs below to edit. Mustache: <code>{"{{name}}"}</code>{" "}
        (escaped) and <code>{"{{{html}}}"}</code> (raw).
      </s-paragraph>

      <label className={styles.codeFieldLabel} htmlFor="global-custom-css">
        Global drawer CSS
      </label>
      <div className={styles.codeEditor}>
        <textarea
          id="global-custom-css"
          className={styles.codeEditorField}
          rows={6}
          spellCheck={false}
          placeholder="Type global CSS here… e.g. .satc-slider__panel { }"
          value={config.customCss}
          onChange={(e) => updateConfig("customCss", e.target.value)}
        />
      </div>

      <FeatureCustomTemplate
        featureKey="announcement"
        extraKeys={[
          "header",
          "rewards",
          "cartItem",
          "recommendations",
          "recommendationCard",
          "recommendationSkeleton",
          "emptyCart",
          "discount",
          "trust",
          "footer",
        ]}
        config={config}
        updateConfig={updateConfig}
        title="Feature templates"
      />
    </s-stack>
  );
}
