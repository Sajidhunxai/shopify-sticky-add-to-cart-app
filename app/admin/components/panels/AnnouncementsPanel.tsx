import { colorFromEvent } from "../../fields/color";
import type { PanelProps } from "../../types";

export function AnnouncementsPanel({ config, updateConfig }: PanelProps) {
  return (
    <s-stack gap="base">
      <s-stack direction="inline" gap="base">
        <s-badge tone={config.announcementEnabled ? "success" : "neutral"}>
          {config.announcementEnabled ? "Active" : "Disabled"}
        </s-badge>
        <s-switch
          label={
            config.announcementEnabled
              ? "Disable announcement"
              : "Enable announcement"
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
        label="Height"
        value={config.announcementHeight}
        onChange={(e: Event) =>
          updateConfig(
            "announcementHeight",
            (e.currentTarget as HTMLSelectElement).value as
              "slim" | "normal" | "thick",
          )
        }
      >
        <s-option value="slim">Slim</s-option>
        <s-option value="normal">Normal</s-option>
        <s-option value="thick">Thick</s-option>
      </s-select>

      <s-select
        label="Position"
        value={config.announcementPosition}
        onChange={(e: Event) =>
          updateConfig(
            "announcementPosition",
            (e.currentTarget as HTMLSelectElement).value as "before" | "after",
          )
        }
      >
        <s-option value="before">Before products</s-option>
        <s-option value="after">After products</s-option>
      </s-select>

      <s-text-field
        label="Timer duration (MM:SS)"
        value={config.announcementTimer}
        onChange={(e: Event) =>
          updateConfig(
            "announcementTimer",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-paragraph>
        Use MM:SS format (example: 15:00). Put <strong>{"{timer}"}</strong> in
        the announcement text to show the countdown.
      </s-paragraph>

      <s-text-field
        label="Announcement text"
        value={config.announcementText}
        onChange={(e: Event) =>
          updateConfig(
            "announcementText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />

      <s-number-field
        label="Font size"
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
          label="Background color"
          value={config.announcementBg}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("announcementBg", value);
          }}
        />
        <s-color-field
          label="Border color"
          value={config.announcementBorderColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("announcementBorderColor", value);
          }}
        />
        <s-color-field
          label="Text color"
          value={config.announcementTextColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("announcementTextColor", value);
          }}
        />
      </s-grid>
    </s-stack>
  );
}
