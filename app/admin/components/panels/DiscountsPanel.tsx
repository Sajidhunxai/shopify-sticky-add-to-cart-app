import { FeatureCustomTemplate } from "../FeatureCustomTemplate";
import { usePanelState } from "../../hooks/usePanelState";

export function DiscountsPanel() {
  const { config, updateConfig, t } = usePanelState();
  return (
    <s-stack gap="base">
      <s-switch
        label={t("discounts.enable")}
        checked={config.discountEnabled}
        onChange={(e: Event) =>
          updateConfig(
            "discountEnabled",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />
      <s-text-field
        label={t("discounts.placeholder")}
        value={config.discountPlaceholder}
        onChange={(e: Event) =>
          updateConfig(
            "discountPlaceholder",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-text-field
        label={t("discounts.button")}
        value={config.discountButtonText}
        onChange={(e: Event) =>
          updateConfig(
            "discountButtonText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-paragraph>{t("discounts.help")}</s-paragraph>

      <FeatureCustomTemplate
        featureKey="discount"
      />
    </s-stack>
  );
}
