import styles from "../../styles/dashboard.module.css";
import type { BarConfig } from "../../models/bar-config";
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
  return (
    <aside className={styles.studioNav} aria-label="Settings menu">
      <label className={styles.navSelectLabel}>
        Display mode
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
          <option value="bar">Sticky Add to Cart Bar</option>
          <option value="slider">Sticky Cart + Drawer</option>
          <option value="quickbuy">Quick Buy Cart</option>
        </select>
      </label>

      {NAV_GROUPS.map((group) => (
        <div key={group.title} className={styles.navGroup}>
          <p className={styles.navGroupTitle}>{group.title}</p>
          {group.items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.navItem} ${
                nav === item.id ? styles.navItemActive : ""
              }`}
              onClick={() => onNavChange(item.id)}
            >
              <span>{item.label}</span>
              {item.soon ? <span className={styles.navSoon}>Soon</span> : null}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}
