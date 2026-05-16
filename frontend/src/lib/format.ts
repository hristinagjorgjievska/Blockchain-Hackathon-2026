import type { Lang } from '../i18n/strings';

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function groupThousands(value: number, separator: string): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export const RSD_PER_MKD = 1.9;
export const MKD_PER_EUR = 61.5;

export function mkdToRsd(amountMKD: number): number {
  return Math.round(amountMKD * RSD_PER_MKD);
}

export function mkdToEur(amountMKD: number): number {
  return amountMKD / MKD_PER_EUR;
}

export function formatMKD(amount: number, lang: Lang): string {
  if (lang === 'mk') return `${groupThousands(amount, '.')} ден.`;
  if (lang === 'sr') return `${groupThousands(mkdToRsd(amount), '.')} дин.`;
  return formatEUR(mkdToEur(amount), lang);
}

export function formatEUR(amount: number, lang: Lang): string {
  const formatted = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return lang === 'en' ? `EUR ${formatted}` : `${formatted} EUR`;
}

export function formatSOL(amount: number): string {
  return `${amount.toFixed(3)} SOL`;
}

/** Deterministic DD.MM.YYYY — independent of browser locale data. */
export function formatDate(iso: string, _lang?: Lang): string {
  const d = new Date(iso);
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/** Deterministic DD.MM.YYYY HH:MM (24-hour) — independent of browser locale data. */
export function formatDateTime(iso: string, _lang?: Lang): string {
  const d = new Date(iso);
  return `${formatDate(iso)} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** Shorten a long address/signature for compact display. */
export function shortId(value: string, edge = 4): string {
  if (value.length <= edge * 2 + 1) return value;
  return `${value.slice(0, edge)}…${value.slice(-edge)}`;
}
