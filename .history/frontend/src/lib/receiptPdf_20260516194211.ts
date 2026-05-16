import type { Violation } from '../data/violations';
import type { PaymentRecord } from './paymentStore';

const KIND_MK: Record<string, string> = {
  speeding: 'Пречекорување на брзина',
  red_light: 'Поминување на црвено светло',
  expired_registration: 'Истечена регистрација',
  no_parking: 'Непрописно паркирање',
};

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + w).length > maxChars && cur) {
      lines.push(cur.trim());
      cur = w + ' ';
    } else {
      cur += w + ' ';
    }
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

export async function buildReceiptPdf(
  violation: Violation,
  payment: PaymentRecord,
): Promise<Blob> {
  const { PDFDocument, rgb } = await import('pdf-lib');
  const fontkit = await import('@pdf-lib/fontkit');

  const PAGE_SIZE: [number, number] = [595.28, 841.89];
  const [PW, PH] = PAGE_SIZE;
  const ML = 64;
  const MR = 48;
  const TW = PW - ML - MR;

  const NAVY         = rgb(10 / 255, 31 / 255, 60 / 255);
  const BLUE         = rgb(37 / 255, 99 / 255, 235 / 255);
  const INK          = rgb(15 / 255, 23 / 255, 42 / 255);
  const MUTED        = rgb(100 / 255, 116 / 255, 139 / 255);
  const BORDER       = rgb(203 / 255, 213 / 255, 225 / 255);
  const SURFACE      = rgb(248 / 255, 250 / 255, 252 / 255);
  const WHITE        = rgb(1, 1, 1);
  const EMERALD      = rgb(5 / 255, 150 / 255, 105 / 255);
  const EMERALD_BG   = rgb(236 / 255, 253 / 255, 245 / 255);
  const EMERALD_RING = rgb(110 / 255, 231 / 255, 183 / 255);

  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit.default);

  const fontData = await fetch('/fonts/NotoSans.ttf').then((r) => r.arrayBuffer());
  const font = await doc.embedFont(new Uint8Array(fontData));

  let logoImage = null;
  try {
    const bytes = await fetch('/mvr.png').then((r) => {
      if (!r.ok) throw new Error('not found');
      return r.arrayBuffer();
    });
    logoImage = await doc.embedPng(new Uint8Array(bytes));
  } catch {
    // text fallback
  }

  const page = doc.addPage(PAGE_SIZE);
  const now = new Date();

  // ─── Header ──────────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: PH - 98, width: PW, height: 98, color: NAVY });
  page.drawRectangle({ x: 0, y: PH - 102, width: PW, height: 4, color: BLUE });

  page.drawRectangle({
    x: ML, y: PH - 74, width: 48, height: 48,
    color: WHITE, borderColor: BORDER, borderWidth: 0.6,
  });
  if (logoImage) {
    const ratio = logoImage.width / logoImage.height;
    const pad = 48 * 0.12;
    const maxS = 48 - pad * 2;
    const drawW = ratio >= 1 ? maxS : maxS * ratio;
    const drawH = ratio >= 1 ? maxS / ratio : maxS;
    page.drawImage(logoImage, {
      x: ML + (48 - drawW) / 2,
      y: PH - 74 + (48 - drawH) / 2,
      width: drawW,
      height: drawH,
    });
  } else {
    page.drawText('МВР', { x: ML + 12, y: PH - 52, size: 10, color: NAVY, font });
  }

  page.drawText('МИНИСТЕРСТВО ЗА ВНАТРЕШНИ РАБОТИ', {
    x: ML + 64, y: PH - 39, size: 11, color: WHITE, font,
  });
  page.drawText('SafeChain MK | службен систем за сообраќајна безбедност', {
    x: ML + 64, y: PH - 57, size: 8.5, color: rgb(219 / 255, 234 / 255, 254 / 255), font,
  });
  page.drawText('ОФИЦИЈАЛЕН ДОКУМЕНТ', {
    x: PW - MR - 118, y: PH - 39, size: 8, color: rgb(191 / 255, 219 / 255, 254 / 255), font,
  });

  // ─── Title block ─────────────────────────────────────────────────────────
  let y = PH - 148;

  page.drawText('ПОТВРДА ЗА ПЛАЌАЊЕ НА СООБРАЌАЕНА КАЗНА', {
    x: ML, y, size: 16, color: NAVY, font,
  });

  y -= 22;
  page.drawText(`Референтен број: ${violation.refId}`, {
    x: ML, y, size: 9, color: MUTED, font,
  });

  // "ПЛАТЕНО" badge
  const badgeW = 80;
  const badgeH = 20;
  page.drawRectangle({
    x: PW - MR - badgeW, y: y - 4,
    width: badgeW, height: badgeH,
    color: EMERALD_BG, borderColor: EMERALD_RING, borderWidth: 0.8,
  });
  page.drawText('ПЛАТЕНО', {
    x: PW - MR - badgeW + 22, y: y + 3, size: 9.5, color: EMERALD, font,
  });

  y -= 40;

  // ─── Payment info box ─────────────────────────────────────────────────────
  const payRows: [string, string][] = [
    ['Број на потврда', payment.receiptId ?? '—'],
    ['Датум и час на уплата', new Date(payment.paidAtIso).toLocaleString('mk-MK')],
    ['Начин на плаќање', 'Картичка / банкарски трансфер'],
    ['Уплатен износ', `${payment.amountMKD.toLocaleString('mk-MK')} МКД`],
    ['Статус', 'Потврдено'],
  ];

  const ROW_H = 19;
  const SEC_H = 34;
  const PAD_V = 14;

  const payBoxH = PAD_V + SEC_H + payRows.length * ROW_H + PAD_V;

  page.drawRectangle({
    x: ML - 12, y: y - payBoxH,
    width: TW + 24, height: payBoxH,
    color: SURFACE, borderColor: BORDER, borderWidth: 0.7,
  });
  page.drawRectangle({
    x: ML - 12, y: y - payBoxH, width: 4, height: payBoxH, color: BLUE,
  });

  let ry = y - PAD_V;
  page.drawText('ДЕТАЛИ ЗА УПЛАТАТА', { x: ML, y: ry, size: 8.5, color: BLUE, font });
  page.drawLine({
    start: { x: ML, y: ry - 9 }, end: { x: ML + TW, y: ry - 9 },
    thickness: 0.5, color: BORDER,
  });
  ry -= SEC_H;

  for (const [label, value] of payRows) {
    page.drawText(label, { x: ML, y: ry, size: 9.5, color: MUTED, font });
    page.drawText(value, { x: ML + 168, y: ry, size: 9.5, color: INK, font });
    ry -= ROW_H;
  }

  y -= payBoxH + 18;

  // ─── Violation info box ───────────────────────────────────────────────────
  const violRows: [string, string][] = [
    ['Регистарска таблица', violation.plate],
    ['Возило', violation.vehicleMake],
    ['Вид на прекршок', KIND_MK[violation.kind] ?? violation.kind],
    ['Датум и час', new Date(violation.dateTime).toLocaleString('mk-MK')],
    ['Локација', `${violation.street.mk}, ${violation.city.mk}`],
    ['Сообраќајна камера', violation.cameraId],
    ...(violation.speedRecorded
      ? [[
          'Измерена брзина',
          `${violation.speedRecorded} km/h (ограничување: ${violation.speedLimit} km/h)`,
        ] as [string, string]]
      : []),
  ];

  const violBoxH = PAD_V + SEC_H + violRows.length * ROW_H + PAD_V;

  page.drawRectangle({
    x: ML - 12, y: y - violBoxH,
    width: TW + 24, height: violBoxH,
    color: SURFACE, borderColor: BORDER, borderWidth: 0.7,
  });
  page.drawRectangle({
    x: ML - 12, y: y - violBoxH, width: 4, height: violBoxH, color: BLUE,
  });

  ry = y - PAD_V;
  page.drawText('ПРЕКРШОК', { x: ML, y: ry, size: 8.5, color: BLUE, font });
  page.drawLine({
    start: { x: ML, y: ry - 9 }, end: { x: ML + TW, y: ry - 9 },
    thickness: 0.5, color: BORDER,
  });
  ry -= SEC_H;

  for (const [label, value] of violRows) {
    page.drawText(label, { x: ML, y: ry, size: 9.5, color: MUTED, font });
    page.drawText(value, { x: ML + 168, y: ry, size: 9.5, color: INK, font });
    ry -= ROW_H;
  }

  y -= violBoxH + 22;

  // ─── Legal basis note ─────────────────────────────────────────────────────
  const maxChars = Math.floor(TW / (9 * 0.54));
  const legalLines = wrapText(violation.legalNote.mk, maxChars);
  for (const line of legalLines) {
    page.drawText(line, { x: ML, y, size: 9, color: MUTED, font });
    y -= 14;
  }

  // ─── Footer ───────────────────────────────────────────────────────────────
  page.drawLine({
    start: { x: ML, y: 52 }, end: { x: PW - MR, y: 52 },
    thickness: 0.4, color: BORDER,
  });
  page.drawText(
    `Генерирано на ${now.toLocaleDateString('mk-MK')} преку SafeChain платформата на МВР.`,
    { x: ML, y: 32, size: 7.5, color: MUTED, font },
  );
  page.drawText('Прототип — Blockchain Hackathon 2026', {
    x: PW - MR - 192, y: 32, size: 7.5, color: MUTED, font,
  });

  const pdfBytes = await doc.save({ useObjectStreams: false });
  return new Blob([pdfBytes.slice(0)], { type: 'application/pdf' });
}
