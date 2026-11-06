import styles from "../../../styles/dashboard.module.css";
import type { PanelProps } from "../../types";

export function PagesPanel({ config, updateConfig }: PanelProps) {
  return (
    <s-stack gap="base">
      <s-heading>Sticky bar — show on</s-heading>
      <div className={styles.toggleRow}>
        <s-switch
          label="Product pages"
          checked={config.showOnProduct}
          onChange={(e: Event) =>
            updateConfig(
              "showOnProduct",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Collection pages"
          checked={config.showOnCollection}
          onChange={(e: Event) =>
            updateConfig(
              "showOnCollection",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Homepage"
          checked={config.showOnHome}
          onChange={(e: Event) =>
            updateConfig(
              "showOnHome",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Search results"
          checked={config.showOnSearch}
          onChange={(e: Event) =>
            updateConfig(
              "showOnSearch",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Other pages"
          checked={config.showOnOther}
          onChange={(e: Event) =>
            updateConfig(
              "showOnOther",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Show on mobile"
          checked={config.showMobile}
          onChange={(e: Event) =>
            updateConfig(
              "showMobile",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Show on desktop"
          checked={config.showDesktop}
          onChange={(e: Event) =>
            updateConfig(
              "showDesktop",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
      </div>

      <s-heading>Cart drawer — show on</s-heading>
      <s-paragraph>
        Independent of the sticky bar. Controls where the cart drawer can open
        (including header cart icon).
      </s-paragraph>
      <div className={styles.toggleRow}>
        <s-switch
          label="Product pages"
          checked={config.drawerShowOnProduct}
          onChange={(e: Event) =>
            updateConfig(
              "drawerShowOnProduct",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Collection pages"
          checked={config.drawerShowOnCollection}
          onChange={(e: Event) =>
            updateConfig(
              "drawerShowOnCollection",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Homepage"
          checked={config.drawerShowOnHome}
          onChange={(e: Event) =>
            updateConfig(
              "drawerShowOnHome",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Search results"
          checked={config.drawerShowOnSearch}
          onChange={(e: Event) =>
            updateConfig(
              "drawerShowOnSearch",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Other pages"
          checked={config.drawerShowOnOther}
          onChange={(e: Event) =>
            updateConfig(
              "drawerShowOnOther",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Show drawer on mobile"
          checked={config.drawerShowMobile}
          onChange={(e: Event) =>
            updateConfig(
              "drawerShowMobile",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
        <s-switch
          label="Show drawer on desktop"
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
