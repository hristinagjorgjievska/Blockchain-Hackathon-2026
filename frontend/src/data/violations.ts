export interface LocalizedText {
  mk: string;
  en: string;
  sr: string;
}

export type ViolationKind = 'speeding' | 'red_light' | 'expired_registration' | 'no_parking';
export type ParkingSeverity = 'standard' | 'obstructing' | 'disabled_space';
export type CarColor = 'silver' | 'black' | 'white' | 'red' | 'blue';

export interface Violation {
  /** Security code delivered to the citizen by SMS. */
  code: string;
  /** Human-readable reference number of the case file. */
  refId: string;
  kind: ViolationKind;
  plate: string;
  vehicleMake: string;
  carColor: CarColor;
  /** ISO timestamp of the violation. */
  dateTime: string;
  street: LocalizedText;
  city: LocalizedText;
  coordinates: { lat: number; lng: number };
  speedRecorded?: number;
  speedLimit?: number;
  cameraId: string;
  issuedAt: string;
  dueDate: string;
  earlyPaymentDeadline: string;
  earlyPaymentDiscountPercent: number;
  baseFineEUR: number;
  baseFineMKD: number;
  amountDueMKD: number;
  penaltyPoints?: number;
  drivingBan?: LocalizedText;
  ownerFineEUR?: number;
  parkingSeverity?: ParkingSeverity;
  legalNote: LocalizedText;
  /** Pre-set authority status. If absent the status is derived from payment. */
  status?: 'unpaid' | 'paid' | 'voided' | 'appeal_pending';
}

/** Demo conversion rate used by North Macedonian fine notices denominated in EUR. */
export const MKD_PER_EUR = 61.5;
export const EARLY_PAYMENT_DAYS = 8;
export const EARLY_PAYMENT_DISCOUNT_PERCENT = 50;

/** Colours used to render the vehicle in the evidence imagery. */
export const CAR_PALETTE: Record<CarColor, { body: string; shade: string; glass: string }> = {
  silver: { body: '#cdd0d6', shade: '#9a9ea7', glass: '#28323f' },
  black: { body: '#2f343d', shade: '#1a1d23', glass: '#1e2630' },
  white: { body: '#e9ebee', shade: '#bcc0c7', glass: '#28323f' },
  red: { body: '#bb332c', shade: '#85211c', glass: '#28323f' },
  blue: { body: '#2c4f8c', shade: '#1b3563', glass: '#1d2a3d' },
};

interface ViolationSeed
  extends Omit<
    Violation,
    | 'baseFineMKD'
    | 'amountDueMKD'
    | 'dueDate'
    | 'earlyPaymentDeadline'
    | 'earlyPaymentDiscountPercent'
  > {}

export function eurToMkd(eur: number): number {
  return Math.round(eur * MKD_PER_EUR);
}

function addDaysDateOnly(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function isWithinEarlyPaymentWindow(v: Violation, now = new Date()): boolean {
  const deadlineEnd = new Date(`${v.earlyPaymentDeadline}T23:59:59`);
  return now <= deadlineEnd;
}

export function amountDueNowMKD(v: Violation, now = new Date()): number {
  if (!isWithinEarlyPaymentWindow(v, now)) return v.baseFineMKD;
  return Math.round(v.baseFineMKD * ((100 - v.earlyPaymentDiscountPercent) / 100));
}

function priced(seed: ViolationSeed): Violation {
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

/**
 * Demonstration dataset — 8 violations: 6 unpaid, 2 voided.
 */
export const VIOLATIONS: Violation[] = [

  // ── UNPAID (6) ───────────────────────────────────────────────────────────

  priced({
    code: 'SC-A3F7B2C8D1E5',
    refId: 'SC-2026-051744',
    kind: 'speeding',
    status: 'unpaid',
    plate: 'SK 501 TB',
    vehicleMake: 'Seat Cordoba',
    carColor: 'black',
    dateTime: '2026-05-14T13:37:00',
    street: { mk: 'Бул. Борис Трајковски', en: 'Boris Trajkovski Blvd.', sr: 'Булевар Борис Трајковски' },
    city: { mk: 'Скопје', en: 'Skopje', sr: 'Скопље' },
    coordinates: { lat: 41.98022, lng: 21.44419 },
    speedRecorded: 91,
    speedLimit: 50,
    cameraId: 'CAM-SK-052',
    issuedAt: '2026-05-14T13:58:00',
    baseFineEUR: 300,
    drivingBan: {
      mk: 'Забрана за управување од 3 до 12 месеци.',
      en: 'Driving ban from 3 to 12 months.',
      sr: 'Забрана управљања од 3 до 12 месеци.',
    },
    legalNote: {
      mk: 'Пречекорување од 30 до 50 km/h над дозволеното: 300 EUR и забрана за управување од 3 до 12 месеци.',
      en: 'Speeding 30 to 50 km/h over the limit: EUR 300 and a driving ban from 3 to 12 months.',
      sr: 'Прекорачење од 30 до 50 km/h изнад ограничења: 300 EUR и забрана управљања од 3 до 12 месеци.',
    },
  }),

  priced({
    code: 'SC-B5E1D4A9C2F7',
    refId: 'SC-2026-051881',
    kind: 'red_light',
    status: 'unpaid',
    plate: 'SK 501 TB',
    vehicleMake: 'Seat Cordoba',
    carColor: 'black',
    dateTime: '2026-05-15T17:44:00',
    street: { mk: 'Кеј Маршал Тито', en: 'Marshal Tito Quay', sr: 'Кеј Маршал Тито' },
    city: { mk: 'Охрид', en: 'Ohrid', sr: 'Охрид' },
    coordinates: { lat: 41.11731, lng: 20.80198 },
    cameraId: 'CAM-OH-003',
    issuedAt: '2026-05-15T18:09:00',
    baseFineEUR: 250,
    drivingBan: {
      mk: 'Забрана за управување од 3 до 12 месеци.',
      en: 'Driving ban from 3 to 12 months.',
      sr: 'Забрана управљања од 3 до 12 месеци.',
    },
    legalNote: {
      mk: 'Минување на црвено светло: 250 EUR и забрана за управување од 3 до 12 месеци.',
      en: 'Running a red light: EUR 250 and a driving ban from 3 to 12 months.',
      sr: 'Пролазак кроз црвено светло: 250 EUR и забрана управљања од 3 до 12 месеци.',
    },
  }),

  priced({
    code: 'SC-C8A3F6B1E4D2',
    refId: 'SC-2026-051862',
    kind: 'no_parking',
    status: 'unpaid',
    plate: 'SK 501 TB',
    vehicleMake: 'Seat Cordoba',
    carColor: 'black',
    dateTime: '2026-05-15T14:12:00',
    street: { mk: 'Ул. Цар Самоил', en: 'Tsar Samoil St.', sr: 'Улица Цар Самоил' },
    city: { mk: 'Битола', en: 'Bitola', sr: 'Битола' },
    coordinates: { lat: 41.03412, lng: 21.34011 },
    cameraId: 'CAM-BT-005',
    issuedAt: '2026-05-15T14:33:00',
    baseFineEUR: 50,
    parkingSeverity: 'disabled_space',
    legalNote: {
      mk: 'Паркирање на место наменето за лица со попреченост: 50 EUR. Можно е подигнување со пајак-служба со дополнителни трошоци.',
      en: 'Parking in a space reserved for persons with disabilities: EUR 50. Towing may apply with additional costs.',
      sr: 'Паркирање на месту намењеном особама са инвалидитетом: 50 EUR. Могуће је одношење паук-службом уз додатне трошкове.',
    },
  }),

  priced({
    code: 'SC-D2C7E9A4F1B3',
    refId: 'SC-2026-051590',
    kind: 'speeding',
    status: 'unpaid',
    plate: 'SK 501 TB',
    vehicleMake: 'Seat Cordoba',
    carColor: 'black',
    dateTime: '2026-05-16T09:18:00',
    street: { mk: 'Бул. Илинден', en: 'Ilinden Blvd.', sr: 'Булевар Илинден' },
    city: { mk: 'Тетово', en: 'Tetovo', sr: 'Тетово' },
    coordinates: { lat: 41.99971, lng: 20.97169 },
    speedRecorded: 78,
    speedLimit: 50,
    cameraId: 'CAM-TT-011',
    issuedAt: '2026-05-16T09:40:00',
    baseFineEUR: 150,
    legalNote: {
      mk: 'Пречекорување од 20 до 30 km/h над дозволеното: 150 EUR.',
      en: 'Speeding 20 to 30 km/h over the limit: EUR 150.',
      sr: 'Прекорачење од 20 до 30 km/h изнад ограничења: 150 EUR.',
    },
  }),

  priced({
    code: 'SC-E4B8D3C1A6F9',
    refId: 'SC-2026-050714',
    kind: 'no_parking',
    status: 'unpaid',
    plate: 'SK 501 TB',
    vehicleMake: 'Seat Cordoba',
    carColor: 'black',
    dateTime: '2026-05-05T11:30:00',
    street: { mk: 'Ул. Индустриска', en: 'Industrial St.', sr: 'Улица Индустријска' },
    city: { mk: 'Куманово', en: 'Kumanovo', sr: 'Куманово' },
    coordinates: { lat: 42.13281, lng: 21.71432 },
    cameraId: 'CAM-KM-007',
    issuedAt: '2026-05-05T11:52:00',
    baseFineEUR: 45,
    parkingSeverity: 'obstructing',
    legalNote: {
      mk: 'Непрописно паркирање со попречување на сообраќајот: 45 EUR.',
      en: 'Illegal parking that obstructs traffic: EUR 45.',
      sr: 'Непрописно паркирање које омета саобраћај: 45 EUR.',
    },
  }),

  priced({
    code: 'SC-F1A6C4D7B3E8',
    refId: 'SC-2026-050428',
    kind: 'expired_registration',
    status: 'unpaid',
    plate: 'SK 501 TB',
    vehicleMake: 'Seat Cordoba',
    carColor: 'black',
    dateTime: '2026-05-03T16:05:00',
    street: { mk: 'Бул. Маршал Тито', en: 'Marshal Tito Blvd.', sr: 'Булевар Маршал Тито' },
    city: { mk: 'Струмица', en: 'Strumica', sr: 'Струмица' },
    coordinates: { lat: 41.43621, lng: 22.64289 },
    cameraId: 'CAM-ST-003',
    issuedAt: '2026-05-03T16:27:00',
    baseFineEUR: 100,
    ownerFineEUR: 250,
    legalNote: {
      mk: 'Истечена регистрација или сообраќајна дозвола: 100 EUR за возачот; 250 EUR за сопственикот ако е друго лице.',
      en: 'Expired registration or traffic permit: EUR 100 for the driver; EUR 250 for the owner if different.',
      sr: 'Истекла регистрација или саобраћајна дозвола: 100 EUR за возача; 250 EUR за власника ако је друго лице.',
    },
  }),

  // ── VOIDED (2) ───────────────────────────────────────────────────────────

  priced({
    code: 'SC-2A9F4E7B1C3D',
    refId: 'SC-2026-048872',
    kind: 'expired_registration',
    status: 'voided',
    plate: 'SK 501 TB',
    vehicleMake: 'Seat Cordoba',
    carColor: 'black',
    dateTime: '2026-04-28T15:20:00',
    street: { mk: 'Ул. Кичевска', en: 'Kichevska St.', sr: 'Улица Кичевска' },
    city: { mk: 'Гостивар', en: 'Gostivar', sr: 'Гостивар' },
    coordinates: { lat: 41.79591, lng: 20.90762 },
    cameraId: 'CAM-GV-002',
    issuedAt: '2026-04-28T15:44:00',
    baseFineEUR: 100,
    ownerFineEUR: 250,
    legalNote: {
      mk: 'Истечена регистрација или сообраќајна дозвола: 100 EUR за возачот; 250 EUR за сопственикот ако е друго лице.',
      en: 'Expired registration or traffic permit: EUR 100 for the driver; EUR 250 for the owner if different.',
      sr: 'Истекла регистрација или саобраћајна дозвола: 100 EUR за возача; 250 EUR за власника ако је друго лице.',
    },
  }),

  priced({
    code: 'SC-3B1D8F5A2E9C',
    refId: 'SC-2026-049011',
    kind: 'speeding',
    status: 'voided',
    plate: 'SK 501 TB',
    vehicleMake: 'Seat Cordoba',
    carColor: 'black',
    dateTime: '2026-04-30T07:50:00',
    street: { mk: 'Автопат А1 (Велес—Скопје)', en: 'A1 Motorway (Veles—Skopje)', sr: 'Аутопут А1 (Велес—Скопље)' },
    city: { mk: 'Велес', en: 'Veles', sr: 'Велес' },
    coordinates: { lat: 41.71163, lng: 21.77441 },
    speedRecorded: 72,
    speedLimit: 50,
    cameraId: 'CAM-VL-009',
    issuedAt: '2026-04-30T08:15:00',
    baseFineEUR: 45,
    legalNote: {
      mk: 'Пречекорување од 20 до 30 km/h над дозволеното: 45 EUR.',
      en: 'Speeding 20 to 30 km/h over the limit: EUR 45.',
      sr: 'Прекорачење од 20 до 30 km/h изнад ограничења: 45 EUR.',
    },
  }),
];

export function canonicalCode(code: string): string {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function isValidCodeFormat(code: string): boolean {
  return /^SC-?[0-9A-Fa-f]{12}$/.test(code.trim());
}

export function findViolation(code: string): Violation | undefined {
  const target = canonicalCode(code);
  return VIOLATIONS.find((v) => canonicalCode(v.code) === target);
}

/**
 * Deterministic canonical representation of a violation, used as the input to
 * the SHA-256 record fingerprint shown on the authenticity panel.
 */
export function canonicalString(v: Violation): string {
  return [
    v.code,
    v.refId,
    v.kind,
    v.plate,
    v.dateTime,
    v.street.mk,
    v.city.mk,
    v.coordinates.lat.toFixed(5),
    v.coordinates.lng.toFixed(5),
    v.cameraId,
    String(v.baseFineEUR),
    String(v.baseFineMKD),
    String(amountDueNowMKD(v)),
  ].join('|');
}

export function discountMKD(v: Violation): number {
  return Math.max(0, v.baseFineMKD - amountDueNowMKD(v));
}
