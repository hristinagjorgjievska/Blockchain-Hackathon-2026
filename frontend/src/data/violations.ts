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
 * Demonstration dataset. In production these records are returned by the
 * backend from Supabase; the security code is the only thing the citizen needs
 * to retrieve their own record.
 */
export const VIOLATIONS: Violation[] = [
  priced({
    code: 'SC-8F3A2B91C7D4',
    refId: 'SC-2026-051587',
    kind: 'speeding',
    plate: 'SK 7042 BC',
    vehicleMake: 'Volkswagen Golf',
    carColor: 'silver',
    dateTime: '2026-05-15T18:42:00',
    street: { mk: 'Партизанска', en: 'Partizanska', sr: 'Партизанска' },
    city: { mk: 'Скопје', en: 'Skopje', sr: 'Скопље' },
    coordinates: { lat: 41.99813, lng: 21.42544 },
    speedRecorded: 78,
    speedLimit: 50,
    cameraId: 'CAM-SK-014',
    issuedAt: '2026-05-15T19:06:00',
    baseFineEUR: 45,
    legalNote: {
      mk: 'Пречекорување од 20 до 30 km/h над дозволеното: 45 EUR.',
      en: 'Speeding 20 to 30 km/h over the limit: EUR 45.',
      sr: 'Прекорачење од 20 до 30 km/h изнад ограничења: 45 EUR.',
    },
  }),
  priced({
    code: 'SC-2E7D9A4F1B60',
    refId: 'SC-2026-050912',
    kind: 'red_light',
    plate: 'SK 1188 KP',
    vehicleMake: 'Toyota Corolla',
    carColor: 'black',
    dateTime: '2026-05-12T08:17:00',
    street: { mk: 'Бул. Илинден', en: 'Ilinden Blvd.', sr: 'Булевар Илинден' },
    city: { mk: 'Скопје', en: 'Skopje', sr: 'Скопље' },
    coordinates: { lat: 41.99624, lng: 21.4309 },
    cameraId: 'CAM-SK-007',
    issuedAt: '2026-05-12T08:41:00',
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
    code: 'SC-5C1B8E3A9F22',
    refId: 'SC-2026-051402',
    kind: 'expired_registration',
    plate: 'SK 9930 VT',
    vehicleMake: 'Renault Clio',
    carColor: 'white',
    dateTime: '2026-05-14T17:05:00',
    street: { mk: 'Бул. Кузман Ј. Питу', en: 'Kuzman J. Pitu Blvd.', sr: 'Булевар Кузман Ј. Питу' },
    city: { mk: 'Скопје', en: 'Skopje', sr: 'Скопље' },
    coordinates: { lat: 41.98897, lng: 21.43512 },
    cameraId: 'CAM-SK-022',
    issuedAt: '2026-05-14T17:28:00',
    baseFineEUR: 100,
    ownerFineEUR: 250,
    legalNote: {
      mk: 'Истечена регистрација или сообраќајна дозвола: 100 EUR за возачот; 250 EUR за сопственикот ако е друго лице.',
      en: 'Expired registration or traffic permit: EUR 100 for the driver; EUR 250 for the owner if different.',
      sr: 'Истекла регистрација или саобраћајна дозвола: 100 EUR за возача; 250 EUR за власника ако је друго лице.',
    },
  }),
  priced({
    code: 'SC-9A4D2F8E1C36',
    refId: 'SC-2026-051633',
    kind: 'no_parking',
    plate: 'SK 3471 EH',
    vehicleMake: 'Skoda Octavia',
    carColor: 'red',
    dateTime: '2026-05-15T11:23:00',
    street: { mk: 'Плоштад Македонија', en: 'Macedonia Square', sr: 'Трг Македонија' },
    city: { mk: 'Скопје', en: 'Skopje', sr: 'Скопље' },
    coordinates: { lat: 41.99637, lng: 21.4333 },
    cameraId: 'CAM-SK-031',
    issuedAt: '2026-05-15T11:50:00',
    baseFineEUR: 30,
    parkingSeverity: 'standard',
    legalNote: {
      mk: 'Стандардно непрописно запирање или паркирање: 30 EUR. Ако се попречува сообраќајот казната е 45 EUR, а за место за лица со попреченост 50 EUR.',
      en: 'Standard illegal stopping or parking: EUR 30. Obstructing traffic is EUR 45, and parking in a disabled space is EUR 50.',
      sr: 'Стандардно непрописно заустављање или паркирање: 30 EUR. Ометање саобраћаја је 45 EUR, а паркирање на месту за особе са инвалидитетом 50 EUR.',
    },
  }),
  priced({
    code: 'SC-A1B2C3D4E5F6',
    refId: 'SC-2026-051701',
    kind: 'speeding',
    plate: 'SK 5521 AB',
    vehicleMake: 'Hyundai Tucson',
    carColor: 'blue',
    dateTime: '2026-05-16T09:14:00',
    street: { mk: 'Бул. Србија', en: 'Serbia Blvd.', sr: 'Булевар Србија' },
    city: { mk: 'Скопје', en: 'Skopje', sr: 'Скопље' },
    coordinates: { lat: 41.97682, lng: 21.46231 },
    speedRecorded: 67,
    speedLimit: 50,
    cameraId: 'CAM-SK-044',
    issuedAt: '2026-05-16T09:31:00',
    baseFineEUR: 20,
    legalNote: {
      mk: 'Пречекорување до 20 km/h над дозволеното: 20 EUR.',
      en: 'Speeding up to 20 km/h over the limit: EUR 20.',
      sr: 'Прекорачење до 20 km/h изнад ограничења: 20 EUR.',
    },
  }),
  priced({
    code: 'SC-B7C8D9E0F1A2',
    refId: 'SC-2026-051744',
    kind: 'speeding',
    plate: 'SK 8822 MT',
    vehicleMake: 'BMW 320d',
    carColor: 'black',
    dateTime: '2026-05-16T13:37:00',
    street: { mk: 'Бул. Борис Трајковски', en: 'Boris Trajkovski Blvd.', sr: 'Булевар Борис Трајковски' },
    city: { mk: 'Скопје', en: 'Skopje', sr: 'Скопље' },
    coordinates: { lat: 41.98022, lng: 21.44419 },
    speedRecorded: 91,
    speedLimit: 50,
    cameraId: 'CAM-SK-052',
    issuedAt: '2026-05-16T13:58:00',
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
    code: 'SC-C3D4E5F6A7B8',
    refId: 'SC-2026-051812',
    kind: 'speeding',
    plate: 'SK 4407 LR',
    vehicleMake: 'Audi A4',
    carColor: 'white',
    dateTime: '2026-05-16T22:08:00',
    street: { mk: 'Бул. Александар Македонски', en: 'Aleksandar Makedonski Blvd.', sr: 'Булевар Александар Македонски' },
    city: { mk: 'Скопје', en: 'Skopje', sr: 'Скопље' },
    coordinates: { lat: 41.99862, lng: 21.49133 },
    speedRecorded: 113,
    speedLimit: 60,
    cameraId: 'CAM-SK-061',
    issuedAt: '2026-05-16T22:29:00',
    baseFineEUR: 400,
    penaltyPoints: 4,
    drivingBan: {
      mk: 'Најмалку една година забрана за управување.',
      en: 'At least one year driving ban.',
      sr: 'Најмање једна година забране управљања.',
    },
    legalNote: {
      mk: 'Пречекорување за повеќе од 50 km/h: 400 EUR, 4 казнени поени и најмалку една година забрана за управување.',
      en: 'Speeding more than 50 km/h over the limit: EUR 400, 4 penalty points, and at least one year driving ban.',
      sr: 'Прекорачење за више од 50 km/h: 400 EUR, 4 казнена поена и најмање једна година забране управљања.',
    },
  }),
  priced({
    code: 'SC-D9E8F7A6B5C4',
    refId: 'SC-2026-051866',
    kind: 'no_parking',
    plate: 'SK 2190 MN',
    vehicleMake: 'Opel Astra',
    carColor: 'silver',
    dateTime: '2026-05-16T15:46:00',
    street: { mk: 'Ул. Димитрие Чуповски', en: 'Dimitrie Chupovski St.', sr: 'Улица Димитрије Чуповски' },
    city: { mk: 'Скопје', en: 'Skopje', sr: 'Скопље' },
    coordinates: { lat: 41.99491, lng: 21.43078 },
    cameraId: 'CAM-SK-036',
    issuedAt: '2026-05-16T16:02:00',
    baseFineEUR: 45,
    parkingSeverity: 'obstructing',
    legalNote: {
      mk: 'Непрописно паркирање со попречување на сообраќајот: 45 EUR.',
      en: 'Illegal parking that obstructs traffic: EUR 45.',
      sr: 'Непрописно паркирање које омета саобраћај: 45 EUR.',
    },
  }),
  priced({
    code: 'SC-E1F2A3B4C5D6',
    refId: 'SC-2026-051904',
    kind: 'no_parking',
    plate: 'SK 6006 ZZ',
    vehicleMake: 'Mercedes-Benz C-Class',
    carColor: 'black',
    dateTime: '2026-05-16T12:21:00',
    street: { mk: 'Кеј 13 Ноември', en: '13 November Quay', sr: 'Кеј 13. новембар' },
    city: { mk: 'Скопје', en: 'Skopje', sr: 'Скопље' },
    coordinates: { lat: 41.9957, lng: 21.43505 },
    cameraId: 'CAM-SK-040',
    issuedAt: '2026-05-16T12:39:00',
    baseFineEUR: 50,
    parkingSeverity: 'disabled_space',
    legalNote: {
      mk: 'Паркирање на место наменето за лица со попреченост: 50 EUR. Можно е подигнување со пајак-служба со дополнителни трошоци.',
      en: 'Parking in a space reserved for persons with disabilities: EUR 50. Towing may apply with additional costs.',
      sr: 'Паркирање на месту намењеном особама са инвалидитетом: 50 EUR. Могуће је одношење паук-службом уз додатне трошкове.',
    },
  }),

  // ── Other Macedonian cities ───────────────────────────────────────────────

  priced({
    // Охрид — speeding near the lake, discount still active
    code: 'SC-F2A3B4C5D6E7',
    refId: 'SC-2026-051950',
    kind: 'speeding',
    plate: 'OH 2241 KT',
    vehicleMake: 'Peugeot 208',
    carColor: 'white',
    dateTime: '2026-05-14T11:18:00',
    street: { mk: 'Кеј Маршал Тито', en: 'Key Marshal Tito', sr: 'Кеј Маршал Тито' },
    city: { mk: 'Охрид', en: 'Ohrid', sr: 'Охрид' },
    coordinates: { lat: 41.11731, lng: 20.80198 },
    speedRecorded: 62,
    speedLimit: 50,
    cameraId: 'CAM-OH-003',
    issuedAt: '2026-05-14T11:41:00',
    baseFineEUR: 20,
    legalNote: {
      mk: 'Пречекорување до 20 km/h над дозволеното: 20 EUR.',
      en: 'Speeding up to 20 km/h over the limit: EUR 20.',
      sr: 'Прекорачење до 20 km/h изнад ограничења: 20 EUR.',
    },
  }),

  priced({
    // Битола — red light, early-payment window expired
    code: 'SC-1C2D3E4F5A6B',
    refId: 'SC-2026-042871',
    kind: 'red_light',
    plate: 'BT 4418 RD',
    vehicleMake: 'Ford Focus',
    carColor: 'red',
    dateTime: '2026-04-28T19:33:00',
    street: { mk: 'Бул. 1 Мај', en: '1st of May Blvd.', sr: 'Булевар 1. мај' },
    city: { mk: 'Битола', en: 'Bitola', sr: 'Битола' },
    coordinates: { lat: 41.02972, lng: 21.33653 },
    cameraId: 'CAM-BT-011',
    issuedAt: '2026-04-28T19:57:00',
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
    // Куманово — expired registration, early-payment window expired
    code: 'SC-3A4B5C6D7E8F',
    refId: 'SC-2026-050199',
    kind: 'expired_registration',
    plate: 'KM 7723 BG',
    vehicleMake: 'Citroën C3',
    carColor: 'blue',
    dateTime: '2026-05-03T08:12:00',
    street: { mk: 'Ул. Индустриска', en: 'Industrial St.', sr: 'Улица Индустријска' },
    city: { mk: 'Куманово', en: 'Kumanovo', sr: 'Куманово' },
    coordinates: { lat: 42.13281, lng: 21.71432 },
    cameraId: 'CAM-KM-007',
    issuedAt: '2026-05-03T08:36:00',
    baseFineEUR: 100,
    ownerFineEUR: 250,
    legalNote: {
      mk: 'Истечена регистрација или сообраќајна дозвола: 100 EUR за возачот; 250 EUR за сопственикот ако е друго лице.',
      en: 'Expired registration or traffic permit: EUR 100 for the driver; EUR 250 for the owner if different.',
      sr: 'Истекла регистрација или саобраћајна дозвола: 100 EUR за возача; 250 EUR за власника ако је друго лице.',
    },
  }),

  priced({
    // Тетово — disabled-space parking, discount still active
    code: 'SC-6B7C8D9E0F1A',
    refId: 'SC-2026-051627',
    kind: 'no_parking',
    plate: 'TT 1092 VM',
    vehicleMake: 'Nissan Qashqai',
    carColor: 'silver',
    dateTime: '2026-05-15T14:47:00',
    street: { mk: 'Бул. Илинден', en: 'Ilinden Blvd.', sr: 'Булевар Илинден' },
    city: { mk: 'Тетово', en: 'Tetovo', sr: 'Тетово' },
    coordinates: { lat: 41.99971, lng: 20.97169 },
    cameraId: 'CAM-TT-004',
    issuedAt: '2026-05-15T15:09:00',
    baseFineEUR: 50,
    parkingSeverity: 'disabled_space',
    legalNote: {
      mk: 'Паркирање на место наменето за лица со попреченост: 50 EUR. Можно е подигнување со пајак-служба со дополнителни трошоци.',
      en: 'Parking in a space reserved for persons with disabilities: EUR 50. Towing may apply with additional costs.',
      sr: 'Паркирање на месту намењеном особама са инвалидитетом: 50 EUR. Могуће је одношење паук-службом уз додатне трошкове.',
    },
  }),

  priced({
    // Велес — heavy speeding on A1, discount still active
    code: 'SC-7C8D9E0F1A2B',
    refId: 'SC-2026-051723',
    kind: 'speeding',
    plate: 'VL 3305 PA',
    vehicleMake: 'Kia Sportage',
    carColor: 'black',
    dateTime: '2026-05-16T07:19:00',
    street: { mk: 'Автопат А1 (Велес—Скопје)', en: 'A1 Motorway (Veles—Skopje)', sr: 'Аутопут А1 (Велес—Скопље)' },
    city: { mk: 'Велес', en: 'Veles', sr: 'Велес' },
    coordinates: { lat: 41.71163, lng: 21.77441 },
    speedRecorded: 128,
    speedLimit: 80,
    cameraId: 'CAM-VL-009',
    issuedAt: '2026-05-16T07:44:00',
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
    // Гостивар — extreme speeding, penalty points, window expired
    code: 'SC-8D9E0F1A2B3C',
    refId: 'SC-2026-050337',
    kind: 'speeding',
    plate: 'GV 5519 KL',
    vehicleMake: 'Volkswagen Passat',
    carColor: 'silver',
    dateTime: '2026-05-02T22:43:00',
    street: { mk: 'Ул. Кичевска', en: 'Kichevska St.', sr: 'Улица Кичевска' },
    city: { mk: 'Гостивар', en: 'Gostivar', sr: 'Гостивар' },
    coordinates: { lat: 41.79591, lng: 20.90762 },
    speedRecorded: 116,
    speedLimit: 60,
    cameraId: 'CAM-GV-002',
    issuedAt: '2026-05-02T23:01:00',
    baseFineEUR: 400,
    penaltyPoints: 4,
    drivingBan: {
      mk: 'Најмалку една година забрана за управување.',
      en: 'At least one year driving ban.',
      sr: 'Најмањеједна година забране управљања.',
    },
    legalNote: {
      mk: 'Пречекорување за повеќе од 50 km/h: 400 EUR, 4 казнени поени и најмалку една година забрана за управување.',
      en: 'Speeding more than 50 km/h over the limit: EUR 400, 4 penalty points, and at least one year driving ban.',
      sr: 'Прекорачење за више од 50 km/h: 400 EUR, 4 казнена поена и најмање једна година забране управљања.',
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
