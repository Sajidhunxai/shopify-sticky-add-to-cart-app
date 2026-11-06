import styles from "../../../styles/dashboard.module.css";
import type { BarConfig } from "../../../models/bar-config";
import { colorFromEvent } from "../../fields/color";
import type { PanelProps } from "../../types";

export function DesignPanel({ config, updateConfig }: PanelProps) {
  return (
    <s-stack gap="base">
      <div className={styles.colorLegend}>
        {(
          [
            ["Popup background", config.backgroundColor],
            ["Title & price", config.textColor],
            ["Button", config.buttonBackground],
            ["Button text", config.buttonTextColor],
            ["Accent", config.accentColor],
            ["Border", config.borderColor],
          ] as const
        ).map(([label, hex]) => (
          <div key={label} className={styles.colorSwatch}>
            <span
              className={styles.colorSwatchDot}
              style={{ background: hex }}
            />
            <div className={styles.colorSwatchMeta}>
              <strong>{label}</strong>
              <span>{hex}</span>
            </div>
          </div>
        ))}
      </div>

      <s-heading>Theme typography</s-heading>
      <s-paragraph>
        Use the store theme’s font and text color by default. Turn these off to
        force custom values below.
      </s-paragraph>
      <s-stack direction="inline" gap="base">
        <s-switch
          label="Use theme font family"
          checked={config.inheritThemeFont}
          onChange={(e: Event) =>
            updateConfig(
              "inheritThemeFont",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Use theme text color"
          checked={config.inheritThemeTextColor}
          onChange={(e: Event) =>
            updateConfig(
              "inheritThemeTextColor",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-button
          variant="tertiary"
          onClick={() => {
            updateConfig("inheritThemeFont", true);
            updateConfig("inheritThemeTextColor", true);
            updateConfig("backgroundColor", "#ffffff");
            updateConfig("textColor", "#111111");
            updateConfig("buttonBackground", "#111111");
            updateConfig("buttonTextColor", "#ffffff");
            updateConfig("accentColor", "#111111");
            updateConfig("borderColor", "#e5e7eb");
          }}
        >
          Reset design colors
        </s-button>
      </s-stack>

      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-color-field
          label="Popup / bar background"
          value={config.backgroundColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("backgroundColor", value);
          }}
        />
        <s-color-field
          label={
            config.inheritThemeTextColor
              ? "Title & price text (custom fallback)"
              : "Title & price text"
          }
          value={config.textColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("textColor", value);
          }}
        />
        <s-color-field
          label="Button color"
          value={config.buttonBackground}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("buttonBackground", value);
          }}
        />
        <s-color-field
          label="Button text color"
          value={config.buttonTextColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("buttonTextColor", value);
          }}
        />
        <s-color-field
          label="Accent color (drawer highlights)"
          value={config.accentColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("accentColor", value);
          }}
        />
        <s-color-field
          label="Border color"
          value={config.borderColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("borderColor", value);
          }}
        />
        <s-select
          label="Background style"
          value={config.backgroundStyle}
          onChange={(e: Event) =>
            updateConfig(
              "backgroundStyle",
              (e.currentTarget as HTMLSelectElement)
                .value as BarConfig["backgroundStyle"],
            )
          }
        >
          <s-option value="solid">Solid color</s-option>
          <s-option value="blur">Glass blur</s-option>
          <s-option value="gradient">Soft gradient</s-option>
        </s-select>
        <s-number-field
          label="Background opacity %"
          value={String(config.backgroundOpacity)}
          min={40}
          max={100}
          onChange={(e: Event) =>
            updateConfig(
              "backgroundOpacity",
              Number((e.currentTarget as HTMLInputElement).value),
            )
          }
        />
        <s-number-field
          label="Corner radius (bar)"
          value={String(config.barRadius)}
          min={0}
          onChange={(e: Event) =>
            updateConfig(
              "barRadius",
              Number((e.currentTarget as HTMLInputElement).value),
            )
          }
        />
        <s-number-field
          label="Button corner radius"
          value={String(config.buttonRadius)}
          min={0}
          onChange={(e: Event) =>
            updateConfig(
              "buttonRadius",
              Number((e.currentTarget as HTMLInputElement).value),
            )
          }
        />
      </s-grid>
      <s-switch
        label="Show shadow"
        checked={config.showShadow}
        onChange={(e: Event) =>
          updateConfig(
            "showShadow",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />
    </s-stack>
  );
}
