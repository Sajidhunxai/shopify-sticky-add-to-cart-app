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

export default function Index() {
  const { shop, plan, hideBranding, config: initialConfig } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const shopify = useAppBridge();
  const busy = navigation.state !== "idle";
  const [config, setConfig] = useState<BarConfig>(initialConfig);
  const isPro = plan === "pro";

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
    ...(config.barPosition === "top"
      ? { top: 12, bottom: "auto" }
      : { bottom: 12, top: "auto" }),
  };

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
          ? "Keep the App embed enabled in the Theme Editor. Content and style below sync to the storefront when you save."
          : "Enable the sticky bar in Content settings, then save to publish changes."}
      </s-banner>

      <s-section heading="Live preview">
        <s-paragraph>
          Changes update instantly here. Click <strong>Save settings</strong> to
          push them to your storefront.
        </s-paragraph>

        <div className={styles.modeGrid} role="radiogroup" aria-label="Display style">
          {(
            [
              {
                id: "bar" as const,
                title: "Sticky Add to Cart Bar",
                blurb: "Classic sticky bar with image, price, and CTA",
              },
              {
                id: "slider" as const,
                title: "Sticky Cart + Slider",
                blurb: "Sticky bar opens a cart drawer after add",
              },
              {
                id: "quickbuy" as const,
                title: "Quick Buy Cart",
                blurb: "Floating quick-buy button that expands",
              },
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={`${styles.modeCard} ${
                config.displayMode === mode.id ? styles.modeCardActive : ""
              }`}
              onClick={() => updateConfig(setConfig, "displayMode", mode.id)}
              aria-pressed={config.displayMode === mode.id}
            >
              <strong>{mode.title}</strong>
              <span>{mode.blurb}</span>
            </button>
          ))}
        </div>

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
                      ? "Bar + cart slider preview"
                      : "Product page mock · scroll preview"}
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
                      style={{ fontSize: `${config.titleFontSize}px` }}
                    >
                      Classic Canvas Sneaker
                    </p>
                  )}
                  {config.showPrice && (
                    <p
                      className={styles.previewBarPrice}
                      style={{ fontSize: `${config.priceFontSize}px` }}
                    >
                      $68.00
                    </p>
                  )}
                </div>
                {config.showQuantity && (
                  <div className={styles.previewQty}>
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
                      config.buttonSize === "full" || config.layout === "stacked"
                        ? "100%"
                        : undefined,
                  }}
                >
                  {config.buttonText}
                </button>
              </div>
            )}

            {config.displayMode === "slider" && config.enabled && (
              <div className={styles.previewSlider}>
                <div className={styles.previewSliderHeader}>
                  <strong>Your cart</strong>
                  <span>×</span>
                </div>
                <div className={styles.previewSliderItem}>
                  <div className={styles.previewSliderThumb} />
                  <div>
                    <p>Classic Canvas Sneaker</p>
                    <span>Qty 1</span>
                  </div>
                  <strong>$68.00</strong>
                </div>
                <div className={styles.previewSliderFooter}>
                  <div>
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
                    Checkout
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </s-section>

      <s-section heading="Enable on storefront">
        <s-paragraph>
          Store: <strong>{shop}</strong>. Keep the App embed ON in Theme Editor,
          then control content and style here.
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
        </s-stack>
      </s-section>

      <s-section heading="Content">
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
        </div>

        <s-stack gap="base" paddingBlockStart="base">
          <s-heading>Show on pages</s-heading>
          <s-paragraph>
            Choose which storefront templates can display the sticky bar. The
            bar needs a product on the page, so product pages work best.
          </s-paragraph>
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
              label="Other pages (cart, blog, pages…)"
              checked={config.showOnOther}
              onChange={(e: Event) =>
                updateConfig(
                  setConfig,
                  "showOnOther",
                  (e.currentTarget as HTMLInputElement).checked,
                )
              }
            />
          </div>
        </s-stack>

        <s-stack gap="base" paddingBlockStart="base">
          <s-grid gridTemplateColumns="1fr 1fr" gap="base">
            <s-text-field
              label="Button text"
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
          </s-grid>
          <s-select
            label="After adding to cart"
            value={config.afterAdd}
            onChange={(e: Event) =>
              updateConfig(
                setConfig,
                "afterAdd",
                (e.currentTarget as HTMLSelectElement).value as BarConfig["afterAdd"],
              )
            }
          >
            <s-option value="stay">Stay on page</s-option>
            <s-option value="cart">Go to cart</s-option>
            <s-option value="drawer">Open cart drawer (if supported)</s-option>
          </s-select>
        </s-stack>
      </s-section>

      <s-section heading="Style & layout">
        <s-stack gap="base">
          <s-grid gridTemplateColumns="1fr 1fr" gap="base">
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
              <s-option value="row">Row (image · title · button)</s-option>
              <s-option value="compact">Compact (hide title, same bar size)</s-option>
              <s-option value="stacked">Stacked (button full width)</s-option>
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
              <s-option value="bottom">Bottom</s-option>
              <s-option value="top">Top</s-option>
            </s-select>
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

        <s-stack gap="base" paddingBlockStart="base">
          <s-grid
            gridTemplateColumns="repeat(auto-fit, minmax(140px, 1fr))"
            gap="base"
          >
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
            <s-number-field
              label="Border width (px)"
              value={String(config.borderWidth)}
              min={0}
              onChange={(e: Event) =>
                updateConfig(
                  setConfig,
                  "borderWidth",
                  Number((e.currentTarget as HTMLInputElement).value),
                )
              }
            />
            <s-number-field
              label="Bar corner radius"
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
            <s-number-field
              label="Image corner radius"
              value={String(config.imageRadius)}
              min={0}
              onChange={(e: Event) =>
                updateConfig(
                  setConfig,
                  "imageRadius",
                  Number((e.currentTarget as HTMLInputElement).value),
                )
              }
            />
            <s-number-field
              label="Padding Y"
              value={String(config.paddingY)}
              min={0}
              onChange={(e: Event) =>
                updateConfig(
                  setConfig,
                  "paddingY",
                  Number((e.currentTarget as HTMLInputElement).value),
                )
              }
            />
            <s-number-field
              label="Padding X"
              value={String(config.paddingX)}
              min={0}
              onChange={(e: Event) =>
                updateConfig(
                  setConfig,
                  "paddingX",
                  Number((e.currentTarget as HTMLInputElement).value),
                )
              }
            />
            <s-number-field
              label="Product image size"
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
              label="Title font size"
              value={String(config.titleFontSize)}
              min={10}
              onChange={(e: Event) =>
                updateConfig(
                  setConfig,
                  "titleFontSize",
                  Number((e.currentTarget as HTMLInputElement).value),
                )
              }
            />
            <s-number-field
              label="Price font size"
              value={String(config.priceFontSize)}
              min={10}
              onChange={(e: Event) =>
                updateConfig(
                  setConfig,
                  "priceFontSize",
                  Number((e.currentTarget as HTMLInputElement).value),
                )
              }
            />
            <s-number-field
              label="Button font size"
              value={String(config.buttonFontSize)}
              min={10}
              onChange={(e: Event) =>
                updateConfig(
                  setConfig,
                  "buttonFontSize",
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
            <s-number-field
              label="Desktop edge offset"
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
          </s-grid>

          <s-grid gridTemplateColumns="1fr 1fr" gap="base">
            <s-color-field
              label="Bar background"
              value={config.backgroundColor}
              onChange={(e: Event) =>
                updateConfig(
                  setConfig,
                  "backgroundColor",
                  (e.currentTarget as HTMLInputElement).value,
                )
              }
            />
            <s-color-field
              label="Border color"
              value={config.borderColor}
              onChange={(e: Event) =>
                updateConfig(
                  setConfig,
                  "borderColor",
                  (e.currentTarget as HTMLInputElement).value,
                )
              }
            />
            <s-color-field
              label="Text color"
              value={config.textColor}
              onChange={(e: Event) =>
                updateConfig(
                  setConfig,
                  "textColor",
                  (e.currentTarget as HTMLInputElement).value,
                )
              }
            />
            <s-color-field
              label="Button background"
              value={config.buttonBackground}
              onChange={(e: Event) =>
                updateConfig(
                  setConfig,
                  "buttonBackground",
                  (e.currentTarget as HTMLInputElement).value,
                )
              }
            />
            <s-color-field
              label="Button text color"
              value={config.buttonTextColor}
              onChange={(e: Event) =>
                updateConfig(
                  setConfig,
                  "buttonTextColor",
                  (e.currentTarget as HTMLInputElement).value,
                )
              }
            />
          </s-grid>
        </s-stack>
      </s-section>

      <s-section heading="Plan & billing">
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
        <s-stack direction="inline" gap="base" paddingBlockStart="base">
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
        <s-paragraph>
          Demo billing for now. Connect the Shopify Billing API before App Store
          launch. If Dev Dashboard shows a public distribution error, set the app
          to custom distribution while testing.
        </s-paragraph>
      </s-section>

      <s-section slot="aside" heading="Quick tips">
        <s-unordered-list>
          <s-list-item>Enable the App embed once, then style here</s-list-item>
          <s-list-item>Use the live preview before saving</s-list-item>
          <s-list-item>Test on a real product page after sync</s-list-item>
          <s-list-item>Pro hides branding on the storefront bar</s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section slot="aside" heading="Need help?">
        <s-paragraph>
          Bar not showing? Check the Setup help page for the most common fixes.
        </s-paragraph>
        <s-button href="/app/additional" variant="secondary">
          Open setup help
        </s-button>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
