import type { Lang } from '../i18n/strings';

const localeOf = (lang: Lang): string => (lang === 'mk' ? 'mk-MK' : 'en-GB');

export function formatMKD(amount: number, lang: Lang): string {
  const formatted = new Intl.NumberFormat(localeOf(lang)).format(amount);
  return lang === 'mk' ? `${formatted} ден.` : `${formatted} MKD`;
}

export function formatSOL(amount: number): string {
  return `${amount.toFixed(3)} SOL`;
}

export function formatDateTime(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(localeOf(lang), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function formatDate(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(localeOf(lang), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso));
}

/** Shorten a long address/signature for compact display. */
export function shortId(value: string, edge = 4): string {
  if (value.length <= edge * 2 + 1) return value;
  return `${value.slice(0, edge)}…${value.slice(-edge)}`;
}
