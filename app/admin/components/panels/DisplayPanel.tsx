import styles from "../../../styles/dashboard.module.css";
import type { BarConfig } from "../../../models/bar-config";
import type { PanelProps } from "../../types";

export function DisplayPanel({ config, updateConfig }: PanelProps) {
  return (
    <s-stack gap="base">
      <div
        className={styles.modeGrid}
        role="radiogroup"
        aria-label="Display style"
      >
        {(
          [
            {
              id: "bar" as const,
              title: "Sticky bar",
              blurb: "Classic sticky Add to cart bar",
            },
            {
              id: "slider" as const,
              title: "Cart drawer",
              blurb: "Bar + slide-out cart after add",
            },
            {
              id: "quickbuy" as const,
              title: "Quick buy",
              blurb: "Floating button that expands",
            },
          ] as const
        ).map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={`${styles.modeCard} ${
              config.displayMode === mode.id ? styles.modeCardActive : ""
            }`}
            onClick={() => updateConfig("displayMode", mode.id)}
            aria-pressed={config.displayMode === mode.id}
          >
            <strong>{mode.title}</strong>
            <span>{mode.blurb}</span>
          </button>
        ))}
      </div>
      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-select
          label="Bar layout"
          value={config.layout}
          onChange={(e: Event) =>
            updateConfig(
              "layout",
              (e.currentTarget as HTMLSelectElement)
                .value as BarConfig["layout"],
            )
          }
        >
          <s-option value="row">Row</s-option>
          <s-option value="compact">Compact pill</s-option>
          <s-option value="stacked">Stacked</s-option>
        </s-select>
        <s-select
          label="Bar position"
          value={config.barPosition}
          onChange={(e: Event) =>
            updateConfig(
              "barPosition",
              (e.currentTarget as HTMLSelectElement)
                .value as BarConfig["barPosition"],
            )
          }
        >
          <s-option value="bottom">Bottom center</s-option>
          <s-option value="bottom-left">Bottom left</s-option>
          <s-option value="bottom-right">Bottom right</s-option>
          <s-option value="top">Top center</s-option>
          <s-option value="top-left">Top left</s-option>
          <s-option value="top-right">Top right</s-option>
          <s-option value="left">Middle left</s-option>
          <s-option value="right">Middle right</s-option>
        </s-select>
        <s-select
          label="Image shape"
          value={config.imageShape}
          onChange={(e: Event) =>
            updateConfig(
              "imageShape",
              (e.currentTarget as HTMLSelectElement)
                .value as BarConfig["imageShape"],
            )
          }
        >
          <s-option value="rounded">Rounded</s-option>
          <s-option value="circle">Circle</s-option>
          <s-option value="square">Square</s-option>
        </s-select>
        <s-select
          label="Button size"
          value={config.buttonSize}
          onChange={(e: Event) =>
            updateConfig(
              "buttonSize",
              (e.currentTarget as HTMLSelectElement)
                .value as BarConfig["buttonSize"],
            )
          }
        >
          <s-option value="normal">Normal</s-option>
          <s-option value="large">Large</s-option>
          <s-option value="full">Full width</s-option>
        </s-select>
      </s-grid>
    </s-stack>
  );
}
