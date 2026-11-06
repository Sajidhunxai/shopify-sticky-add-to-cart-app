import type { PanelProps } from "../../types";

export function BehaviorPanel({ config, updateConfig }: PanelProps) {
  return (
    <s-stack gap="base">
      <s-switch
        label="Hide when main Add to cart is visible"
        checked={config.hideNearForm}
        onChange={(e: Event) =>
          updateConfig(
            "hideNearForm",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />
      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-number-field
          label="Show after scroll — mobile (px)"
          value={String(config.showAfterScroll)}
          min={0}
          onChange={(e: Event) =>
            updateConfig(
              "showAfterScroll",
              Number((e.currentTarget as HTMLInputElement).value),
            )
          }
        />
        <s-number-field
          label="Show after scroll — desktop (px)"
          value={String(config.showAfterScrollDesktop)}
          min={0}
          onChange={(e: Event) =>
            updateConfig(
              "showAfterScrollDesktop",
              Number((e.currentTarget as HTMLInputElement).value),
            )
          }
        />
        <s-number-field
          label="Edge offset (px)"
          value={String(config.desktopBottomOffset)}
          min={0}
          onChange={(e: Event) =>
            updateConfig(
              "desktopBottomOffset",
              Number((e.currentTarget as HTMLInputElement).value),
            )
          }
        />
        <s-number-field
          label="Desktop max width"
          value={String(config.desktopMaxWidth)}
          min={280}
          onChange={(e: Event) =>
            updateConfig(
              "desktopMaxWidth",
              Number((e.currentTarget as HTMLInputElement).value),
            )
          }
        />
      </s-grid>
    </s-stack>
  );
}
