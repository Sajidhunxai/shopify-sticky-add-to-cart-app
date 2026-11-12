import styles from "../../../styles/dashboard.module.css";
import { usePanelState } from "../../hooks/usePanelState";
import { FeatureCustomTemplate } from "../FeatureCustomTemplate";

export function TemplatesPanel() {
  const { config, updateConfig, t } = usePanelState();
  return (
    <s-stack gap="base">
      <s-paragraph>{t("templates.intro")}</s-paragraph>

      <label className={styles.codeFieldLabel} htmlFor="global-custom-css">
        {t("templates.globalCss")}
      </label>
      <div className={styles.codeEditor}>
        <textarea
          id="global-custom-css"
          className={styles.codeEditorField}
          rows={6}
          spellCheck={false}
          placeholder={t("templates.globalCssPlaceholder")}
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
        title={t("templates.featureTemplates")}
      />
    </s-stack>
  );
}
