import { useAppBridge } from "@shopify/app-bridge-react";
import type {
  RecommendationProduct,
  RecsAnimation,
  RecommendationSource,
} from "../../../models/bar-config";
import { FeatureCustomTemplate } from "../FeatureCustomTemplate";
import type { PanelProps } from "../../types";

type PickedProduct = {
  id?: string;
  title?: string;
  handle?: string;
  images?: Array<{ originalSrc?: string; src?: string }>;
  variants?: Array<{ id?: string | number; available?: boolean }>;
};

export function RecommendationsPanel({ config, updateConfig, t }: PanelProps) {
  const shopify = useAppBridge();

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
          {config.recommendationsEnabled ? t("common.active") : t("common.disabled")}
        </s-badge>
        <s-switch
          label={
            config.recommendationsEnabled
              ? t("recommendations.disable")
              : t("recommendations.enable")
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

      <s-paragraph>{t("recommendations.help")}</s-paragraph>

      <s-switch
        label={t("recommendations.withItems")}
        checked={config.recommendationsShowWithItems}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsShowWithItems",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />
      <s-switch
        label={t("recommendations.hideInCart")}
        checked={config.recommendationsHideInCart}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsHideInCart",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />

      <s-select
        label={t("recommendations.source")}
        value={config.recommendationsSource}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsSource",
            (e.currentTarget as HTMLSelectElement)
              .value as RecommendationSource,
          )
        }
      >
        <s-option value="collection">{t("recommendations.collection")}</s-option>
        <s-option value="products">{t("recommendations.sourceProducts")}</s-option>
      </s-select>

      {config.recommendationsSource === "collection" ? (
        <s-stack gap="small-200">
          <s-text-field
            label={t("recommendations.collectionHandle")}
            value={config.recommendationsCollection}
            details={t("recommendations.collectionHandleHelp")}
            onChange={(e: Event) =>
              updateConfig(
                "recommendationsCollection",
                (e.currentTarget as HTMLInputElement).value,
              )
            }
          />
          <s-button onClick={pickCollection}>{t("recommendations.pickCollection")}</s-button>
        </s-stack>
      ) : (
        <s-stack gap="small-200">
          <s-paragraph>
            {config.recommendationsProducts.length
              ? t("recommendations.productsSelected", {
                  count: config.recommendationsProducts.length,
                })
              : t("recommendations.noneSelected")}
          </s-paragraph>
          {config.recommendationsProducts.map((p) => (
            <s-stack key={p.handle} direction="inline" gap="base">
              <s-paragraph>
                <strong>{p.title}</strong> · {p.handle}
              </s-paragraph>
              <s-button variant="tertiary" onClick={() => removeProduct(p.handle)}>
                {t("common.remove")}
              </s-button>
            </s-stack>
          ))}
          <s-button onClick={pickProducts}>
            {config.recommendationsProducts.length
              ? t("recommendations.editProducts")
              : t("recommendations.pickProducts")}
          </s-button>
        </s-stack>
      )}

      <s-text-field
        label={t("recommendations.emptyText")}
        value={config.recommendationsEmptyText}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsEmptyText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-text-field
        label={t("recommendations.header")}
        value={config.recommendationsHeader}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsHeader",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-number-field
        label={t("recommendations.max")}
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
        label={t("recommendations.addText")}
        value={config.recommendationsAddText}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsAddText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />

      <s-select
        label={t("recommendations.animation")}
        value={config.recommendationsAnimation}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsAnimation",
            (e.currentTarget as HTMLSelectElement).value as RecsAnimation,
          )
        }
      >
        <s-option value="stagger">{t("recommendations.animStagger")}</s-option>
        <s-option value="fade">{t("recommendations.animFade")}</s-option>
        <s-option value="slide">{t("recommendations.animSlide")}</s-option>
        <s-option value="none">{t("common.none")}</s-option>
      </s-select>

      <s-heading>{t("recommendations.shopNowHeading")}</s-heading>
      <s-switch
        label={t("recommendations.shopNow")}
        checked={config.recommendationsShopNowEnabled}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsShopNowEnabled",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />
      <s-text-field
        label={t("recommendations.shopText")}
        value={config.recommendationsShopNowText}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsShopNowText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />
      <s-text-field
        label={t("recommendations.shopUrl")}
        value={config.recommendationsShopNowUrl}
        onChange={(e: Event) =>
          updateConfig(
            "recommendationsShopNowUrl",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />

      <FeatureCustomTemplate
        featureKey="recommendationCard"
        extraKeys={["recommendationSkeleton", "recommendations", "emptyCart"]}
        config={config}
        updateConfig={updateConfig}
      />
    </s-stack>
  );
}
