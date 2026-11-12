import styles from "../../styles/dashboard.module.css";
import type { BarConfig } from "../../models/bar-config";
import { useI18n } from "../../i18n";
import { NAV_GROUPS, type NavId } from "../nav";
import type { UpdateConfig } from "../types";

export type StudioNavProps = {
  config: BarConfig;
  updateConfig: UpdateConfig;
  nav: NavId;
  onNavChange: (id: NavId) => void;
};

export function StudioNav({
  config,
  updateConfig,
  nav,
  onNavChange,
}: StudioNavProps) {
  const { t } = useI18n();

  return (
    <aside className={styles.studioNav} aria-label={t("nav.settings")}>
      <label className={styles.navSelectLabel}>
        {t("nav.displayMode")}
        <select
          className={styles.navSelect}
          value={config.displayMode}
          onChange={(e) =>
            updateConfig(
              "displayMode",
              e.target.value as BarConfig["displayMode"],
            )
          }
        >
          <option value="bar">{t("nav.modeBar")}</option>
          <option value="slider">{t("nav.modeSlider")}</option>
          <option value="quickbuy">{t("nav.modeQuickbuy")}</option>
        </select>
      </label>

      {NAV_GROUPS.map((group) => (
        <div key={group.titleKey} className={styles.navGroup}>
          <p className={styles.navGroupTitle}>{t(group.titleKey)}</p>
          {group.items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.navItem} ${
                nav === item.id ? styles.navItemActive : ""
              }`}
              onClick={() => onNavChange(item.id)}
            >
              <span>{t(item.labelKey)}</span>
              {item.soon ? (
                <span className={styles.navSoon}>{t("nav.soon")}</span>
              ) : null}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}
