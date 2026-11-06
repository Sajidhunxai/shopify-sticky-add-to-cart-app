import { colorFromEvent } from "../../fields/color";
import type { PanelProps } from "../../types";

export function HeaderPanel({ config, updateConfig }: PanelProps) {
  return (
    <s-stack gap="base">
      <s-heading>General</s-heading>
      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-select
          label="Height"
          value={config.drawerHeaderHeight}
          onChange={(e: Event) =>
            updateConfig(
              "drawerHeaderHeight",
              (e.currentTarget as HTMLSelectElement).value as "slim" | "tall",
            )
          }
        >
          <s-option value="slim">Slim</s-option>
          <s-option value="tall">Tall</s-option>
        </s-select>
        <s-select
          label="Bottom border"
          value={config.drawerHeaderBorder}
          onChange={(e: Event) =>
            updateConfig(
              "drawerHeaderBorder",
              (e.currentTarget as HTMLSelectElement).value as "none" | "thin",
            )
          }
        >
          <s-option value="none">None</s-option>
          <s-option value="thin">Thin</s-option>
        </s-select>
        <s-color-field
          label="Header background"
          value={config.drawerHeaderBg}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("drawerHeaderBg", value);
          }}
        />
      </s-grid>

      <s-heading>Title</s-heading>
      <s-text-field
        label="Text (use {{cart_quantity}} for item count)"
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
          label="Alignment"
          value={config.drawerTitleAlign}
          onChange={(e: Event) =>
            updateConfig(
              "drawerTitleAlign",
              (e.currentTarget as HTMLSelectElement).value as "left" | "center",
            )
          }
        >
          <s-option value="left">Side</s-option>
          <s-option value="center">Center</s-option>
        </s-select>
        <s-select
          label="Font weight"
          value={config.drawerTitleWeight}
          onChange={(e: Event) =>
            updateConfig(
              "drawerTitleWeight",
              (e.currentTarget as HTMLSelectElement).value as
                "normal" | "semibold" | "bold",
            )
          }
        >
          <s-option value="normal">Normal</s-option>
          <s-option value="semibold">Semibold</s-option>
          <s-option value="bold">Bold</s-option>
        </s-select>
        <s-number-field
          label="Font size"
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

      <s-heading>Close button</s-heading>
      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-select
          label="Location"
          value={config.drawerCloseSide}
          onChange={(e: Event) =>
            updateConfig(
              "drawerCloseSide",
              (e.currentTarget as HTMLSelectElement).value as "left" | "right",
            )
          }
        >
          <s-option value="left">Left</s-option>
          <s-option value="right">Right</s-option>
        </s-select>
        <s-select
          label="Icon size"
          value={config.drawerCloseIconSize}
          onChange={(e: Event) =>
            updateConfig(
              "drawerCloseIconSize",
              (e.currentTarget as HTMLSelectElement).value as
                "small" | "medium" | "large",
            )
          }
        >
          <s-option value="small">Small</s-option>
          <s-option value="medium">Medium</s-option>
          <s-option value="large">Large</s-option>
        </s-select>
        <s-select
          label="Border"
          value={config.drawerCloseBorder}
          onChange={(e: Event) =>
            updateConfig(
              "drawerCloseBorder",
              (e.currentTarget as HTMLSelectElement).value as
                "none" | "thin" | "normal" | "thick",
            )
          }
        >
          <s-option value="none">None</s-option>
          <s-option value="thin">Thin</s-option>
          <s-option value="normal">Normal</s-option>
          <s-option value="thick">Thick</s-option>
        </s-select>
        <s-color-field
          label="Icon color"
          value={config.drawerCloseColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("drawerCloseColor", value);
          }}
        />
        <s-color-field
          label="Background color"
          value={config.drawerCloseBg}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("drawerCloseBg", value);
          }}
        />
        <s-color-field
          label="Background hover color"
          value={config.drawerCloseHoverBg}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("drawerCloseHoverBg", value);
          }}
        />
      </s-grid>

      <s-heading>Drawer backdrop</s-heading>
      <s-switch
        label="Blur page behind drawer"
        checked={config.drawerBackdropBlur}
        onChange={(e: Event) =>
          updateConfig(
            "drawerBackdropBlur",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />
      <s-number-field
        label="Backdrop darkness (0–100)"
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

      <s-heading>Sticky bar button text</s-heading>
      <s-text-field
        label="Add to cart button text"
        value={config.buttonText}
        onChange={(e: Event) =>
          updateConfig(
            "buttonText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-text-field
        label="Sold out text"
        value={config.soldOutText}
        onChange={(e: Event) =>
          updateConfig(
            "soldOutText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
    </s-stack>
  );
}
