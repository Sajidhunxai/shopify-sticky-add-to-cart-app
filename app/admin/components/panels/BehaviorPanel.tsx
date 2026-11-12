import type { DrawerAnimation } from "../../../models/bar-config";
import type { PanelProps } from "../../types";

export function BehaviorPanel({ config, updateConfig, t }: PanelProps) {
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
    </s-stack>
  );
}
