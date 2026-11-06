import type { PanelProps } from "../../types";

export function RecommendationsPanel({ config, updateConfig }: PanelProps) {
  return (
    <s-stack gap="base">
      <s-stack direction="inline" gap="base">
        <s-badge tone={config.recommendationsEnabled ? "success" : "neutral"}>
          {config.recommendationsEnabled ? "Active" : "Disabled"}
        </s-badge>
        <s-switch
          label={
            config.recommendationsEnabled
              ? "Disable recommendations"
              : "Enable recommendations"
          }
          checked={config.recommendationsEnabled}
          onChange={(e: Event) =>
            updateConfig(
              "recommendationsEnabled",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
      </s-stack>

      <s-paragraph>
        When the cart is empty, the drawer shows an empty message and product
        recommendations customers can add in one click.
      </s-paragraph>

      <s-text-field
        label="Empty cart helper text"
        value={config.recommendationsEmptyText}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsEmptyText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-text-field
        label="Recommendations header"
        value={config.recommendationsHeader}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsHeader",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-number-field
        label="Maximum recommendations"
        value={String(config.recommendationsMax)}
        min={1}
        max={8}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsMax",
            Number((e.currentTarget as HTMLInputElement).value),
          )
        }
      />
      <s-text-field
        label="Add button text"
        value={config.recommendationsAddText}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsAddText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-text-field
        label="Collection handle"
        value={config.recommendationsCollection}
        details="Products shown when the cart is empty (e.g. all, bestsellers)."
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsCollection",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />

      <s-heading>Shop now button</s-heading>
      <s-switch
        label="Show Shop now button on empty cart"
        checked={config.recommendationsShopNowEnabled}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsShopNowEnabled",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />
      <s-text-field
        label="Button text"
        value={config.recommendationsShopNowText}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsShopNowText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-text-field
        label="Button URL"
        value={config.recommendationsShopNowUrl}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsShopNowUrl",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
    </s-stack>
  );
}
