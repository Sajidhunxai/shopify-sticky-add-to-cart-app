export function colorFromEvent(e: Event): string {
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
