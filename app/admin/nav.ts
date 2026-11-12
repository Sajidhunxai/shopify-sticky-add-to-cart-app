import type { TranslateFn } from "../i18n";

export type NavId =
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
  | "templates"
  | "pages"
  | "behavior"
  | "plan"
  | "setup";

export type NavItem = {
  id: NavId;
  labelKey: string;
  soon?: boolean;
};

export type NavGroup = {
  titleKey: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    titleKey: "nav.general",
    items: [
      { id: "design", labelKey: "nav.design" },
      { id: "header", labelKey: "nav.header" },
      { id: "display", labelKey: "nav.display" },
    ],
  },
  {
    titleKey: "nav.body",
    items: [
      { id: "cart-items", labelKey: "nav.cartItems" },
      { id: "announcements", labelKey: "nav.announcements" },
      { id: "rewards", labelKey: "nav.rewards" },
      { id: "recommendations", labelKey: "nav.recommendations" },
      { id: "discounts", labelKey: "nav.discounts" },
    ],
  },
  {
    titleKey: "nav.footer",
    items: [
      { id: "cart-summary", labelKey: "nav.cartSummary" },
      { id: "trust", labelKey: "nav.trust" },
    ],
  },
  {
    titleKey: "nav.settings",
    items: [
      { id: "templates", labelKey: "nav.templates" },
      { id: "pages", labelKey: "nav.pages" },
      { id: "behavior", labelKey: "nav.behavior" },
      { id: "plan", labelKey: "nav.plan" },
      { id: "setup", labelKey: "nav.setup" },
    ],
  },
];

export function getNavLabel(id: NavId, t?: TranslateFn): string {
  const key =
    NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === id)?.labelKey ||
    "nav.design";
  return t ? t(key) : key;
}
