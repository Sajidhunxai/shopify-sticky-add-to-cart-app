import type { BarConfig } from "../../../models/bar-config";
import { usePanelState } from "../../hooks/usePanelState";
import { FeatureCustomTemplate } from "../FeatureCustomTemplate";

export function CartSummaryPanel() {
  const { config, updateConfig, t } = usePanelState();
  return (
    <s-stack gap="base">
      <s-select
        label={t("behavior.afterAdd")}
        value={config.afterAdd}
        onChange={(e: Event) =>
          updateConfig(
            "afterAdd",
            (e.currentTarget as HTMLSelectElement)
              .value as BarConfig["afterAdd"],
          )
        }
      >
        <s-option value="stay">{t("behavior.stay")}</s-option>
        <s-option value="cart">{t("behavior.goCart")}</s-option>
        <s-option value="drawer">{t("cartSummary.openDrawerIfSupported")}</s-option>
      </s-select>
      <s-text-field
        label={t("cartSummary.checkoutText")}
        value={config.drawerCheckoutText}
        onChange={(e: Event) =>
          updateConfig(
            "drawerCheckoutText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-paragraph>{t("cartSummary.tip")}</s-paragraph>

      <FeatureCustomTemplate
        featureKey="footer"
        title={t("cartSummary.customTemplate")}
      />
    </s-stack>
  );
}
