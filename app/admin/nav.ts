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
  | "pages"
  | "behavior"
  | "plan"
  | "setup";

export type NavItem = {
  id: NavId;
  label: string;
  soon?: boolean;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "General",
    items: [
      { id: "design", label: "Design" },
      { id: "header", label: "Header" },
      { id: "display", label: "Display style" },
    ],
  },
  {
    title: "Body",
    items: [
      { id: "cart-items", label: "Cart items" },
      { id: "announcements", label: "Announcements" },
      { id: "rewards", label: "Tiered rewards" },
      { id: "recommendations", label: "Recommendations" },
      { id: "discounts", label: "Discount codes" },
    ],
  },
  {
    title: "Footer",
    items: [
      { id: "cart-summary", label: "Cart summary" },
      { id: "trust", label: "Trust badges" },
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

export function getNavLabel(id: NavId): string {
  return (
    NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === id)?.label ||
    "Design"
  );
}
