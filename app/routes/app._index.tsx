import { useEffect, useState, type CSSProperties, type Dispatch, type SetStateAction } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import {
  barConfigFromFormData,
  getShopSettings,
  saveBarConfig,
  setShopPlan,
  syncStorefrontSettings,
  type BarConfig,
} from "../models/settings.server";
import styles from "../styles/dashboard.module.css";

type NavId =
  | "design"
  | "header"
  | "display"
  | "cart-items"
  | "announcements"
  | "rewards"
  | "recommendations"
  | "discounts"
  | "cart-summary"
  | "trust"
  | "pages"
  | "behavior"
  | "plan"
  | "setup";

type NavItem = {
  id: NavId;
  label: string;
  soon?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    title: "General",
    items: [
      { id: "design", label: "Design" },
      { id: "header", label: "Header & text" },
      { id: "display", label: "Display style" },
    ],
  },
  {
    title: "Body",
    items: [
      { id: "cart-items", label: "Cart items" },
      { id: "announcements", label: "Announcements", soon: true },
      { id: "rewards", label: "Free shipping / rewards", soon: true },
      { id: "recommendations", label: "Recommendations", soon: true },
      { id: "discounts", label: "Discount codes", soon: true },
    ],
  },
  {
    title: "Footer",
    items: [
      { id: "cart-summary", label: "Cart summary" },
      { id: "trust", label: "Trust badges", soon: true },
    ],
  },
  {
    title: "Settings",
    items: [
      { id: "pages", label: "Pages & devices" },
      { id: "behavior", label: "Behavior" },
      { id: "plan", label: "Plan & billing" },
      { id: "setup", label: "Setup" },
    ],
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await getShopSettings(session.shop);

  return {
    shop: session.shop,
    plan: settings.plan,
    hideBranding: settings.hideBranding,
    config: settings.config,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");

  if (intent === "save") {
    const config = barConfigFromFormData(formData);
    const settings = await saveBarConfig(session.shop, config);
    await syncStorefrontSettings(admin, settings.hideBranding, config);
    return { ok: true, message: "Settings saved and synced to storefront." };
  }

  if (intent === "upgrade") {
    const settings = await setShopPlan(session.shop, "pro");
    const current = await getShopSettings(session.shop);
    await syncStorefrontSettings(admin, settings.hideBranding, current.config);
    return { ok: true, message: "Upgraded to Pro. Branding removed." };
  }

  if (intent === "downgrade") {
    const settings = await setShopPlan(session.shop, "free");
    const current = await getShopSettings(session.shop);
    await syncStorefrontSettings(admin, settings.hideBranding, current.config);
    return { ok: true, message: "Switched to Free. Branding enabled." };
  }

  if (intent === "sync") {
    const settings = await getShopSettings(session.shop);
    await syncStorefrontSettings(admin, settings.hideBranding, settings.config);
    return { ok: true, message: "Storefront settings synced." };
  }

  return { ok: false, message: "Unknown action" };
};

function updateConfig<K extends keyof BarConfig>(
  setConfig: Dispatch<SetStateAction<BarConfig>>,
  key: K,
  value: BarConfig[K],
) {
  setConfig((prev) => ({ ...prev, [key]: value }));
}

function colorFromEvent(e: Event): string {
  const target = e.currentTarget as HTMLInputElement & { value?: string };
  const fromTarget = String(target?.value || "").trim();
  if (fromTarget) return fromTarget;
  const detail = (e as CustomEvent).detail;
  if (typeof detail === "string" && detail.trim()) return detail.trim();
  if (detail && typeof detail === "object" && "value" in detail) {
    return String((detail as { value: unknown }).value || "").trim();
  }
  return "";
}

function previewPositionStyle(
  position: BarConfig["barPosition"],
  edge: number,
): CSSProperties {
  const offset = Math.max(8, edge || 12);
  const floating: CSSProperties = {
    width: "max-content",
    maxWidth: "calc(100% - 24px)",
    left: "auto",
    right: "auto",
  };

  switch (position) {
    case "top":
      return { top: offset, bottom: "auto", left: 12, right: 12 };
    case "top-left":
      return { ...floating, top: offset, bottom: "auto", left: offset };
    case "top-right":
      return { ...floating, top: offset, bottom: "auto", right: offset };
    case "bottom-left":
      return { ...floating, bottom: offset, left: offset };
    case "bottom-right":
      return { ...floating, bottom: offset, right: offset };
    case "left":
      return {
        ...floating,
        top: "50%",
        bottom: "auto",
        left: offset,
        transform: "translateY(-50%)",
      };
    case "right":
      return {
        ...floating,
        top: "50%",
        bottom: "auto",
        right: offset,
        transform: "translateY(-50%)",
      };
    default:
      return { bottom: offset, left: 12, right: 12 };
  }
}

function ComingSoon({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div className={styles.soonCard}>
      <s-badge tone="info">Coming soon</s-badge>
      <h3 className={styles.panelTitle}>{title}</h3>
      <p className={styles.soonText}>{blurb}</p>
      <p className={styles.soonHint}>
        Menu item is ready in the sidebar. Storefront feature will ship in a
        later update.
      </p>
    </div>
  );
}

export default function Index() {
  const { shop, plan, hideBranding, config: initialConfig } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const shopify = useAppBridge();
  const busy = navigation.state !== "idle";
  const isPro = plan === "pro";

  const [config, setConfig] = useState<BarConfig>(initialConfig);
  const [nav, setNav] = useState<NavId>("design");

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  useEffect(() => {
    if (actionData?.message) {
      shopify.toast.show(actionData.message);
    }
  }, [actionData?.message, shopify]);

  const handleSave = () => {
    const fd = new FormData();
    fd.set("intent", "save");
    (Object.keys(config) as (keyof BarConfig)[]).forEach((key) => {
      fd.set(key, String(config[key]));
    });
    submit(fd, { method: "post" });
  };

  const hexToRgba = (hex: string, opacityPct: number) => {
    const raw = hex.replace("#", "");
    const full =
      raw.length === 3
        ? raw
            .split("")
            .map((c) => c + c)
            .join("")
        : raw;
    if (full.length !== 6) return hex;
    const n = Number.parseInt(full, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${(opacityPct / 100).toFixed(2)})`;
  };

  const previewBg =
    config.backgroundStyle === "gradient"
      ? `linear-gradient(135deg, ${hexToRgba(config.backgroundColor, config.backgroundOpacity)}, ${hexToRgba(config.backgroundColor, Math.max(40, config.backgroundOpacity - 25))})`
      : hexToRgba(config.backgroundColor, config.backgroundOpacity);

  const previewImageRadius =
    config.imageShape === "circle"
      ? "999px"
      : config.imageShape === "square"
        ? "0px"
        : `${config.imageRadius}px`;

  const previewBarStyle: CSSProperties = {
    background: previewBg,
    color: config.textColor,
    borderRadius: `${config.barRadius}px`,
    padding: `${config.paddingY}px ${config.paddingX}px`,
    border: `${config.borderWidth}px solid ${config.borderColor}`,
    boxShadow: config.showShadow ? "0 -8px 28px rgba(0,0,0,0.14)" : "none",
    gap: `${config.contentGap}px`,
    backdropFilter:
      config.backgroundStyle === "blur" ? "saturate(160%) blur(12px)" : undefined,
    WebkitBackdropFilter:
      config.backgroundStyle === "blur" ? "saturate(160%) blur(12px)" : undefined,
    flexDirection: config.layout === "stacked" ? "column" : "row",
    alignItems: config.layout === "stacked" ? "stretch" : "center",
    ...previewPositionStyle(config.barPosition, config.desktopBottomOffset),
  };

  const activeLabel =
    NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === nav)?.label ||
    "Design";

  return (
    <s-page heading="Sticky Add to Cart">
      <s-button
        slot="primary-action"
        variant="primary"
        onClick={handleSave}
        {...(busy ? { loading: true } : {})}
      >
        Save settings
      </s-button>

      <s-banner
        tone={config.enabled ? "success" : "warning"}
        heading={config.enabled ? "Sticky bar ready" : "Sticky bar is off"}
      >
        {config.enabled
          ? "Use the left menu to edit Design, Header, Cart items, and more. Save to sync the storefront."
          : "Turn the sticky bar on under Cart items / Setup, then save."}
      </s-banner>

      <div className={styles.studio}>
        <aside className={styles.studioNav} aria-label="Settings menu">
          <label className={styles.navSelectLabel}>
            Display mode
            <select
              className={styles.navSelect}
              value={config.displayMode}
              onChange={(e) =>
                updateConfig(
                  setConfig,
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
                  onClick={() => setNav(item.id)}
                >
                  <span>{item.label}</span>
                  {item.soon ? (
                    <span className={styles.navSoon}>Soon</span>
                  ) : null}
                </button>
              ))}
            </div>
          ))}
        </aside>

        <section className={styles.studioPanel}>
          <header className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>{activeLabel}</h2>
            <p className={styles.panelSub}>
              Changes update the preview instantly. Click Save settings to
              publish.
            </p>
          </header>

          {nav === "design" && (
            <s-stack gap="base">
              <div className={styles.colorLegend}>
                {(
                  [
                    ["Popup background", config.backgroundColor],
                    ["Title & price", config.textColor],
                    ["Button", config.buttonBackground],
                    ["Button text", config.buttonTextColor],
                    ["Accent", config.accentColor],
                    ["Border", config.borderColor],
                  ] as const
                ).map(([label, hex]) => (
                  <div key={label} className={styles.colorSwatch}>
                    <span
                      className={styles.colorSwatchDot}
                      style={{ background: hex }}
                    />
                    <div className={styles.colorSwatchMeta}>
                      <strong>{label}</strong>
                      <span>{hex}</span>
                    </div>
                  </div>
                ))}
              </div>

              <s-grid gridTemplateColumns="1fr 1fr" gap="base">
                <s-color-field
                  label="Popup / bar background"
                  value={config.backgroundColor}
                  onChange={(e: Event) => {
                    const value = colorFromEvent(e);
                    if (value) updateConfig(setConfig, "backgroundColor", value);
                  }}
                />
                <s-color-field
                  label="Title & price text"
                  value={config.textColor}
                  onChange={(e: Event) => {
                    const value = colorFromEvent(e);
                    if (value) updateConfig(setConfig, "textColor", value);
                  }}
                />
                <s-color-field
                  label="Button color"
                  value={config.buttonBackground}
                  onChange={(e: Event) => {
                    const value = colorFromEvent(e);
                    if (value)
                      updateConfig(setConfig, "buttonBackground", value);
                  }}
                />
                <s-color-field
                  label="Button text color"
                  value={config.buttonTextColor}
                  onChange={(e: Event) => {
                    const value = colorFromEvent(e);
                    if (value)
                      updateConfig(setConfig, "buttonTextColor", value);
                  }}
                />
                <s-color-field
                  label="Accent color (drawer highlights)"
                  value={config.accentColor}
                  onChange={(e: Event) => {
                    const value = colorFromEvent(e);
                    if (value) updateConfig(setConfig, "accentColor", value);
                  }}
                />
                <s-color-field
                  label="Border color"
                  value={config.borderColor}
                  onChange={(e: Event) => {
                    const value = colorFromEvent(e);
                    if (value) updateConfig(setConfig, "borderColor", value);
                  }}
                />
                <s-select
                  label="Background style"
                  value={config.backgroundStyle}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "backgroundStyle",
                      (e.currentTarget as HTMLSelectElement)
                        .value as BarConfig["backgroundStyle"],
                    )
                  }
                >
                  <s-option value="solid">Solid color</s-option>
                  <s-option value="blur">Glass blur</s-option>
                  <s-option value="gradient">Soft gradient</s-option>
                </s-select>
                <s-number-field
                  label="Background opacity %"
                  value={String(config.backgroundOpacity)}
                  min={40}
                  max={100}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "backgroundOpacity",
                      Number((e.currentTarget as HTMLInputElement).value),
                    )
                  }
                />
                <s-number-field
                  label="Corner radius (bar)"
                  value={String(config.barRadius)}
                  min={0}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "barRadius",
                      Number((e.currentTarget as HTMLInputElement).value),
                    )
                  }
                />
                <s-number-field
                  label="Button corner radius"
                  value={String(config.buttonRadius)}
                  min={0}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "buttonRadius",
                      Number((e.currentTarget as HTMLInputElement).value),
                    )
                  }
                />
              </s-grid>
              <s-switch
                label="Show shadow"
                checked={config.showShadow}
                onChange={(e: Event) =>
                  updateConfig(
                    setConfig,
                    "showShadow",
                    (e.currentTarget as HTMLInputElement).checked,
                  )
                }
              />
            </s-stack>
          )}

          {nav === "header" && (
            <s-stack gap="base">
              <s-text-field
                label="Add to cart button text"
                value={config.buttonText}
                onChange={(e: Event) =>
                  updateConfig(
                    setConfig,
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
                    setConfig,
                    "soldOutText",
                    (e.currentTarget as HTMLInputElement).value,
                  )
                }
              />
              <s-text-field
                label="Cart drawer title"
                value={config.drawerTitle}
                onChange={(e: Event) =>
                  updateConfig(
                    setConfig,
                    "drawerTitle",
                    (e.currentTarget as HTMLInputElement).value,
                  )
                }
              />
              <s-text-field
                label="Checkout button text"
                value={config.drawerCheckoutText}
                onChange={(e: Event) =>
                  updateConfig(
                    setConfig,
                    "drawerCheckoutText",
                    (e.currentTarget as HTMLInputElement).value,
                  )
                }
              />
            </s-stack>
          )}

          {nav === "display" && (
            <s-stack gap="base">
              <div className={styles.modeGrid} role="radiogroup" aria-label="Display style">
                {(
                  [
                    {
                      id: "bar" as const,
                      title: "Sticky bar",
                      blurb: "Classic sticky Add to cart bar",
                    },
                    {
                      id: "slider" as const,
                      title: "Cart drawer",
                      blurb: "Bar + slide-out cart after add",
                    },
                    {
                      id: "quickbuy" as const,
                      title: "Quick buy",
                      blurb: "Floating button that expands",
                    },
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    className={`${styles.modeCard} ${
                      config.displayMode === mode.id ? styles.modeCardActive : ""
                    }`}
                    onClick={() =>
                      updateConfig(setConfig, "displayMode", mode.id)
                    }
                    aria-pressed={config.displayMode === mode.id}
                  >
                    <strong>{mode.title}</strong>
                    <span>{mode.blurb}</span>
                  </button>
                ))}
              </div>
              <s-grid gridTemplateColumns="1fr 1fr" gap="base">
                <s-select
                  label="Bar layout"
                  value={config.layout}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "layout",
                      (e.currentTarget as HTMLSelectElement)
                        .value as BarConfig["layout"],
                    )
                  }
                >
                  <s-option value="row">Row</s-option>
                  <s-option value="compact">Compact pill</s-option>
                  <s-option value="stacked">Stacked</s-option>
                </s-select>
                <s-select
                  label="Bar position"
                  value={config.barPosition}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "barPosition",
                      (e.currentTarget as HTMLSelectElement)
                        .value as BarConfig["barPosition"],
                    )
                  }
                >
                  <s-option value="bottom">Bottom center</s-option>
                  <s-option value="bottom-left">Bottom left</s-option>
                  <s-option value="bottom-right">Bottom right</s-option>
                  <s-option value="top">Top center</s-option>
                  <s-option value="top-left">Top left</s-option>
                  <s-option value="top-right">Top right</s-option>
                  <s-option value="left">Middle left</s-option>
                  <s-option value="right">Middle right</s-option>
                </s-select>
                <s-select
                  label="Image shape"
                  value={config.imageShape}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "imageShape",
                      (e.currentTarget as HTMLSelectElement)
                        .value as BarConfig["imageShape"],
                    )
                  }
                >
                  <s-option value="rounded">Rounded</s-option>
                  <s-option value="circle">Circle</s-option>
                  <s-option value="square">Square</s-option>
                </s-select>
                <s-select
                  label="Button size"
                  value={config.buttonSize}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "buttonSize",
                      (e.currentTarget as HTMLSelectElement)
                        .value as BarConfig["buttonSize"],
                    )
                  }
                >
                  <s-option value="normal">Normal</s-option>
                  <s-option value="large">Large</s-option>
                  <s-option value="full">Full width</s-option>
                </s-select>
              </s-grid>
            </s-stack>
          )}

          {nav === "cart-items" && (
            <s-stack gap="base">
              <div className={styles.toggleRow}>
                <s-switch
                  label="Enable sticky bar"
                  checked={config.enabled}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "enabled",
                      (e.currentTarget as HTMLInputElement).checked,
                    )
                  }
                />
                <s-switch
                  label="Show product image"
                  checked={config.showImage}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "showImage",
                      (e.currentTarget as HTMLInputElement).checked,
                    )
                  }
                />
                <s-switch
                  label="Show product title"
                  checked={config.showTitle}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "showTitle",
                      (e.currentTarget as HTMLInputElement).checked,
                    )
                  }
                />
                <s-switch
                  label="Show price"
                  checked={config.showPrice}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "showPrice",
                      (e.currentTarget as HTMLInputElement).checked,
                    )
                  }
                />
                <s-switch
                  label="Show quantity selector"
                  checked={config.showQuantity}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "showQuantity",
                      (e.currentTarget as HTMLInputElement).checked,
                    )
                  }
                />
              </div>
              <s-grid gridTemplateColumns="1fr 1fr" gap="base">
                <s-number-field
                  label="Image size"
                  value={String(config.imageSize)}
                  min={32}
                  max={120}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "imageSize",
                      Number((e.currentTarget as HTMLInputElement).value),
                    )
                  }
                />
                <s-number-field
                  label="Content gap"
                  value={String(config.contentGap)}
                  min={4}
                  max={32}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "contentGap",
                      Number((e.currentTarget as HTMLInputElement).value),
                    )
                  }
                />
              </s-grid>
            </s-stack>
          )}

          {nav === "announcements" && (
            <ComingSoon
              title="Announcements"
              blurb="Promo banners and countdown messages inside the cart drawer."
            />
          )}
          {nav === "rewards" && (
            <ComingSoon
              title="Free shipping / rewards"
              blurb="Progress bar toward free shipping or tiered rewards in the drawer."
            />
          )}
          {nav === "recommendations" && (
            <ComingSoon
              title="Recommendations & upsells"
              blurb="Product recommendations and one-click upsells in the cart drawer."
            />
          )}
          {nav === "discounts" && (
            <ComingSoon
              title="Discount codes"
              blurb="Let shoppers apply discount codes directly in the sticky cart drawer."
            />
          )}
          {nav === "trust" && (
            <ComingSoon
              title="Trust badges"
              blurb="Payment icons and trust badges under the checkout button."
            />
          )}

          {nav === "cart-summary" && (
            <s-stack gap="base">
              <s-select
                label="After adding to cart"
                value={config.afterAdd}
                onChange={(e: Event) =>
                  updateConfig(
                    setConfig,
                    "afterAdd",
                    (e.currentTarget as HTMLSelectElement)
                      .value as BarConfig["afterAdd"],
                  )
                }
              >
                <s-option value="stay">Stay on page</s-option>
                <s-option value="cart">Go to cart</s-option>
                <s-option value="drawer">Open cart drawer (if supported)</s-option>
              </s-select>
              <s-text-field
                label="Checkout button text"
                value={config.drawerCheckoutText}
                onChange={(e: Event) =>
                  updateConfig(
                    setConfig,
                    "drawerCheckoutText",
                    (e.currentTarget as HTMLInputElement).value,
                  )
                }
              />
              <s-paragraph>
                Tip: set <strong>Display style → Cart drawer</strong> (required).
                “Open cart drawer” then opens Sticky ATC’s drawer. Also set the
                theme Cart type to <strong>Page</strong> so the header bag does
                not jump to /cart.
              </s-paragraph>
            </s-stack>
          )}

          {nav === "pages" && (
            <s-stack gap="base">
              <div className={styles.toggleRow}>
                <s-switch
                  label="Product pages"
                  checked={config.showOnProduct}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
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
                      setConfig,
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
                      setConfig,
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
                      setConfig,
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
                      setConfig,
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
                      setConfig,
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
                      setConfig,
                      "showDesktop",
                      (e.currentTarget as HTMLInputElement).checked,
                    )
                  }
                />
              </div>
            </s-stack>
          )}

          {nav === "behavior" && (
            <s-stack gap="base">
              <s-switch
                label="Hide when main Add to cart is visible"
                checked={config.hideNearForm}
                onChange={(e: Event) =>
                  updateConfig(
                    setConfig,
                    "hideNearForm",
                    (e.currentTarget as HTMLInputElement).checked,
                  )
                }
              />
              <s-grid gridTemplateColumns="1fr 1fr" gap="base">
                <s-number-field
                  label="Show after scroll — mobile (px)"
                  value={String(config.showAfterScroll)}
                  min={0}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "showAfterScroll",
                      Number((e.currentTarget as HTMLInputElement).value),
                    )
                  }
                />
                <s-number-field
                  label="Show after scroll — desktop (px)"
                  value={String(config.showAfterScrollDesktop)}
                  min={0}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "showAfterScrollDesktop",
                      Number((e.currentTarget as HTMLInputElement).value),
                    )
                  }
                />
                <s-number-field
                  label="Edge offset (px)"
                  value={String(config.desktopBottomOffset)}
                  min={0}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "desktopBottomOffset",
                      Number((e.currentTarget as HTMLInputElement).value),
                    )
                  }
                />
                <s-number-field
                  label="Desktop max width"
                  value={String(config.desktopMaxWidth)}
                  min={280}
                  onChange={(e: Event) =>
                    updateConfig(
                      setConfig,
                      "desktopMaxWidth",
                      Number((e.currentTarget as HTMLInputElement).value),
                    )
                  }
                />
              </s-grid>
            </s-stack>
          )}

          {nav === "plan" && (
            <s-stack gap="base">
              <div className={styles.planCard}>
                <s-stack direction="inline" gap="small-200">
                  <s-badge tone={isPro ? "success" : "info"}>
                    {isPro ? "Pro" : "Free"}
                  </s-badge>
                  <s-badge tone={hideBranding ? "success" : "caution"}>
                    {hideBranding ? "Branding hidden" : "Branding visible"}
                  </s-badge>
                </s-stack>
                <p className={styles.planPrice}>
                  {isPro ? "$6.99" : "$0"}
                  <span>/mo</span>
                </p>
                <p>
                  {isPro
                    ? "Pro removes the “Powered by Sticky ATC” label and keeps full style controls."
                    : "Free includes the sticky bar with a small branding label. Upgrade to remove branding."}
                </p>
              </div>
              {isPro ? (
                <Form method="post">
                  <input type="hidden" name="intent" value="downgrade" />
                  <s-button
                    type="submit"
                    variant="secondary"
                    {...(busy ? { loading: true } : {})}
                  >
                    Switch to Free
                  </s-button>
                </Form>
              ) : (
                <Form method="post">
                  <input type="hidden" name="intent" value="upgrade" />
                  <s-button type="submit" {...(busy ? { loading: true } : {})}>
                    Upgrade to Pro — $6.99/mo
                  </s-button>
                </Form>
              )}
            </s-stack>
          )}

          {nav === "setup" && (
            <s-stack gap="base">
              <s-paragraph>
                Store: <strong>{shop}</strong>
              </s-paragraph>
              <s-stack direction="inline" gap="base">
                <s-button
                  href={`https://${shop}/admin/themes/current/editor`}
                  target="_blank"
                  variant="secondary"
                >
                  Open Theme Editor
                </s-button>
                <Form method="post">
                  <input type="hidden" name="intent" value="sync" />
                  <s-button
                    type="submit"
                    variant="tertiary"
                    {...(busy ? { loading: true } : {})}
                  >
                    Sync storefront
                  </s-button>
                </Form>
                <s-button href="/app/additional" variant="tertiary">
                  Setup help
                </s-button>
              </s-stack>
              <s-unordered-list>
                <s-list-item>Enable the App embed once in Theme Editor</s-list-item>
                <s-list-item>Style here, then Save settings</s-list-item>
                <s-list-item>Test on a real product page after sync</s-list-item>
                <s-list-item>
                  To replace the theme cart drawer: set Display style → Cart
                  drawer, then in the theme set Cart type → Page. Full steps are
                  under Setup help.
                </s-list-item>
              </s-unordered-list>
            </s-stack>
          )}
        </section>

        <aside className={styles.studioPreview} aria-label="Live preview">
          <div className={styles.previewShell}>
            <div className={styles.previewChrome}>
              <span className={styles.previewDot} />
              <span className={styles.previewDot} />
              <span className={styles.previewDot} />
              <span className={styles.previewUrl}>{shop}/products/demo</span>
            </div>
            <div
              className={`${styles.previewStage} ${
                config.displayMode === "slider" ? styles.previewStageSlider : ""
              }`}
            >
              <div className={styles.previewProduct}>
                <div className={styles.previewThumb} />
                <div>
                  <p className={styles.previewTitle}>Classic Canvas Sneaker</p>
                  <p className={styles.previewSubtitle}>
                    {config.displayMode === "quickbuy"
                      ? "Quick Buy preview"
                      : config.displayMode === "slider"
                        ? "Bar + cart drawer preview"
                        : "Product page mock"}
                  </p>
                </div>
              </div>
              <button type="button" className={styles.previewNativeBtn}>
                Native Add to cart
              </button>

              {config.displayMode === "quickbuy" ? (
                <div
                  className={`${styles.previewQuick} ${
                    config.enabled ? "" : styles.previewBarDisabled
                  }`}
                  style={{
                    background: config.buttonBackground,
                    color: config.buttonTextColor,
                    borderRadius: `${Math.max(config.buttonRadius, 20)}px`,
                    fontSize: `${config.buttonFontSize}px`,
                    boxShadow: config.showShadow
                      ? "0 10px 28px rgba(0,0,0,0.18)"
                      : "none",
                  }}
                >
                  {config.buttonText}
                </div>
              ) : (
                <div
                  className={`${styles.previewBar} ${
                    config.enabled ? "" : styles.previewBarDisabled
                  } ${config.layout === "compact" ? styles.previewBarCompact : ""}`}
                  style={previewBarStyle}
                >
                  {!hideBranding && (
                    <span
                      className={styles.previewBrand}
                      style={{ color: config.textColor }}
                    >
                      Powered by Sticky ATC
                    </span>
                  )}
                  {config.showImage && (
                    <div
                      className={styles.previewMedia}
                      style={{
                        width: config.imageSize,
                        height: config.imageSize,
                        borderRadius: previewImageRadius,
                        background: "linear-gradient(135deg, #94a3b8, #64748b)",
                      }}
                    />
                  )}
                  <div className={styles.previewInfo}>
                    {config.showTitle && (
                      <p
                        className={styles.previewBarTitle}
                        style={{
                          fontSize: `${config.titleFontSize}px`,
                          color: config.textColor,
                        }}
                      >
                        Classic Canvas Sneaker
                      </p>
                    )}
                    {config.showPrice && (
                      <p
                        className={styles.previewBarPrice}
                        style={{
                          fontSize: `${config.priceFontSize}px`,
                          color: config.textColor,
                        }}
                      >
                        $68.00
                      </p>
                    )}
                  </div>
                  {config.showQuantity && (
                    <div
                      className={styles.previewQty}
                      style={{ color: config.textColor }}
                    >
                      <span>−</span>
                      <strong>1</strong>
                      <span>+</span>
                    </div>
                  )}
                  <button
                    type="button"
                    className={styles.previewBarButton}
                    style={{
                      background: config.buttonBackground,
                      color: config.buttonTextColor,
                      borderRadius: `${config.buttonRadius}px`,
                      fontSize: `${config.buttonFontSize}px`,
                      padding:
                        config.buttonSize === "large"
                          ? "14px 22px"
                          : "10px 16px",
                      width:
                        config.buttonSize === "full" ||
                        config.layout === "stacked"
                          ? "100%"
                          : undefined,
                    }}
                  >
                    {config.buttonText}
                  </button>
                </div>
              )}

              {config.displayMode === "slider" && config.enabled && (
                <div
                  className={styles.previewSlider}
                  style={{
                    background: config.backgroundColor,
                    color: config.textColor,
                    borderColor: config.borderColor,
                  }}
                >
                  <div
                    className={styles.previewSliderAccent}
                    style={{ background: config.accentColor }}
                  />
                  <div className={styles.previewSliderHeader}>
                    <strong style={{ color: config.textColor }}>
                      {config.drawerTitle || "Your cart"} (1)
                    </strong>
                    <span style={{ color: config.textColor }}>×</span>
                  </div>
                  <div className={styles.previewSliderItem}>
                    <div className={styles.previewSliderThumb} />
                    <div>
                      <p style={{ color: config.textColor }}>
                        Classic Canvas Sneaker
                      </p>
                      <span style={{ color: config.textColor }}>Qty 1</span>
                    </div>
                    <strong style={{ color: config.textColor }}>$68.00</strong>
                  </div>
                  <div className={styles.previewSliderFooter}>
                    <div style={{ color: config.textColor }}>
                      <span>Subtotal</span>
                      <strong>$68.00</strong>
                    </div>
                    <div
                      className={styles.previewSliderCheckout}
                      style={{
                        background: config.buttonBackground,
                        color: config.buttonTextColor,
                        borderRadius: `${config.buttonRadius}px`,
                      }}
                    >
                      {config.drawerCheckoutText || "Checkout"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
