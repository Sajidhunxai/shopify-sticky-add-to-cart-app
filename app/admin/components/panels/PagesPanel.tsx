import styles from "../../../styles/dashboard.module.css";
import { usePanelState } from "../../hooks/usePanelState";

export function PagesPanel() {
  const { config, updateConfig, t } = usePanelState();
  return (
    <s-stack gap="base">
      <s-heading>{t("pages.stickyShowOn")}</s-heading>
      <div className={styles.toggleRow}>
        <s-switch
          label={t("pages.product")}
          checked={config.showOnProduct}
          onChange={(e: Event) =>
            updateConfig(
              "showOnProduct",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("pages.collection")}
          checked={config.showOnCollection}
          onChange={(e: Event) =>
            updateConfig(
              "showOnCollection",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("pages.home")}
          checked={config.showOnHome}
          onChange={(e: Event) =>
            updateConfig(
              "showOnHome",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("pages.search")}
          checked={config.showOnSearch}
          onChange={(e: Event) =>
            updateConfig(
              "showOnSearch",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("pages.other")}
          checked={config.showOnOther}
          onChange={(e: Event) =>
            updateConfig(
              "showOnOther",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("pages.mobile")}
          checked={config.showMobile}
          onChange={(e: Event) =>
            updateConfig(
              "showMobile",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("pages.desktop")}
          checked={config.showDesktop}
          onChange={(e: Event) =>
            updateConfig(
              "showDesktop",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
      </div>

      <s-heading>{t("pages.drawerShowOn")}</s-heading>
      <s-paragraph>{t("pages.drawerHelp")}</s-paragraph>
      <div className={styles.toggleRow}>
        <s-switch
          label={t("pages.product")}
          checked={config.drawerShowOnProduct}
          onChange={(e: Event) =>
            updateConfig(
              "drawerShowOnProduct",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("pages.collection")}
          checked={config.drawerShowOnCollection}
          onChange={(e: Event) =>
            updateConfig(
              "drawerShowOnCollection",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("pages.home")}
          checked={config.drawerShowOnHome}
          onChange={(e: Event) =>
            updateConfig(
              "drawerShowOnHome",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("pages.search")}
          checked={config.drawerShowOnSearch}
          onChange={(e: Event) =>
            updateConfig(
              "drawerShowOnSearch",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("pages.other")}
          checked={config.drawerShowOnOther}
          onChange={(e: Event) =>
            updateConfig(
              "drawerShowOnOther",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("pages.drawerMobile")}
          checked={config.drawerShowMobile}
          onChange={(e: Event) =>
            updateConfig(
              "drawerShowMobile",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label={t("pages.drawerDesktop")}
          checked={config.drawerShowDesktop}
          onChange={(e: Event) =>
            updateConfig(
              "drawerShowDesktop",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
      </div>
    </s-stack>
  );
}
