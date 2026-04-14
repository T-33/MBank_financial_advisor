// MBank formatting utilities

/**
 * formatSom(3409.53) → "3 409,53 С"
 * Uses non-breaking space as thousands separator, comma as decimal, " С" suffix.
 */
export function formatSom(n: number): string {
  const [int, dec] = n.toFixed(2).split(".");
  const intFormatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
  return `${intFormatted},${dec}\u00A0С`;
}

/**
 * formatSomCompact(3409.53) → "3 409 С" (no decimals, for tight spaces)
 */
export function formatSomCompact(n: number): string {
  const rounded = Math.round(n);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
  return `${formatted}\u00A0С`;
}

/**
 * formatDate("2026-04-14") → "14 апр"
 */
export function formatDate(iso: string): string {
  const months = [
    "янв", "фев", "мар", "апр", "май", "июн",
    "июл", "авг", "сен", "окт", "ноя", "дек",
  ];
  const parts = iso.split("-");
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  return `${d} ${months[m - 1]}`;
}

/**
 * daysUntil("2026-04-20") → 6  (from today 2026-04-14)
 */
export function daysUntil(isoDate: string): number {
  const today = new Date("2026-04-14");
  const target = new Date(isoDate);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
