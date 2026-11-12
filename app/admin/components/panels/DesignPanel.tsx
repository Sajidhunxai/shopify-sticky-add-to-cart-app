import styles from "../../../styles/dashboard.module.css";
import { usePanelState } from "../../hooks/usePanelState";
import type { BarConfig } from "../../../models/bar-config";
import { colorFromEvent } from "../../fields/color";

export function DesignPanel() {
  const { config, updateConfig, t } = usePanelState();
  return (
    <s-stack gap="base">
      <div className={styles.colorLegend}>
        {(
          [
            [t("design.legendPopupBg"), config.backgroundColor],
            [t("design.legendTitlePrice"), config.textColor],
            [t("design.legendButton"), config.buttonBackground],
            [t("design.legendButtonText"), config.buttonTextColor],
            [t("design.legendAccent"), config.accentColor],
            [t("design.legendBorder"), config.borderColor],
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

      <s-heading>{t("design.themeTypography")}</s-heading>
      <s-paragraph>{t("design.themeTypographyHelp")}</s-paragraph>
      <s-stack direction="inline" gap="base">
        <s-switch
          label={t("design.themeFont")}
          checked={config.inheritThemeFont}
          onChange={(e: Event) =>
            updateConfig(
              "inheritThemeFont",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("design.themeText")}
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
          {t("design.resetColors")}
        </s-button>
      </s-stack>

      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-color-field
          label={t("design.popupBarBg")}
          value={config.backgroundColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("backgroundColor", value);
          }}
        />
        <s-color-field
          label={
            config.inheritThemeTextColor
              ? t("design.titlePriceFallback")
              : t("design.titlePrice")
          }
          value={config.textColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("textColor", value);
          }}
        />
        <s-color-field
          label={t("design.buttonBg")}
          value={config.buttonBackground}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("buttonBackground", value);
          }}
        />
        <s-color-field
          label={t("design.buttonText")}
          value={config.buttonTextColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("buttonTextColor", value);
          }}
        />
        <s-color-field
          label={t("design.accentDrawer")}
          value={config.accentColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("accentColor", value);
          }}
        />
        <s-color-field
          label={t("design.borderColor")}
          value={config.borderColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("borderColor", value);
          }}
        />
        <s-select
          label={t("design.backgroundStyle")}
          value={config.backgroundStyle}
          onChange={(e: Event) =>
            updateConfig(
              "backgroundStyle",
              (e.currentTarget as HTMLSelectElement)
                .value as BarConfig["backgroundStyle"],
            )
          }
        >
          <s-option value="solid">{t("design.solid")}</s-option>
          <s-option value="blur">{t("design.blur")}</s-option>
          <s-option value="gradient">{t("design.gradient")}</s-option>
        </s-select>
        <s-number-field
          label={t("design.opacityPct")}
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
          label={t("design.barRadius")}
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
          label={t("design.buttonRadius")}
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
        label={t("design.shadow")}
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
