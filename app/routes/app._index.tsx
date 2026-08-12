import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
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
        <div className={styles.previewShell}>
          <div className={styles.previewChrome}>
            <span className={styles.previewDot} />
            <span className={styles.previewDot} />
            <span className={styles.previewDot} />
            <span className={styles.previewUrl}>{shop}/products/demo</span>
          </div>
          <div className={styles.previewStage}>
            <div className={styles.previewProduct}>
              <div className={styles.previewThumb} />
              <div>
                <p className={styles.previewTitle}>Classic Canvas Sneaker</p>
                <p className={styles.previewSubtitle}>Product page mock · scroll preview</p>
              </div>
            </div>
            <button type="button" className={styles.previewNativeBtn}>
              Native Add to cart
            </button>

            <div
              className={`${styles.previewBar} ${config.enabled ? "" : styles.previewBarDisabled}`}
              style={{
                background: config.backgroundColor,
                color: config.textColor,
                borderRadius: `${config.barRadius}px`,
                padding: `${config.paddingY}px ${config.paddingX}px`,
                border: `${config.borderWidth}px solid rgba(0,0,0,0.08)`,
                boxShadow: config.showShadow
                  ? "0 -8px 28px rgba(0,0,0,0.14)"
                  : "none",
              }}
            >
              {!hideBranding && (
                <span className={styles.previewBrand} style={{ color: config.textColor }}>
                  Powered by Sticky ATC
                </span>
              )}
              {config.showImage && (
                <div
                  className={styles.previewMedia}
                  style={{
                    width: config.imageSize,
                    height: config.imageSize,
                    background:
                      "linear-gradient(135deg, #94a3b8, #64748b)",
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
              <button
                type="button"
                className={styles.previewBarButton}
                style={{
                  background: config.buttonBackground,
                  color: config.buttonTextColor,
                  borderRadius: `${config.buttonRadius}px`,
                  fontSize: `${config.buttonFontSize}px`,
                  padding: "10px 16px",
                }}
              >
                {config.buttonText}
              </button>
            </div>
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

        <s-stack gap="base" paddingBlockStart="base">
          <s-grid
            gridTemplateColumns="repeat(auto-fit, minmax(140px, 1fr))"
            gap="base"
          >
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
              label="Image size"
              value={String(config.imageSize)}
              min={24}
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
              label="Desktop bottom offset"
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
              label="Show after scroll (px)"
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
