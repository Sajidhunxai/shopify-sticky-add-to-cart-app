/** Per-feature HTML / CSS / template overrides for the cart drawer. */

export const FEATURE_TEMPLATE_KEYS = [
  "header",
  "announcement",
  "rewards",
  "cartItem",
  "recommendations",
  "recommendationCard",
  "recommendationSkeleton",
  "emptyCart",
  "discount",
  "trust",
  "footer",
] as const;

export type FeatureTemplateKey = (typeof FEATURE_TEMPLATE_KEYS)[number];

export type FeatureTemplate = {
  /** When true, custom template/html/css for this feature are applied */
  enabled: boolean;
  /** If true and template is set, replace the built-in markup */
  replaceDefault: boolean;
  /** Extra HTML injected after the feature (or instead when replaceDefault) */
  html: string;
  /** CSS scoped under [data-satc-feature="key"] */
  css: string;
  /**
   * Mustache-style template. Placeholders: {{name}}, {{{html}}}.
   * Empty = keep built-in markup.
   */
  template: string;
};

export type FeatureTemplates = Record<FeatureTemplateKey, FeatureTemplate>;

export const FEATURE_TEMPLATE_META: Record<
  FeatureTemplateKey,
  { label: string; placeholders: string; example: string }
> = {
  header: {
    label: "Header",
    placeholders: "{{title}}, {{cart_quantity}}",
    example: `<div class="my-header" style="display:flex;justify-content:space-between;align-items:center;width:100%">
  <h2 data-satc-drawer-title>{{title}}</h2>
  <button type="button" data-satc-slider-close aria-label="Close">×</button>
</div>`,
  },
  announcement: {
    label: "Announcement",
    placeholders: "{{text}}, {{timer}}",
    example: `<div class="my-announcement">{{text}}</div>`,
  },
  rewards: {
    label: "Tiered rewards",
    placeholders:
      "{{message}}, {{progress_pct}}, {{tiers_html}}, {{{tiers_html}}}",
    example: `<div class="my-rewards">
  <div class="bar" style="width:{{progress_pct}}%"></div>
  <p>{{message}}</p>
  {{{tiers_html}}}
</div>`,
  },
  cartItem: {
    label: "Cart line item",
    placeholders:
      "{{title}}, {{quantity}}, {{price}}, {{image}}, {{line_key}}, {{{qty_controls}}}, {{{remove_button}}}",
    example: `<div class="my-line" data-line-key="{{line_key}}">
  <img src="{{image}}" alt="" width="56" height="56">
  <div>
    <p>{{title}}</p>
    {{{qty_controls}}}
  </div>
  <div>{{price}} {{{remove_button}}}</div>
</div>`,
  },
  recommendations: {
    label: "Recommendations block",
    placeholders: "{{header}}, {{{cards_html}}}",
    example: `<section class="my-recs">
  <h3>{{header}}</h3>
  {{{cards_html}}}
</section>`,
  },
  recommendationCard: {
    label: "Recommendation tile",
    placeholders:
      "{{title}}, {{price}}, {{url}}, {{image}}, {{variant_id}}, {{add_text}}, {{available}}",
    example: `<div class="satc-slider__rec" data-satc-rec>
  <a class="satc-slider__rec-media" href="{{url}}">
    <img src="{{image}}" alt="" width="72" height="72" loading="lazy">
  </a>
  <div class="satc-slider__rec-info">
    <a class="satc-slider__rec-name" href="{{url}}">{{title}}</a>
    <p class="satc-slider__rec-price">{{price}}</p>
  </div>
  <button
    type="button"
    class="satc-slider__rec-add"
    data-satc-rec-add
    data-variant-id="{{variant_id}}"
  >{{add_text}}</button>
</div>`,
  },
  recommendationSkeleton: {
    label: "Skeleton",
    placeholders: "{{index}} (optional)",
    example: `<div class="satc-slider__rec satc-slider__rec--skeleton" aria-hidden="true">
  <span class="satc-slider__rec-placeholder"></span>
  <div class="satc-slider__rec-info">
    <span class="satc-skel-line"></span>
    <span class="satc-skel-line satc-skel-line--sm"></span>
  </div>
  <span class="satc-skel-btn"></span>
</div>`,
  },
  emptyCart: {
    label: "Empty cart",
    placeholders: "{{empty_title}}, {{empty_text}}, {{{shop_button}}}, {{{recs_html}}}",
    example: `<div class="my-empty">
  <p>{{empty_title}}</p>
  <p>{{empty_text}}</p>
  {{{shop_button}}}
  {{{recs_html}}}
</div>`,
  },
  discount: {
    label: "Discount code",
    placeholders: "{{placeholder}}, {{button_text}}",
    example: `<form class="my-discount" data-satc-discount>
  <input name="discount" placeholder="{{placeholder}}">
  <button type="submit">{{button_text}}</button>
</form>`,
  },
  trust: {
    label: "Trust badges",
    placeholders: "{{text}}",
    example: `<p class="my-trust">{{text}}</p>`,
  },
  footer: {
    label: "Footer / checkout",
    placeholders: "{{subtotal_label}}, {{subtotal}}, {{checkout_text}}, {{{discount_html}}}, {{{trust_html}}}",
    example: `<footer class="my-footer">
  {{{discount_html}}}
  <div><span>{{subtotal_label}}</span><strong>{{subtotal}}</strong></div>
  <a href="/checkout" data-satc-slider-checkout>{{checkout_text}}</a>
  {{{trust_html}}}
</footer>`,
  },
};

export function emptyFeatureTemplate(): FeatureTemplate {
  return {
    enabled: false,
    replaceDefault: false,
    html: "",
    css: "",
    template: "",
  };
}

export function createDefaultFeatureTemplates(): FeatureTemplates {
  return FEATURE_TEMPLATE_KEYS.reduce((acc, key) => {
    acc[key] = emptyFeatureTemplate();
    return acc;
  }, {} as FeatureTemplates);
}

const MAX_FIELD = 12_000;

function clip(value: unknown, max = MAX_FIELD): string {
  return String(value ?? "").slice(0, max);
}

export function normalizeFeatureTemplates(input: unknown): FeatureTemplates {
  const base = createDefaultFeatureTemplates();
  if (!input || typeof input !== "object") return base;
  const raw = input as Partial<Record<FeatureTemplateKey, Partial<FeatureTemplate>>>;
  for (const key of FEATURE_TEMPLATE_KEYS) {
    const row = raw[key];
    if (!row || typeof row !== "object") continue;
    base[key] = {
      enabled: Boolean(row.enabled),
      replaceDefault: Boolean(row.replaceDefault),
      html: clip(row.html),
      css: clip(row.css),
      template: clip(row.template),
    };
  }
  return base;
}

/** Strip script tags and inline event handlers from merchant HTML. */
export function sanitizeFeatureHtml(html: string): string {
  return String(html || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript\s*:/gi, "");
}
