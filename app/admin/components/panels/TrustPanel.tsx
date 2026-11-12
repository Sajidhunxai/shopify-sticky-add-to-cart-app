import { FeatureCustomTemplate } from "../FeatureCustomTemplate";
import { usePanelState } from "../../hooks/usePanelState";

export function TrustPanel() {
  const { config, updateConfig, t } = usePanelState();
  return (
    <s-stack gap="base">
      <s-switch
        label={t("trust.enable")}
        checked={config.trustBadgesEnabled}
        onChange={(e: Event) =>
          updateConfig(
            "trustBadgesEnabled",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />
      <s-text-field
        label={t("trust.text")}
        value={config.trustBadgesText}
        onChange={(e: Event) =>
          updateConfig(
            "trustBadgesText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />

      <FeatureCustomTemplate
        featureKey="trust"
      />
    </s-stack>
  );
}
