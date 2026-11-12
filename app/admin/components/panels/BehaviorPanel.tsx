import { usePanelState } from "../../hooks/usePanelState";
import type {
  DrawerAnimation,
  ToastPlacement,
  ToastPosition,
  ToastStyle,
} from "../../../models/bar-config";
import { colorFromEvent } from "../../fields/color";

export function BehaviorPanel() {
  const { config, updateConfig, t } = usePanelState();
  return (
    <s-stack gap="base">
      <s-switch
        label={t("behavior.hideNearForm")}
        checked={config.hideNearForm}
        onChange={(e: Event) =>
          updateConfig(
            "hideNearForm",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />
      <s-select
        label={t("behavior.drawerAnim")}
        value={config.drawerAnimation}
        details={t("behavior.drawerAnimHelp")}
        onChange={(e: Event) =>
          updateConfig(
            "drawerAnimation",
            (e.currentTarget as HTMLSelectElement).value as DrawerAnimation,
          )
        }
      >
        <s-option value="slide">{t("behavior.animSlide")}</s-option>
        <s-option value="fade">{t("behavior.animFade")}</s-option>
        <s-option value="scale">{t("behavior.animScale")}</s-option>
        <s-option value="none">{t("common.none")}</s-option>
      </s-select>
      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-number-field
          label={t("behavior.scrollMobile")}
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
          label={t("behavior.scrollDesktop")}
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
          label={t("behavior.edgeOffset")}
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
          label={t("behavior.desktopMaxWidth")}
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

      <s-heading>{t("behavior.toastHeading")}</s-heading>
      <s-paragraph>{t("behavior.toastHelp")}</s-paragraph>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <s-switch
          label={t("behavior.toastShowSuccess")}
          checked={config.toastShowSuccess}
          onChange={(e: Event) =>
            updateConfig(
              "toastShowSuccess",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("behavior.toastShowError")}
          checked={config.toastShowError}
          onChange={(e: Event) =>
            updateConfig(
              "toastShowError",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("behavior.toastShowRemove")}
          checked={config.toastShowRemove}
          onChange={(e: Event) =>
            updateConfig(
              "toastShowRemove",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("behavior.toastShowUpdate")}
          checked={config.toastShowUpdate}
          onChange={(e: Event) =>
            updateConfig(
              "toastShowUpdate",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
      </div>
      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-select
          label={t("behavior.toastPlacement")}
          value={config.toastPlacement}
          onChange={(e: Event) =>
            updateConfig(
              "toastPlacement",
              (e.currentTarget as HTMLSelectElement).value as ToastPlacement,
            )
          }
        >
          <s-option value="drawer">{t("behavior.toastInDrawer")}</s-option>
          <s-option value="page">{t("behavior.toastOnPage")}</s-option>
        </s-select>
        <s-select
          label={t("behavior.toastPosition")}
          value={config.toastPosition}
          onChange={(e: Event) =>
            updateConfig(
              "toastPosition",
              (e.currentTarget as HTMLSelectElement).value as ToastPosition,
            )
          }
        >
          <s-option value="bottom">{t("behavior.posBottom")}</s-option>
          <s-option value="top">{t("behavior.posTop")}</s-option>
          <s-option value="bottom-left">{t("behavior.posBottomLeft")}</s-option>
          <s-option value="bottom-right">
            {t("behavior.posBottomRight")}
          </s-option>
          <s-option value="top-left">{t("behavior.posTopLeft")}</s-option>
          <s-option value="top-right">{t("behavior.posTopRight")}</s-option>
        </s-select>
        <s-select
          label={t("behavior.toastStyle")}
          value={config.toastStyle}
          onChange={(e: Event) =>
            updateConfig(
              "toastStyle",
              (e.currentTarget as HTMLSelectElement).value as ToastStyle,
            )
          }
        >
          <s-option value="solid">{t("behavior.styleSolid")}</s-option>
          <s-option value="soft">{t("behavior.styleSoft")}</s-option>
          <s-option value="outline">{t("behavior.styleOutline")}</s-option>
          <s-option value="minimal">{t("behavior.styleMinimal")}</s-option>
        </s-select>
        <s-number-field
          label={t("behavior.toastRadius")}
          value={String(config.toastRadius)}
          min={0}
          max={32}
          onChange={(e: Event) =>
            updateConfig(
              "toastRadius",
              Number((e.currentTarget as HTMLInputElement).value),
            )
          }
        />
        <s-number-field
          label={t("behavior.toastFontSize")}
          value={String(config.toastFontSize)}
          min={11}
          max={20}
          onChange={(e: Event) =>
            updateConfig(
              "toastFontSize",
              Number((e.currentTarget as HTMLInputElement).value),
            )
          }
        />
      </s-grid>
      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-color-field
          label={t("behavior.toastSuccessBg")}
          value={config.toastSuccessBg}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("toastSuccessBg", value);
          }}
        />
        <s-color-field
          label={t("behavior.toastSuccessText")}
          value={config.toastSuccessText}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("toastSuccessText", value);
          }}
        />
        <s-color-field
          label={t("behavior.toastErrorBg")}
          value={config.toastErrorBg}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("toastErrorBg", value);
          }}
        />
        <s-color-field
          label={t("behavior.toastErrorText")}
          value={config.toastErrorText}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("toastErrorText", value);
          }}
        />
      </s-grid>
    </s-stack>
  );
}
