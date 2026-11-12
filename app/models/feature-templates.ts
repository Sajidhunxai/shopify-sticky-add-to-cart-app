/** Per-feature HTML / CSS / template overrides for the cart drawer. */

export const FEATURE_TEMPLATE_KEYS = [
  "header",
  "announcement",
  "rewards",
  "rewardTier",
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
  /** When true, custom template/html/css/js for this feature are applied */
  enabled: boolean;
  /** If true and template is set, replace the built-in markup */
  replaceDefault: boolean;
  /** Extra HTML injected after the feature (or instead when replaceDefault) */
  html: string;
  /** CSS scoped under [data-satc-feature="key"] */
  css: string;
  /**
   * Mustache-style template. Placeholders: {{name}}, {{{html}}}.
   * Empty = keep built-in markup. Never pre-filled in admin.
   */
  template: string;
  /** Optional JS run after this feature renders (storefront). */
  js: string;
};

export type FeatureTemplates = Record<FeatureTemplateKey, FeatureTemplate>;

export const FEATURE_TEMPLATE_META: Record<
  FeatureTemplateKey,
  { label: string; placeholders: string; example: string }
> = {
  header: {
    label: "Header",
    placeholders: "{{title}}, {{cart_quantity}}",
    example: `<div class="satc-slider__header" style="display:flex;justify-content:space-between;align-items:center;width:100%;gap:12px">
  <h2 class="satc-slider__title" data-satc-drawer-title>{{title}}</h2>
  <button type="button" class="satc-slider__close" data-satc-slider-close aria-label="Close">×</button>
</div>`,
  },
  announcement: {
    label: "Announcement",
    placeholders: "{{text}}, {{timer}} — keep data-satc-announcement-label for countdown",
    example: `<span data-satc-announcement-label>{{text}}</span>`,
  },
  rewards: {
    label: "Rewards shell",
    placeholders:
      "{{message}}, {{progress_pct}}, {{#tiers}}…{{/tiers}} (or {{{tiers_html}}}) — edit milestone markup inside the loop",
    example: `<div class="satc-slider__rewards-rail">
  <div class="satc-slider__rewards-milestones" data-satc-reward-milestones>
{{#tiers}}
    <div class="satc-slider__reward-milestone{{reached_class}}{{current_class}}" data-reward-type="{{reward_type}}" data-reward-icon="{{icon}}" style="--satc-tier-i:{{index}}">
      <span class="satc-slider__reward-dot" aria-hidden="true">{{{icon_html}}}</span>
      <span class="satc-slider__reward-label">{{{label_html}}}</span>
      <span class="satc-slider__reward-goal">{{goal}}</span>
    </div>
{{/tiers}}
  </div>
  <div class="satc-slider__rewards-track">
    <span class="satc-slider__rewards-bar" data-satc-reward-bar style="width:{{progress_pct}}%"></span>
  </div>
</div>
<p class="satc-slider__rewards-text" data-satc-reward-text>{{message}}</p>`,
  },
  rewardTier: {
    label: "Reward tier (each milestone)",
    placeholders:
      "{{description}}, {{goal}}, {{index}}, {{icon}}, {{reward_type}}, {{{icon_html}}}, {{{label_html}}}, {{reached_class}}, {{current_class}} — used when shell still has {{{tiers_html}}}",
    example: `<div class="satc-slider__reward-milestone{{reached_class}}{{current_class}}" data-reward-type="{{reward_type}}" data-reward-icon="{{icon}}" style="--satc-tier-i:{{index}}">
  <span class="satc-slider__reward-dot" aria-hidden="true">{{{icon_html}}}</span>
  <span class="satc-slider__reward-label">{{{label_html}}}</span>
  <span class="satc-slider__reward-goal">{{goal}}</span>
</div>`,
  },
  cartItem: {
    label: "Cart line item",
    placeholders:
      "{{title}}, {{quantity}}, {{price}}, {{image}}, {{variant}}, {{line_key}}, {{{qty_controls}}}, {{{remove_button}}}",
    example: `<div class="satc-slider__item" data-satc-line data-line-key="{{line_key}}">
  <img class="satc-slider__item-image" src="{{image}}" alt="" loading="lazy">
  <div class="satc-slider__item-main">
    <p class="satc-slider__item-title">{{title}}</p>
    {{#variant}}<p class="satc-slider__item-meta">{{variant}}</p>{{/variant}}
    {{{qty_controls}}}
  </div>
  <div class="satc-slider__item-side">
    {{{remove_button}}}
    <div class="satc-slider__item-price">{{price}}</div>
  </div>
</div>`,
  },
  recommendations: {
    label: "Recommendations block",
    placeholders: "{{header}}, {{{cards_html}}}",
    example: `<div class="satc-slider__recs" data-satc-recs>
  <h3 class="satc-slider__recs-title">{{header}}</h3>
  <div class="satc-slider__recs-list">
    {{{cards_html}}}
  </div>
</div>`,
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
    example: `<div class="satc-slider__empty-state">
  <p class="satc-slider__empty">{{empty_title}}</p>
  <p class="satc-slider__empty-sub">{{empty_text}}</p>
  {{{shop_button}}}
</div>
{{{recs_html}}}`,
  },
  discount: {
    label: "Discount code",
    placeholders: "{{placeholder}}, {{button_text}}",
    example: `<form class="satc-slider__discount" data-satc-discount>
  <input class="satc-slider__discount-input" name="discount" placeholder="{{placeholder}}">
  <button type="submit" class="satc-slider__discount-btn">{{button_text}}</button>
</form>`,
  },
  trust: {
    label: "Trust badges",
    placeholders: "{{text}}",
    example: `<p class="satc-slider__trust">{{text}}</p>`,
  },
  footer: {
    label: "Footer / checkout",
    placeholders: "{{subtotal_label}}, {{subtotal}}, {{checkout_text}}, {{{discount_html}}}, {{{trust_html}}}",
    example: `<div class="satc-slider__footer">
  {{{discount_html}}}
  <div class="satc-slider__subtotal">
    <span>{{subtotal_label}}</span>
    <strong data-satc-slider-total>{{subtotal}}</strong>
  </div>
  <a class="satc-slider__checkout" href="/checkout" data-satc-slider-checkout>{{checkout_text}}</a>
  {{{trust_html}}}
</div>`,
  },
};

export function emptyFeatureTemplate(): FeatureTemplate {
  return {
    enabled: false,
    replaceDefault: false,
    html: "",
    css: "",
    template: "",
    js: "",
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
      js: clip(row.js),
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
