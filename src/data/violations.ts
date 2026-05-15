export interface LocalizedText {
  mk: string;
  en: string;
}

export type ViolationKind = 'speeding' | 'red_light' | 'bus_lane' | 'no_parking';
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
  baseFineMKD: number;
  amountDueMKD: number;
}

/** Colours used to render the vehicle in the evidence imagery. */
export const CAR_PALETTE: Record<CarColor, { body: string; shade: string; glass: string }> = {
  silver: { body: '#cdd0d6', shade: '#9a9ea7', glass: '#28323f' },
  black: { body: '#2f343d', shade: '#1a1d23', glass: '#1e2630' },
  white: { body: '#e9ebee', shade: '#bcc0c7', glass: '#28323f' },
  red: { body: '#bb332c', shade: '#85211c', glass: '#28323f' },
  blue: { body: '#2c4f8c', shade: '#1b3563', glass: '#1d2a3d' },
};

/**
 * Demonstration dataset. In a production system these records live in the
 * official Safe City case-management database; the security code is the only
 * thing the citizen needs to retrieve their own record.
 */
export const VIOLATIONS: Violation[] = [
  {
    code: 'SC-8F3A2B91C7D4',
    refId: 'SC-2026-051587',
    kind: 'speeding',
    plate: 'SK 7042 BC',
    vehicleMake: 'Volkswagen Golf',
    carColor: 'silver',
    dateTime: '2026-05-15T18:42:00',
    street: { mk: 'Партизанска', en: 'Partizanska' },
    city: { mk: 'Скопје', en: 'Skopje' },
    coordinates: { lat: 41.99813, lng: 21.42544 },
    speedRecorded: 78,
    speedLimit: 50,
    cameraId: 'CAM-SK-014',
    issuedAt: '2026-05-15T19:06:00',
    dueDate: '2026-05-23',
    baseFineMKD: 5000,
    amountDueMKD: 3500,
  },
  {
    code: 'SC-2E7D9A4F1B60',
    refId: 'SC-2026-050912',
    kind: 'red_light',
    plate: 'SK 1188 KP',
    vehicleMake: 'Toyota Corolla',
    carColor: 'black',
    dateTime: '2026-05-12T08:17:00',
    street: { mk: 'Бул. Илинден', en: 'Ilinden Blvd.' },
    city: { mk: 'Скопје', en: 'Skopje' },
    coordinates: { lat: 41.99624, lng: 21.4309 },
    cameraId: 'CAM-SK-007',
    issuedAt: '2026-05-12T08:41:00',
    dueDate: '2026-05-20',
    baseFineMKD: 8000,
    amountDueMKD: 6000,
  },
  {
    code: 'SC-5C1B8E3A9F22',
    refId: 'SC-2026-051402',
    kind: 'bus_lane',
    plate: 'SK 9930 VT',
    vehicleMake: 'Renault Clio',
    carColor: 'white',
    dateTime: '2026-05-14T17:05:00',
    street: { mk: 'Бул. Кузман Ј. Питу', en: 'Kuzman J. Pitu Blvd.' },
    city: { mk: 'Скопје', en: 'Skopje' },
    coordinates: { lat: 41.98897, lng: 21.43512 },
    cameraId: 'CAM-SK-022',
    issuedAt: '2026-05-14T17:28:00',
    dueDate: '2026-05-22',
    baseFineMKD: 3000,
    amountDueMKD: 2000,
  },
  {
    code: 'SC-9A4D2F8E1C36',
    refId: 'SC-2026-051633',
    kind: 'no_parking',
    plate: 'SK 3471 EH',
    vehicleMake: 'Škoda Octavia',
    carColor: 'red',
    dateTime: '2026-05-15T11:23:00',
    street: { mk: 'Плоштад Македонија', en: 'Macedonia Square' },
    city: { mk: 'Скопје', en: 'Skopje' },
    coordinates: { lat: 41.99637, lng: 21.4333 },
    cameraId: 'CAM-SK-031',
    issuedAt: '2026-05-15T11:50:00',
    dueDate: '2026-05-23',
    baseFineMKD: 2500,
    amountDueMKD: 1500,
  },
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
    String(v.baseFineMKD),
    String(v.amountDueMKD),
  ].join('|');
}

export function discountMKD(v: Violation): number {
  return Math.max(0, v.baseFineMKD - v.amountDueMKD);
}
