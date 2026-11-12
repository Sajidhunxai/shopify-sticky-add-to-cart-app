import styles from "../../../styles/dashboard.module.css";
import { FeatureCustomTemplate } from "../FeatureCustomTemplate";
import { colorFromEvent } from "../../fields/color";
import type { PanelProps } from "../../types";

export function AnnouncementsPanel({ config, updateConfig, t }: PanelProps) {
  return (
    <s-stack gap="base">
      <s-stack direction="inline" gap="base">
        <s-badge tone={config.announcementEnabled ? "success" : "neutral"}>
          {config.announcementEnabled ? t("common.active") : t("common.disabled")}
        </s-badge>
        <s-switch
          label={
            config.announcementEnabled
              ? t("announcements.disable")
              : t("announcements.enable")
          }
          checked={config.announcementEnabled}
          onChange={(e: Event) =>
            updateConfig(
              "announcementEnabled",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
      </s-stack>

      <s-select
        label={t("announcements.height")}
        value={config.announcementHeight}
        onChange={(e: Event) =>
          updateConfig(
            "announcementHeight",
            (e.currentTarget as HTMLSelectElement).value as
              "slim" | "normal" | "thick",
          )
        }
      >
        <s-option value="slim">{t("announcements.slim")}</s-option>
        <s-option value="normal">{t("common.normal")}</s-option>
        <s-option value="thick">{t("common.thick")}</s-option>
      </s-select>

      <s-select
        label={t("announcements.position")}
        value={config.announcementPosition}
        onChange={(e: Event) =>
          updateConfig(
            "announcementPosition",
            (e.currentTarget as HTMLSelectElement).value as "before" | "after",
          )
        }
      >
        <s-option value="before">{t("announcements.before")}</s-option>
        <s-option value="after">{t("announcements.after")}</s-option>
      </s-select>

      <s-text-field
        label={t("announcements.timer")}
        value={config.announcementTimer}
        onChange={(e: Event) =>
          updateConfig(
            "announcementTimer",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-paragraph>{t("announcements.timerHelp")}</s-paragraph>

      <label className={styles.codeFieldLabel} htmlFor="announcement-text">
        {t("announcements.text")}
      </label>
      <textarea
        id="announcement-text"
        className={styles.codeField}
        rows={3}
        value={config.announcementText}
        placeholder={t("announcements.textPlaceholder")}
        onChange={(e) => updateConfig("announcementText", e.target.value)}
        style={{ background: "#fff", color: "#111", minHeight: 72 }}
      />

      <s-number-field
        label={t("announcements.fontSize")}
        value={String(config.announcementFontSize)}
        min={10}
        max={24}
        onChange={(e: Event) =>
          updateConfig(
            "announcementFontSize",
            Number((e.currentTarget as HTMLInputElement).value),
          )
        }
      />

      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-color-field
          label={t("announcements.bg")}
          value={config.announcementBg}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("announcementBg", value);
          }}
        />
        <s-color-field
          label={t("announcements.border")}
          value={config.announcementBorderColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("announcementBorderColor", value);
          }}
        />
        <s-color-field
          label={t("announcements.textColor")}
          value={config.announcementTextColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("announcementTextColor", value);
          }}
        />
      </s-grid>

      <FeatureCustomTemplate
        featureKey="announcement"
        config={config}
        updateConfig={updateConfig}
      />
    </s-stack>
  );
}
