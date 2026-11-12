import { FeatureCustomTemplate } from "../FeatureCustomTemplate";
import { usePanelState } from "../../hooks/usePanelState";
import { colorFromEvent } from "../../fields/color";
import { DEFAULT_BAR_CONFIG } from "../../../models/bar-config";

export function HeaderPanel() {
  const { config, updateConfig, t } = usePanelState();
  const resetAutoCopy = () => {
    updateConfig("drawerTitle", DEFAULT_BAR_CONFIG.drawerTitle);
    updateConfig("buttonText", DEFAULT_BAR_CONFIG.buttonText);
    updateConfig("soldOutText", DEFAULT_BAR_CONFIG.soldOutText);
  };
  return (
    <s-stack gap="base">
      <s-paragraph>{t("header.copyAutoHint")}</s-paragraph>
      <s-button onClick={resetAutoCopy}>{t("header.resetAutoCopy")}</s-button>
      <s-heading>{t("nav.general")}</s-heading>
      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-select
          label={t("header.headerHeight")}
          value={config.drawerHeaderHeight}
          onChange={(e: Event) =>
            updateConfig(
              "drawerHeaderHeight",
              (e.currentTarget as HTMLSelectElement).value as "slim" | "tall",
            )
          }
        >
          <s-option value="slim">{t("common.slim")}</s-option>
          <s-option value="tall">{t("common.tall")}</s-option>
        </s-select>
        <s-select
          label={t("header.headerBorder")}
          value={config.drawerHeaderBorder}
          onChange={(e: Event) =>
            updateConfig(
              "drawerHeaderBorder",
              (e.currentTarget as HTMLSelectElement).value as "none" | "thin",
            )
          }
        >
          <s-option value="none">{t("common.none")}</s-option>
          <s-option value="thin">{t("common.thin")}</s-option>
        </s-select>
        <s-color-field
          label={t("header.headerBg")}
          value={config.drawerHeaderBg}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("drawerHeaderBg", value);
          }}
        />
      </s-grid>

      <s-heading>{t("header.titleHeading")}</s-heading>
      <s-text-field
        label={t("header.titleText")}
        value={config.drawerTitle}
        onChange={(e: Event) =>
          updateConfig(
            "drawerTitle",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-select
          label={t("header.titleAlign")}
          value={config.drawerTitleAlign}
          onChange={(e: Event) =>
            updateConfig(
              "drawerTitleAlign",
              (e.currentTarget as HTMLSelectElement).value as "left" | "center",
            )
          }
        >
          <s-option value="left">{t("header.alignSide")}</s-option>
          <s-option value="center">{t("common.center")}</s-option>
        </s-select>
        <s-select
          label={t("header.titleWeight")}
          value={config.drawerTitleWeight}
          onChange={(e: Event) =>
            updateConfig(
              "drawerTitleWeight",
              (e.currentTarget as HTMLSelectElement).value as
                "normal" | "semibold" | "bold",
            )
          }
        >
          <s-option value="normal">{t("common.normal")}</s-option>
          <s-option value="semibold">{t("common.semibold")}</s-option>
          <s-option value="bold">{t("common.bold")}</s-option>
        </s-select>
        <s-number-field
          label={t("header.titleSize")}
          value={String(config.drawerTitleSize)}
          min={12}
          max={28}
          onChange={(e: Event) =>
            updateConfig(
              "drawerTitleSize",
              Number((e.currentTarget as HTMLInputElement).value),
            )
          }
        />
      </s-grid>

      <s-heading>{t("header.closeHeading")}</s-heading>
      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-select
          label={t("header.closeSide")}
          value={config.drawerCloseSide}
          onChange={(e: Event) =>
            updateConfig(
              "drawerCloseSide",
              (e.currentTarget as HTMLSelectElement).value as "left" | "right",
            )
          }
        >
          <s-option value="left">{t("common.left")}</s-option>
          <s-option value="right">{t("common.right")}</s-option>
        </s-select>
        <s-select
          label={t("header.closeSize")}
          value={config.drawerCloseIconSize}
          onChange={(e: Event) =>
            updateConfig(
              "drawerCloseIconSize",
              (e.currentTarget as HTMLSelectElement).value as
                "small" | "medium" | "large",
            )
          }
        >
          <s-option value="small">{t("common.small")}</s-option>
          <s-option value="medium">{t("common.medium")}</s-option>
          <s-option value="large">{t("common.large")}</s-option>
        </s-select>
        <s-select
          label={t("header.closeBorder")}
          value={config.drawerCloseBorder}
          onChange={(e: Event) =>
            updateConfig(
              "drawerCloseBorder",
              (e.currentTarget as HTMLSelectElement).value as
                "none" | "thin" | "normal" | "thick",
            )
          }
        >
          <s-option value="none">{t("common.none")}</s-option>
          <s-option value="thin">{t("common.thin")}</s-option>
          <s-option value="normal">{t("common.normal")}</s-option>
          <s-option value="thick">{t("common.thick")}</s-option>
        </s-select>
        <s-color-field
          label={t("header.closeColor")}
          value={config.drawerCloseColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("drawerCloseColor", value);
          }}
        />
        <s-color-field
          label={t("header.closeBg")}
          value={config.drawerCloseBg}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("drawerCloseBg", value);
          }}
        />
        <s-color-field
          label={t("header.closeHover")}
          value={config.drawerCloseHoverBg}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("drawerCloseHoverBg", value);
          }}
        />
      </s-grid>

      <s-heading>{t("header.backdrop")}</s-heading>
      <s-switch
        label={t("header.blurPage")}
        checked={config.drawerBackdropBlur}
        onChange={(e: Event) =>
          updateConfig(
            "drawerBackdropBlur",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />
      <s-number-field
        label={t("header.backdropDarkness")}
        value={String(config.drawerBackdropOpacity)}
        min={0}
        max={100}
        onChange={(e: Event) =>
          updateConfig(
            "drawerBackdropOpacity",
            Number((e.currentTarget as HTMLInputElement).value),
          )
        }
      />

      <s-heading>{t("header.buttonText")}</s-heading>
      <s-text-field
        label={t("header.addToCartText")}
        value={config.buttonText}
        onChange={(e: Event) =>
          updateConfig(
            "buttonText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-text-field
        label={t("header.soldOutText")}
        value={config.soldOutText}
        onChange={(e: Event) =>
          updateConfig(
            "soldOutText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />

      <FeatureCustomTemplate
        featureKey="header"
      />
    </s-stack>
  );
}
