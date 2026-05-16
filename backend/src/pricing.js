import { createHash } from 'node:crypto';

export const MKD_PER_EUR = 61.5;
export const EARLY_PAYMENT_DAYS = 8;
export const EARLY_PAYMENT_DISCOUNT_PERCENT = 50;

export function eurToMkd(eur) {
  return Math.round(Number(eur) * MKD_PER_EUR);
}

export function canonicalCode(code) {
  return String(code ?? '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

export function isValidCodeFormat(code) {
  return /^SC-?[0-9A-Fa-f]{12}$/.test(String(code ?? '').trim());
}

export function codeHash(code, pepper) {
  return createHash('sha256')
    .update(`${pepper}:${canonicalCode(code)}`)
    .digest('hex');
}

export function addDaysDateOnly(iso, days) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function isWithinEarlyPaymentWindow(violation, now = new Date()) {
  const deadlineEnd = new Date(`${violation.earlyPaymentDeadline}T23:59:59`);
  return now <= deadlineEnd;
}

export function amountDueNowMKD(violation, now = new Date()) {
  if (!isWithinEarlyPaymentWindow(violation, now)) return violation.baseFineMKD;
  return Math.round(
    violation.baseFineMKD * ((100 - violation.earlyPaymentDiscountPercent) / 100),
  );
}

export function priced(seed) {
  const baseFineMKD = eurToMkd(seed.baseFineEUR);
  const earlyPaymentDeadline = addDaysDateOnly(seed.issuedAt, EARLY_PAYMENT_DAYS);
  const amountDueMKD = Math.round(
    baseFineMKD * ((100 - EARLY_PAYMENT_DISCOUNT_PERCENT) / 100),
  );
  return {
    ...seed,
    dueDate: earlyPaymentDeadline,
    earlyPaymentDeadline,
    earlyPaymentDiscountPercent: EARLY_PAYMENT_DISCOUNT_PERCENT,
    baseFineMKD,
    amountDueMKD,
  };
}
