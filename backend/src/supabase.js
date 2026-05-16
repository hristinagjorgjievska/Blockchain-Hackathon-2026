import { amountDueNowMKD, codeHash } from './pricing.js';

export class SupabaseError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'SupabaseError';
    this.status = status;
  }
}

export function hasSupabase(config) {
  return Boolean(config.supabaseUrl && config.supabaseKey);
}

async function supabaseFetch(config, path, init = {}) {
  if (!hasSupabase(config)) throw new SupabaseError(0, 'Supabase is not configured');
  const res = await fetch(`${config.supabaseUrl}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: config.supabaseKey,
      Authorization: `Bearer ${config.supabaseKey}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new SupabaseError(res.status, text || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function violationToDb(v, pepper) {
  return {
    code_hash: codeHash(v.code, pepper),
    ref_id: v.refId,
    kind: v.kind,
    plate: v.plate,
    vehicle_make: v.vehicleMake,
    car_color: v.carColor,
    date_time: v.dateTime,
    street_mk: v.street.mk,
    street_en: v.street.en,
    street_sr: v.street.sr,
    city_mk: v.city.mk,
    city_en: v.city.en,
    city_sr: v.city.sr,
    lat: v.coordinates.lat,
    lng: v.coordinates.lng,
    speed_recorded: v.speedRecorded ?? null,
    speed_limit: v.speedLimit ?? null,
    camera_id: v.cameraId,
    issued_at: v.issuedAt,
    due_date: v.dueDate,
    early_payment_deadline: v.earlyPaymentDeadline,
    early_payment_discount_percent: v.earlyPaymentDiscountPercent,
    base_fine_eur: v.baseFineEUR,
    base_fine_mkd: v.baseFineMKD,
    amount_due_mkd: amountDueNowMKD(v),
    penalty_points: v.penaltyPoints ?? null,
    driving_ban_mk: v.drivingBan?.mk ?? null,
    driving_ban_en: v.drivingBan?.en ?? null,
    driving_ban_sr: v.drivingBan?.sr ?? null,
    owner_fine_eur: v.ownerFineEUR ?? null,
    parking_severity: v.parkingSeverity ?? null,
    legal_note_mk: v.legalNote.mk,
    legal_note_en: v.legalNote.en,
    legal_note_sr: v.legalNote.sr,
  };
}

export function dbToViolation(row, code) {
  return {
    code,
    refId: row.ref_id,
    kind: row.kind,
    plate: row.plate,
    vehicleMake: row.vehicle_make,
    carColor: row.car_color,
    dateTime: row.date_time,
    street: { mk: row.street_mk, en: row.street_en, sr: row.street_sr },
    city: { mk: row.city_mk, en: row.city_en, sr: row.city_sr },
    coordinates: { lat: Number(row.lat), lng: Number(row.lng) },
    speedRecorded: row.speed_recorded ?? undefined,
    speedLimit: row.speed_limit ?? undefined,
    cameraId: row.camera_id,
    issuedAt: row.issued_at,
    dueDate: row.due_date,
    earlyPaymentDeadline: row.early_payment_deadline,
    earlyPaymentDiscountPercent: row.early_payment_discount_percent,
    baseFineEUR: Number(row.base_fine_eur),
    baseFineMKD: row.base_fine_mkd,
    amountDueMKD: row.amount_due_mkd,
    penaltyPoints: row.penalty_points ?? undefined,
    drivingBan: row.driving_ban_mk
      ? { mk: row.driving_ban_mk, en: row.driving_ban_en, sr: row.driving_ban_sr }
      : undefined,
    ownerFineEUR: row.owner_fine_eur ? Number(row.owner_fine_eur) : undefined,
    parkingSeverity: row.parking_severity ?? undefined,
    legalNote: { mk: row.legal_note_mk, en: row.legal_note_en, sr: row.legal_note_sr },
  };
}

export function paymentToDb(payment, code, pepper) {
  return {
    receipt_id: payment.receiptId ?? null,
    code_hash: codeHash(code, pepper),
    method: payment.method,
    status: 'confirmed',
    amount_mkd: payment.amountMKD,
    amount_sol: payment.amountSol ?? null,
    payer: payment.payer ?? null,
    signature: payment.signature ?? null,
    memo: payment.memo ?? null,
    memo_summary: payment.memoSummary ?? null,
    network: payment.network ?? null,
    provider: payment.provider ?? null,
    paid_at: payment.paidAtIso,
  };
}

export function dbToPayment(row) {
  return {
    method: row.method,
    receiptId: row.receipt_id ?? undefined,
    signature: row.signature ?? undefined,
    paidAtIso: row.paid_at,
    amountMKD: row.amount_mkd,
    amountSol: row.amount_sol ? Number(row.amount_sol) : undefined,
    payer: row.payer ?? undefined,
    memo: row.memo ?? undefined,
    memoSummary: row.memo_summary ?? undefined,
    network: row.network ?? undefined,
    provider: row.provider ?? undefined,
  };
}

export async function selectViolationByCode(config, code) {
  const hash = codeHash(code, config.securityCodePepper);
  const rows = await supabaseFetch(
    config,
    `/violations?code_hash=eq.${hash}&select=*&limit=1`,
  );
  return rows?.[0] ? dbToViolation(rows[0], code) : null;
}

export async function checkDatabase(config) {
  await supabaseFetch(config, '/violations?select=id&limit=1');
  await supabaseFetch(config, '/payments?select=id&limit=1');
  return true;
}

export async function selectLatestPayment(config, code) {
  const hash = codeHash(code, config.securityCodePepper);
  const rows = await supabaseFetch(
    config,
    `/payments?code_hash=eq.${hash}&select=*&order=paid_at.desc&limit=1`,
  );
  return rows?.[0] ? dbToPayment(rows[0]) : null;
}

export async function insertPayment(config, code, payment) {
  const rows = await supabaseFetch(config, '/payments', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(paymentToDb(payment, code, config.securityCodePepper)),
  });
  return rows?.[0] ? dbToPayment(rows[0]) : payment;
}

export async function upsertViolations(config, violations) {
  const rows = await supabaseFetch(config, '/violations?on_conflict=code_hash', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(
      violations.map((violation) => violationToDb(violation, config.securityCodePepper)),
    ),
  });
  return rows ?? [];
}
