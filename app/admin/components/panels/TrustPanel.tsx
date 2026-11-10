import { FeatureCustomTemplate } from "../FeatureCustomTemplate";
import type { PanelProps } from "../../types";

export function TrustPanel({ config, updateConfig }: PanelProps) {
  return (
    <s-stack gap="base">
      <s-switch
        label="Show trust badges under checkout"
        checked={config.trustBadgesEnabled}
        onChange={(e: Event) =>
          updateConfig(
            "trustBadgesEnabled",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />
      <s-text-field
        label="Trust text"
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
        config={config}
        updateConfig={updateConfig}
      />
    </s-stack>
  );
}
