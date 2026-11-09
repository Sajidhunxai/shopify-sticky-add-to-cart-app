import { useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import styles from "../../../styles/dashboard.module.css";
import type {
  RecommendationProduct,
  RecsAnimation,
  RecommendationSource,
} from "../../../models/bar-config";
import {
  FEATURE_TEMPLATE_META,
  emptyFeatureTemplate,
  type FeatureTemplate,
} from "../../../models/feature-templates";
import type { PanelProps } from "../../types";

type RecTemplateTab = "recommendationCard" | "recommendationSkeleton";

type PickedProduct = {
  id?: string;
  title?: string;
  handle?: string;
  images?: Array<{ originalSrc?: string; src?: string }>;
  variants?: Array<{ id?: string | number; available?: boolean }>;
};

export function RecommendationsPanel({ config, updateConfig }: PanelProps) {
  const shopify = useAppBridge();
  const [tplTab, setTplTab] = useState<RecTemplateTab>("recommendationCard");
  const templates = config.featureTemplates;
  const currentTpl =
    templates[tplTab] || emptyFeatureTemplate();
  const tplMeta = FEATURE_TEMPLATE_META[tplTab];

  const patchTemplate = (patch: Partial<FeatureTemplate>) => {
    updateConfig("featureTemplates", {
      ...templates,
      [tplTab]: { ...(templates[tplTab] || emptyFeatureTemplate()), ...patch },
    });
  };

  const loadExampleTemplate = () => {
    patchTemplate({
      enabled: true,
      replaceDefault: true,
      template: tplMeta.example,
    });
  };

  const resetTemplate = () => {
    patchTemplate(emptyFeatureTemplate());
  };

  const pickCollection = async () => {
    try {
      const selected = await shopify.resourcePicker({
        type: "collection",
        multiple: false,
        action: "select",
      });
      if (!selected || !Array.isArray(selected) || !selected.length) return;
      const collection = selected[0] as { handle?: string; title?: string };
      const handle = String(collection.handle || "")
        .trim()
        .replace(/^\/+|\/+$/g, "")
        .replace(/^collections\//i, "");
      if (!handle) return;
      updateConfig("recommendationsCollection", handle);
      updateConfig("recommendationsSource", "collection");
    } catch {
      /* picker cancelled */
    }
  };

  const pickProducts = async () => {
    try {
      const selected = await shopify.resourcePicker({
        type: "product",
        multiple: true,
        action: "select",
      });
      if (!selected || !Array.isArray(selected)) return;
      const products: RecommendationProduct[] = (selected as PickedProduct[])
        .map((product) => {
          const handle = String(product.handle || "").trim();
          if (!handle) return null;
          const variant =
            (product.variants || []).find((v) => v.available !== false) ||
            product.variants?.[0];
          const variantId = String(variant?.id || "").replace(/\D/g, "");
          const image =
            product.images?.[0]?.originalSrc ||
            product.images?.[0]?.src ||
            "";
          return {
            handle,
            title: String(product.title || handle),
            url: `/products/${handle}`,
            image: String(image || ""),
            variantId,
          };
        })
        .filter((p): p is RecommendationProduct => Boolean(p))
        .slice(0, 12);
      updateConfig("recommendationsProducts", products);
      updateConfig("recommendationsSource", "products");
    } catch {
      /* picker cancelled */
    }
  };

  const removeProduct = (handle: string) => {
    updateConfig(
      "recommendationsProducts",
      config.recommendationsProducts.filter((p) => p.handle !== handle),
    );
  };

  return (
    <s-stack gap="base">
      <s-stack direction="inline" gap="base">
        <s-badge tone={config.recommendationsEnabled ? "success" : "neutral"}>
          {config.recommendationsEnabled ? "Active" : "Disabled"}
        </s-badge>
        <s-switch
          label={
            config.recommendationsEnabled
              ? "Disable recommendations"
              : "Enable recommendations"
          }
          checked={config.recommendationsEnabled}
          onChange={(e: Event) =>
            updateConfig(
              "recommendationsEnabled",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
      </s-stack>

      <s-paragraph>
        Show product recommendations customers can add in one click — on empty
        carts and optionally when items are already in the cart.
      </s-paragraph>

      <s-switch
        label="Show recommendations when cart has items"
        checked={config.recommendationsShowWithItems}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsShowWithItems",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />
      <s-switch
        label="Hide products already in the cart"
        checked={config.recommendationsHideInCart}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsHideInCart",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />

      <s-select
        label="Product source"
        value={config.recommendationsSource}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsSource",
            (e.currentTarget as HTMLSelectElement)
              .value as RecommendationSource,
          )
        }
      >
        <s-option value="collection">Collection</s-option>
        <s-option value="products">Specific products</s-option>
      </s-select>

      {config.recommendationsSource === "collection" ? (
        <s-stack gap="small-200">
          <s-text-field
            label="Collection handle"
            value={config.recommendationsCollection}
            details="e.g. all, bestsellers — or pick a collection below"
            onChange={(e: Event) =>
              updateConfig(
                "recommendationsCollection",
                (e.currentTarget as HTMLInputElement).value,
              )
            }
          />
          <s-button onClick={pickCollection}>Pick collection</s-button>
        </s-stack>
      ) : (
        <s-stack gap="small-200">
          <s-paragraph>
            {config.recommendationsProducts.length
              ? `${config.recommendationsProducts.length} product(s) selected`
              : "No products selected yet."}
          </s-paragraph>
          {config.recommendationsProducts.map((p) => (
            <s-stack key={p.handle} direction="inline" gap="base">
              <s-paragraph>
                <strong>{p.title}</strong> · {p.handle}
              </s-paragraph>
              <s-button variant="tertiary" onClick={() => removeProduct(p.handle)}>
                Remove
              </s-button>
            </s-stack>
          ))}
          <s-button onClick={pickProducts}>
            {config.recommendationsProducts.length
              ? "Edit products"
              : "Pick products"}
          </s-button>
        </s-stack>
      )}

      <s-text-field
        label="Empty cart helper text"
        value={config.recommendationsEmptyText}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsEmptyText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-text-field
        label="Recommendations header"
        value={config.recommendationsHeader}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsHeader",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-number-field
        label="Maximum recommendations"
        value={String(config.recommendationsMax)}
        min={1}
        max={8}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsMax",
            Number((e.currentTarget as HTMLInputElement).value),
          )
        }
      />
      <s-text-field
        label="Add button text"
        value={config.recommendationsAddText}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsAddText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />

      <s-select
        label="Recommendation animation"
        value={config.recommendationsAnimation}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsAnimation",
            (e.currentTarget as HTMLSelectElement).value as RecsAnimation,
          )
        }
      >
        <s-option value="stagger">Stagger fade-up</s-option>
        <s-option value="fade">Fade in</s-option>
        <s-option value="slide">Slide in</s-option>
        <s-option value="none">None</s-option>
      </s-select>

      <s-heading>Shop now button</s-heading>
      <s-switch
        label="Show Shop now button on empty cart"
        checked={config.recommendationsShopNowEnabled}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsShopNowEnabled",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />
      <s-text-field
        label="Button text"
        value={config.recommendationsShopNowText}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsShopNowText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-text-field
        label="Button URL"
        value={config.recommendationsShopNowUrl}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsShopNowUrl",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />

      <s-heading>Custom template</s-heading>
      <s-stack direction="inline" gap="base">
        <s-badge tone="caution">Technical skills required</s-badge>
      </s-stack>
      <s-paragraph>
        Override the recommendation tile HTML (and loading skeleton) with your
        own markup. Use Mustache placeholders like{" "}
        <code>{"{{title}}"}</code> and <code>{"{{price}}"}</code>. Keep{" "}
        <code>data-satc-rec-add</code> + <code>data-variant-id</code> on the Add
        button so one-click add still works.
      </s-paragraph>

      <div
        className={styles.tierTabs}
        role="tablist"
        aria-label="Recommendation templates"
      >
        {(
          [
            ["recommendationCard", "Recommendation tile"],
            ["recommendationSkeleton", "Skeleton"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tplTab === key}
            className={`${styles.tierTab} ${
              tplTab === key ? styles.tierTabActive : ""
            }`}
            onClick={() => setTplTab(key)}
          >
            {label}
            {templates[key]?.enabled ? " · on" : ""}
          </button>
        ))}
      </div>

      <s-stack direction="inline" gap="base">
        <s-badge tone={currentTpl.enabled ? "success" : "neutral"}>
          {currentTpl.enabled ? "Active" : "Inactive"}
        </s-badge>
        <s-switch
          label={
            currentTpl.enabled
              ? "Disable custom template"
              : "Enable custom template"
          }
          checked={currentTpl.enabled}
          onChange={(e: Event) =>
            patchTemplate({
              enabled: (e.currentTarget as HTMLInputElement).checked,
            })
          }
        />
        <s-switch
          label="Replace built-in markup"
          checked={currentTpl.replaceDefault}
          onChange={(e: Event) =>
            patchTemplate({
              replaceDefault: (e.currentTarget as HTMLInputElement).checked,
            })
          }
        />
      </s-stack>

      <s-paragraph>
        Placeholders: {tplMeta.placeholders}
      </s-paragraph>

      <label className={styles.codeFieldLabel} htmlFor={`rec-tpl-${tplTab}`}>
        HTML template
      </label>
      <textarea
        id={`rec-tpl-${tplTab}`}
        className={styles.codeField}
        rows={14}
        spellCheck={false}
        placeholder={tplMeta.example}
        value={currentTpl.template}
        onChange={(e) => patchTemplate({ template: e.target.value })}
      />

      <label className={styles.codeFieldLabel} htmlFor={`rec-css-${tplTab}`}>
        Feature CSS (optional)
      </label>
      <textarea
        id={`rec-css-${tplTab}`}
        className={styles.codeField}
        rows={5}
        spellCheck={false}
        placeholder={`[data-satc-feature="${tplTab}"] .my-class { }`}
        value={currentTpl.css}
        onChange={(e) => patchTemplate({ css: e.target.value })}
      />

      <s-stack direction="inline" gap="base">
        <s-button onClick={loadExampleTemplate}>Load example</s-button>
        <s-button variant="tertiary" onClick={resetTemplate}>
          Reset
        </s-button>
      </s-stack>
      <s-paragraph>
        More features (header, rewards, cart lines, etc.) are under{" "}
        <strong>Settings → HTML / CSS / templates</strong>.
      </s-paragraph>
    </s-stack>
  );
}
