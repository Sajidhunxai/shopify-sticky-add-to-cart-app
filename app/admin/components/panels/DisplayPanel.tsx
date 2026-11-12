import styles from "../../../styles/dashboard.module.css";
import type { BarConfig } from "../../../models/bar-config";
import type { PanelProps } from "../../types";

export function DisplayPanel({ config, updateConfig, t }: PanelProps) {
  return (
    <s-stack gap="base">
      <div
        className={styles.modeGrid}
        role="radiogroup"
        aria-label={t("display.heading")}
      >
        {(
          [
            {
              id: "bar" as const,
              title: t("display.barTitle"),
              blurb: t("display.barBlurb"),
            },
            {
              id: "slider" as const,
              title: t("display.sliderTitle"),
              blurb: t("display.sliderBlurb"),
            },
            {
              id: "quickbuy" as const,
              title: t("display.quickbuyTitle"),
              blurb: t("display.quickbuyBlurb"),
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
          label={t("display.barLayout")}
          value={config.layout}
          onChange={(e: Event) =>
            updateConfig(
              "layout",
              (e.currentTarget as HTMLSelectElement)
                .value as BarConfig["layout"],
            )
          }
        >
          <s-option value="row">{t("display.layoutRow")}</s-option>
          <s-option value="compact">{t("display.layoutCompact")}</s-option>
          <s-option value="stacked">{t("display.layoutStacked")}</s-option>
        </s-select>
        <s-select
          label={t("display.barPosition")}
          value={config.barPosition}
          onChange={(e: Event) =>
            updateConfig(
              "barPosition",
              (e.currentTarget as HTMLSelectElement)
                .value as BarConfig["barPosition"],
            )
          }
        >
          <s-option value="bottom">{t("display.posBottom")}</s-option>
          <s-option value="bottom-left">{t("display.posBottomLeft")}</s-option>
          <s-option value="bottom-right">{t("display.posBottomRight")}</s-option>
          <s-option value="top">{t("display.posTop")}</s-option>
          <s-option value="top-left">{t("display.posTopLeft")}</s-option>
          <s-option value="top-right">{t("display.posTopRight")}</s-option>
          <s-option value="left">{t("display.posLeft")}</s-option>
          <s-option value="right">{t("display.posRight")}</s-option>
        </s-select>
        <s-select
          label={t("display.imageShape")}
          value={config.imageShape}
          onChange={(e: Event) =>
            updateConfig(
              "imageShape",
              (e.currentTarget as HTMLSelectElement)
                .value as BarConfig["imageShape"],
            )
          }
        >
          <s-option value="rounded">{t("display.shapeRounded")}</s-option>
          <s-option value="circle">{t("display.shapeCircle")}</s-option>
          <s-option value="square">{t("display.shapeSquare")}</s-option>
        </s-select>
        <s-select
          label={t("display.buttonSize")}
          value={config.buttonSize}
          onChange={(e: Event) =>
            updateConfig(
              "buttonSize",
              (e.currentTarget as HTMLSelectElement)
                .value as BarConfig["buttonSize"],
            )
          }
        >
          <s-option value="normal">{t("common.normal")}</s-option>
          <s-option value="large">{t("common.large")}</s-option>
          <s-option value="full">{t("display.sizeFull")}</s-option>
        </s-select>
      </s-grid>
    </s-stack>
  );
}
