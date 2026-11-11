/** Documentation content for Sticky Add to Cart (admin + public). */

export type DocSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: string[];
  note?: string;
  links?: { label: string; href: string }[];
};

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  group: string;
  /** Studio left-nav id when applicable */
  studioNav?: string;
  sections: DocSection[];
  related?: { slug: string; label: string }[];
};

export const DOC_GROUPS: { title: string; slugs: string[] }[] = [
  {
    title: "Start here",
    slugs: ["overview", "getting-started"],
  },
  {
    title: "General",
    slugs: ["design", "header", "display"],
  },
  {
    title: "Drawer body",
    slugs: [
      "cart-items",
      "announcements",
      "rewards",
      "recommendations",
      "discounts",
    ],
  },
  {
    title: "Footer",
    slugs: ["cart-summary", "trust"],
  },
  {
    title: "Settings",
    slugs: ["templates", "pages-devices", "behavior", "plan"],
  },
  {
    title: "Help",
    slugs: ["troubleshooting"],
  },
];

export const DOC_PAGES: DocPage[] = [
  {
    slug: "overview",
    title: "Overview",
    description:
      "Sticky Add to Cart keeps Add to cart visible and can open a full cart drawer with rewards, recommendations, and more.",
    group: "Start here",
    sections: [
      {
        id: "what-it-is",
        title: "What the app does",
        paragraphs: [
          "Sticky Add to Cart (Sticky ATC) adds a sticky bar on product pages so shoppers can add items without scrolling back to the buy button. In Cart drawer mode it also replaces the default cart experience with a customizable slide-out drawer.",
        ],
        bullets: [
          "Sticky Add to Cart bar on product (and optional other) pages",
          "Optional cart drawer with announcements, tiered rewards, recommendations, discounts, and trust badges",
          "Live preview in the admin studio — save to sync settings to the storefront",
          "Optional custom HTML / CSS / JS templates per drawer feature",
        ],
      },
      {
        id: "how-settings-work",
        title: "How settings work",
        paragraphs: [
          "Open the app Dashboard to use the studio: left menu for sections, center for settings, right for live preview. Click Save settings to write config to your shop metafield so the theme extension can read it.",
        ],
        steps: [
          "Enable the App embed in Online Store → Themes → Customize → App embeds",
          "Save the theme",
          "Configure the studio and click Save settings",
          "Hard-refresh a product page to verify",
        ],
        links: [
          { label: "Getting started", href: "/app/docs/getting-started" },
          { label: "Troubleshooting", href: "/app/docs/troubleshooting" },
        ],
      },
      {
        id: "display-modes",
        title: "Display modes",
        bullets: [
          "Sticky Add to Cart Bar — classic sticky bar only",
          "Sticky Cart + Drawer — bar plus slide-out cart drawer (recommended for rewards & recs)",
          "Quick Buy Cart — compact floating quick-buy style",
        ],
        links: [{ label: "Display style guide", href: "/app/docs/display" }],
      },
    ],
    related: [
      { slug: "getting-started", label: "Getting started" },
      { slug: "display", label: "Display style" },
      { slug: "rewards", label: "Tiered rewards" },
    ],
  },
  {
    slug: "getting-started",
    title: "Getting started",
    description: "Install, enable the embed, and publish your first sticky bar or cart drawer.",
    group: "Start here",
    studioNav: "setup",
    sections: [
      {
        id: "install",
        title: "1. Install & open the app",
        steps: [
          "Install Sticky Add to Cart from the Shopify App Store (or your install link)",
          "Open the app from Apps → Sticky Add to Cart",
          "You land on the Dashboard studio",
        ],
      },
      {
        id: "embed",
        title: "2. Enable the App embed",
        steps: [
          "Online Store → Themes → Customize",
          "Open App embeds (left sidebar / theme settings)",
          "Enable Sticky ATC (or similarly named embed)",
          "Save the theme",
        ],
        note: "The bar and drawer only render after the embed is on and the theme is saved.",
      },
      {
        id: "first-config",
        title: "3. Configure & save",
        steps: [
          "Choose Display mode (Bar or Cart drawer) at the top of the left menu",
          "Adjust Design colors/fonts, then open Drawer sections as needed",
          "Use the right-hand preview to check changes",
          "Click Save settings",
          "Hard-refresh a product page on your storefront",
        ],
        links: [
          { label: "Design", href: "/app/docs/design" },
          { label: "Pages & devices", href: "/app/docs/pages-devices" },
        ],
      },
      {
        id: "drawer-vs-theme",
        title: "4. Use Sticky ATC drawer (not the theme drawer)",
        paragraphs: [
          "If you use Cart drawer mode, set your theme cart type to Page so the theme drawer does not compete with Sticky ATC.",
        ],
        links: [
          { label: "Full drawer setup steps", href: "/app/docs/troubleshooting#sticky-drawer" },
          { label: "Setup help (short)", href: "/app/additional" },
        ],
      },
    ],
    related: [
      { slug: "troubleshooting", label: "Troubleshooting" },
      { slug: "display", label: "Display style" },
      { slug: "pages-devices", label: "Pages & devices" },
    ],
  },
  {
    slug: "design",
    title: "Design",
    description:
      "Colors, fonts, bar background, buttons, images, and visual style for the sticky bar.",
    group: "General",
    studioNav: "design",
    sections: [
      {
        id: "overview",
        title: "Where to find it",
        paragraphs: [
          "Dashboard → left menu → Design. Changes appear in the preview immediately; Save settings to publish.",
        ],
      },
      {
        id: "colors-fonts",
        title: "Colors & fonts",
        bullets: [
          "Background, text, button, and accent colors for the sticky bar",
          "Optional inherit theme font / theme text color so the bar matches Dawn (or your theme)",
          "Border, radius, padding, and shadow options",
        ],
      },
      {
        id: "layout",
        title: "Bar layout & media",
        bullets: [
          "Show or hide product image, title, price, and quantity",
          "Image size and shape",
          "Button size, radius, and label / sold-out text",
          "Background style: solid, glass blur, or gradient",
        ],
        links: [{ label: "Behavior (scroll & visibility)", href: "/app/docs/behavior" }],
      },
      {
        id: "tips",
        title: "Tips",
        bullets: [
          "Keep contrast high for accessibility (dark text on light bars, or the reverse)",
          "After changing Design, always Save settings and hard-refresh the product page",
        ],
      },
    ],
    related: [
      { slug: "header", label: "Header (drawer)" },
      { slug: "display", label: "Display style" },
      { slug: "behavior", label: "Behavior" },
    ],
  },
  {
    slug: "header",
    title: "Header",
    description: "Cart drawer header title, close button, backdrop blur, and header chrome.",
    group: "General",
    studioNav: "header",
    sections: [
      {
        id: "overview",
        title: "Where to find it",
        paragraphs: [
          "Dashboard → Header. These settings apply when Display mode is Sticky Cart + Drawer.",
        ],
        links: [{ label: "Display style", href: "/app/docs/display" }],
      },
      {
        id: "title",
        title: "Title & close control",
        bullets: [
          "Drawer title (supports {{cart_quantity}})",
          "Title size, weight, and alignment",
          "Close button side, size, colors, and border",
        ],
      },
      {
        id: "backdrop",
        title: "Drawer backdrop",
        bullets: [
          "Backdrop blur on/off — blurs the storefront behind the drawer",
          "Backdrop darkness (0–100)",
        ],
        note: "If blur does not appear, hard-refresh after saving. Theme CSS rarely blocks it after the drawer is attached to the page body.",
      },
    ],
    related: [
      { slug: "display", label: "Display style" },
      { slug: "cart-summary", label: "Cart summary" },
      { slug: "announcements", label: "Announcements" },
    ],
  },
  {
    slug: "display",
    title: "Display style",
    description: "Choose sticky bar, cart drawer, or quick buy — and how the cart opens.",
    group: "General",
    studioNav: "display",
    sections: [
      {
        id: "modes",
        title: "Modes",
        bullets: [
          "Sticky Add to Cart Bar — product sticky bar only",
          "Sticky Cart + Drawer — sticky bar + slide-out cart (rewards, recs, etc.)",
          "Quick Buy Cart — compact floating control",
        ],
      },
      {
        id: "drawer",
        title: "When to use Cart drawer",
        paragraphs: [
          "Use Cart drawer if you want tiered free-shipping rewards, recommendations, discount codes, announcements, or trust badges in the cart experience.",
        ],
        links: [
          { label: "Tiered rewards", href: "/app/docs/rewards" },
          { label: "Recommendations", href: "/app/docs/recommendations" },
          { label: "Getting started → drawer setup", href: "/app/docs/getting-started#drawer-vs-theme" },
        ],
      },
    ],
    related: [
      { slug: "rewards", label: "Tiered rewards" },
      { slug: "pages-devices", label: "Pages & devices" },
      { slug: "troubleshooting", label: "Troubleshooting" },
    ],
  },
  {
    slug: "cart-items",
    title: "Cart items",
    description: "Line item quantity steppers, remove buttons, and cart line presentation.",
    group: "Drawer body",
    studioNav: "cart-items",
    sections: [
      {
        id: "controls",
        title: "Line controls",
        bullets: [
          "Enable quantity + / − on each line",
          "Enable remove (×) on each line",
          "Preview reflects these toggles in the drawer mock",
        ],
        note: "Requires Display mode: Sticky Cart + Drawer.",
      },
    ],
    related: [
      { slug: "cart-summary", label: "Cart summary" },
      { slug: "display", label: "Display style" },
    ],
  },
  {
    slug: "announcements",
    title: "Announcements",
    description: "Countdown or promo strip above or below the rewards / cart body.",
    group: "Drawer body",
    studioNav: "announcements",
    sections: [
      {
        id: "settings",
        title: "Settings",
        bullets: [
          "Enable announcement strip",
          "Text with optional {timer} / {{timer}} placeholder",
          "Timer value (e.g. 15:00)",
          "Background, text, border colors and font size",
          "Height: slim / default / thick",
          "Position: before or after the rewards / body block",
        ],
      },
      {
        id: "custom-html",
        title: "Custom HTML",
        paragraphs: [
          "Each drawer feature can use a custom HTML / CSS / JS template. Keep data-satc-announcement-label so the countdown still updates.",
        ],
        links: [{ label: "HTML / CSS / templates", href: "/app/docs/templates" }],
      },
    ],
    related: [
      { slug: "rewards", label: "Tiered rewards" },
      { slug: "templates", label: "Templates" },
    ],
  },
  {
    slug: "rewards",
    title: "Tiered rewards",
    description:
      "Free shipping / gift milestones, progress bar design, icons, colors, and custom HTML.",
    group: "Drawer body",
    studioNav: "rewards",
    sections: [
      {
        id: "overview",
        title: "Overview",
        paragraphs: [
          "Tiered rewards show a progress bar toward cart goals (amount or quantity). Each tier has a threshold, label, message, reward type, and optional icon.",
        ],
        links: [{ label: "Open rewards in studio", href: "/app#rewards" }],
      },
      {
        id: "tiers",
        title: "Configuring tiers",
        steps: [
          "Enable Tiered rewards",
          "Choose calculation: cart total ($) or quantity (#)",
          "Edit each tier tab: minimum amount/qty, description, title before unlock (use [AMOUNT])",
          "Set reward type: shipping, discount, product, or custom",
          "For product rewards, pick a Shopify product",
          "Choose a built-in icon or Shopify Files / URL image per tier",
        ],
      },
      {
        id: "bar-design",
        title: "Progress bar design",
        bullets: [
          "Layout: Bar below milestones, or Line in middle (icons on the track)",
          "Fill style: gradient, solid, or striped",
          "Message position: above or below the bar",
          "Show icons, icon position (inside / outside top / outside bottom), icon style, icon size, icon color",
        ],
        note: "Icon color applies to built-in SVG icons. PNG uploads keep their own colors. Theme colors affect background/progress/text; icon color stays independent.",
      },
      {
        id: "colors",
        title: "Colors",
        bullets: [
          "Use theme colors — maps progress/background to theme button tokens",
          "Or set custom background, progress, icon, and message text colors",
          "Reset reward colors restores defaults (including black icons)",
        ],
      },
      {
        id: "custom-html",
        title: "Custom rewards HTML",
        paragraphs: [
          "Enable Custom rewards HTML to edit the shell and each milestone. The default shell uses a {{#tiers}}…{{/tiers}} loop so you can edit milestone markup directly.",
        ],
        bullets: [
          "Rewards shell — rail, track, message ({{message}}, {{progress_pct}}, {{#tiers}})",
          "Reward tier — single milestone ({{{icon_html}}}, {{{label_html}}}, {{goal}}, {{reached_class}})",
          "Keep satc-slider__* classes and data-satc-reward-* attributes for layout and JS",
          "Click Restore default HTML to load the editable loop template",
          "Preview updates when the custom template is enabled; Save to publish",
        ],
        links: [{ label: "Templates guide", href: "/app/docs/templates" }],
      },
    ],
    related: [
      { slug: "announcements", label: "Announcements" },
      { slug: "templates", label: "Templates" },
      { slug: "display", label: "Display style" },
    ],
  },
  {
    slug: "recommendations",
    title: "Recommendations",
    description: "Upsell products in the empty or filled cart drawer.",
    group: "Drawer body",
    studioNav: "recommendations",
    sections: [
      {
        id: "sources",
        title: "Product source",
        bullets: [
          "Collection — pick a collection; products load from the storefront",
          "Manual products — pick specific products with the product picker",
        ],
      },
      {
        id: "display",
        title: "Display options",
        bullets: [
          "Header text and Add button label",
          "Max products shown",
          "Show with items in cart / empty cart copy",
          "Optional Shop now button",
          "Entrance animation",
        ],
        links: [{ label: "Custom tile HTML", href: "/app/docs/templates" }],
      },
    ],
    related: [
      { slug: "cart-items", label: "Cart items" },
      { slug: "templates", label: "Templates" },
    ],
  },
  {
    slug: "discounts",
    title: "Discount codes",
    description: "Discount code field in the drawer footer area.",
    group: "Drawer body",
    studioNav: "discounts",
    sections: [
      {
        id: "settings",
        title: "Settings",
        bullets: [
          "Enable discount field",
          "Placeholder and Apply button text",
        ],
        note: "Applied codes use Shopify’s standard discount URL / cart discount flow depending on theme integration.",
        links: [{ label: "Cart summary", href: "/app/docs/cart-summary" }],
      },
    ],
    related: [
      { slug: "cart-summary", label: "Cart summary" },
      { slug: "trust", label: "Trust badges" },
    ],
  },
  {
    slug: "cart-summary",
    title: "Cart summary",
    description: "Checkout button, subtotal area, and after-add behavior.",
    group: "Footer",
    studioNav: "cart-summary",
    sections: [
      {
        id: "checkout",
        title: "Checkout",
        bullets: [
          "Checkout button label",
          "Subtotal display in the drawer footer",
        ],
      },
      {
        id: "after-add",
        title: "After adding to cart",
        paragraphs: [
          "Control what happens after a successful add from the sticky bar (stay, open drawer, etc. — as configured in the studio).",
        ],
        links: [{ label: "Behavior", href: "/app/docs/behavior" }],
      },
    ],
    related: [
      { slug: "discounts", label: "Discounts" },
      { slug: "trust", label: "Trust badges" },
      { slug: "display", label: "Display style" },
    ],
  },
  {
    slug: "trust",
    title: "Trust badges",
    description: "Short trust copy under checkout (secure checkout, returns, support).",
    group: "Footer",
    studioNav: "trust",
    sections: [
      {
        id: "settings",
        title: "Settings",
        bullets: [
          "Enable trust badges",
          "Free-form text (you can use separators or short phrases)",
        ],
      },
    ],
    related: [
      { slug: "cart-summary", label: "Cart summary" },
      { slug: "templates", label: "Templates" },
    ],
  },
  {
    slug: "templates",
    title: "HTML / CSS / templates",
    description:
      "Per-feature custom HTML, CSS, and JS with Mustache placeholders for the cart drawer.",
    group: "Settings",
    studioNav: "templates",
    sections: [
      {
        id: "overview",
        title: "How templates work",
        paragraphs: [
          "Each drawer feature (header, announcement, rewards, cart line, recommendations, discount, trust, footer, etc.) can enable a custom template. Enabling with empty HTML auto-loads a safe default so layout does not break.",
        ],
        steps: [
          "Open the feature panel (or Templates) → Custom template",
          "Enable the custom template (default HTML is copied in)",
          "Edit HTML / CSS / JS tabs",
          "Keep satc-slider__* classes and data-satc-* attributes the app relies on",
          "Preview updates for supported features (e.g. rewards); Save settings to publish",
        ],
      },
      {
        id: "mustache",
        title: "Placeholders",
        bullets: [
          "{{name}} — escaped text",
          "{{{name}}} — raw HTML (icons, nested markup)",
          "{{#tiers}}…{{/tiers}} — loop over reward milestones (rewards shell)",
        ],
        links: [
          { label: "Rewards custom HTML", href: "/app/docs/rewards#custom-html" },
        ],
      },
      {
        id: "rewards-tabs",
        title: "Rewards shell vs reward tier",
        paragraphs: [
          "Under Tiered rewards → Custom rewards HTML you get two tabs: Rewards shell (whole strip) and Reward tier (each milestone). Prefer editing the {{#tiers}} loop in the shell, or use the tier tab when the shell still uses {{{tiers_html}}}.",
        ],
      },
      {
        id: "safety",
        title: "Safety",
        bullets: [
          "Script tags and inline event handlers are stripped from HTML",
          "Feature JS runs in a constrained Function scope (root, featureKey, slider)",
          "Test on a development theme before production",
        ],
      },
    ],
    related: [
      { slug: "rewards", label: "Tiered rewards" },
      { slug: "recommendations", label: "Recommendations" },
      { slug: "announcements", label: "Announcements" },
    ],
  },
  {
    slug: "pages-devices",
    title: "Pages & devices",
    description: "Where the sticky bar and drawer appear (templates and desktop/mobile).",
    group: "Settings",
    studioNav: "pages",
    sections: [
      {
        id: "pages",
        title: "Page types",
        bullets: [
          "Product (recommended — bar needs product context)",
          "Collection, Home, Search, Other",
        ],
      },
      {
        id: "devices",
        title: "Devices",
        bullets: [
          "Show sticky bar on desktop / mobile",
          "Show drawer on desktop / mobile (when using Cart drawer mode)",
        ],
        links: [{ label: "Behavior (scroll thresholds)", href: "/app/docs/behavior" }],
      },
    ],
    related: [
      { slug: "behavior", label: "Behavior" },
      { slug: "getting-started", label: "Getting started" },
    ],
  },
  {
    slug: "behavior",
    title: "Behavior",
    description: "Scroll thresholds, hide-near-form, after-add actions, and animations.",
    group: "Settings",
    studioNav: "behavior",
    sections: [
      {
        id: "visibility",
        title: "Visibility",
        bullets: [
          "Scroll distance before the sticky bar appears",
          "Hide when the main Add to cart form is visible",
        ],
      },
      {
        id: "motion",
        title: "Motion",
        bullets: [
          "Drawer open animation",
          "Recommendations entrance animation",
          "Rewards progress animation",
        ],
        links: [{ label: "Header backdrop", href: "/app/docs/header#backdrop" }],
      },
    ],
    related: [
      { slug: "design", label: "Design" },
      { slug: "display", label: "Display style" },
      { slug: "pages-devices", label: "Pages & devices" },
    ],
  },
  {
    slug: "plan",
    title: "Plan & billing",
    description: "Plan limits, branding, and syncing Pro features to the storefront.",
    group: "Settings",
    studioNav: "plan",
    sections: [
      {
        id: "plans",
        title: "Plans",
        paragraphs: [
          "Check Plan & billing in the studio for your current plan. Pro can hide Sticky ATC branding — after upgrading, use Sync storefront (or Save settings) and hard-refresh.",
        ],
        links: [{ label: "Troubleshooting branding", href: "/app/docs/troubleshooting#branding" }],
      },
    ],
    related: [
      { slug: "troubleshooting", label: "Troubleshooting" },
      { slug: "getting-started", label: "Getting started" },
    ],
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    description: "Bar not showing, theme drawer conflicts, blur, icons, and sync tips.",
    group: "Help",
    sections: [
      {
        id: "bar-missing",
        title: "Sticky bar not showing",
        steps: [
          "Confirm App embed is enabled and the theme was saved",
          "View a product page (enable other page types in Pages & devices if needed)",
          "Scroll past the threshold in Behavior / Design",
          "If Hide when main ATC is visible is on, scroll past the product form",
          "Save settings in the app, then hard-refresh the storefront",
        ],
        links: [{ label: "Getting started", href: "/app/docs/getting-started" }],
      },
      {
        id: "sticky-drawer",
        title: "Use Sticky ATC cart drawer (not the theme drawer)",
        steps: [
          "App → Display style → Sticky Cart + Drawer → Save",
          "Theme Customize → Theme settings → Cart → Cart type = Page (not Drawer)",
          "Save the theme and hard-refresh",
          "Click the header cart icon — Sticky ATC drawer should open",
        ],
        note: "Some themes hide Cart type or use another drawer app — disable competing drawers.",
        links: [{ label: "Setup help page", href: "/app/additional" }],
      },
      {
        id: "preview-vs-live",
        title: "Preview vs storefront differences",
        bullets: [
          "Preview uses sample cart totals; live uses the real cart",
          "Custom HTML must be enabled to affect preview for that feature",
          "Always Save settings before judging the live storefront",
          "Hard-refresh (Ctrl+Shift+R) to bypass CDN/browser cache for theme assets",
        ],
      },
      {
        id: "rewards-icons",
        title: "Rewards icons / PNG",
        bullets: [
          "Pick Shopify Files or paste an image URL, then Save settings",
          "Built-in icons use Icon color; PNGs keep their own colors",
          "Message position and icons-off apply in preview and live after save",
        ],
        links: [{ label: "Tiered rewards docs", href: "/app/docs/rewards" }],
      },
      {
        id: "branding",
        title: "Branding still visible on Pro?",
        paragraphs: [
          "Upgrade to Pro, click Sync storefront (or Save), then hard-refresh the product page.",
        ],
      },
      {
        id: "support",
        title: "Support",
        paragraphs: [
          "Email support@appmarka.com with your shop domain, theme name, and a screenshot of the issue.",
        ],
      },
    ],
    related: [
      { slug: "getting-started", label: "Getting started" },
      { slug: "rewards", label: "Tiered rewards" },
      { slug: "display", label: "Display style" },
    ],
  },
];

export function getDocPage(slug: string): DocPage | undefined {
  return DOC_PAGES.find((p) => p.slug === slug);
}

export function getAllDocSlugs(): string[] {
  return DOC_PAGES.map((p) => p.slug);
}
