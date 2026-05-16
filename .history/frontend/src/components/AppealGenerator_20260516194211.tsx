
 // * Dependency: npm install pdf-lib
 

import { useRef, useState } from 'react';
import { useLang } from '../i18n/LangContext';
import { amountDueNowMKD, type Violation } from '../data/violations';
import { setLocalStatus } from '../lib/violationStatusStore';

const IcDoc = ({ cls }: { cls?: string }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);
const IcCheck = ({ cls }: { cls?: string }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);
const IcDown = ({ cls }: { cls?: string }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);
const IcEye = ({ cls }: { cls?: string }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);
const IcChev = ({ cls, open }: { cls?: string; open: boolean }) => (
  <svg className={`${cls} transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
  </svg>
);
const IcRefresh = ({ cls }: { cls?: string }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);
const IcImage = ({ cls }: { cls?: string }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5zm10.5-11.25h.008v.008h-.008v-.008z" />
  </svg>
);
const IcX = ({ cls }: { cls?: string }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


const KIND_MK: Record<string, string> = {
  speeding: 'пречекорување на дозволена брзина',
  red_light: 'поминување на црвено светло',
  expired_registration: 'истечена регистрација или сообраќајна дозвола',
  no_parking: 'непрописно паркирање',
};

const GROUNDS = [
  { value: 'yellow_light', labelKey: 'appeal.ground.yellow_light' },
  { value: 'sign_invisible', labelKey: 'appeal.ground.sign_invisible' },
  { value: 'emergency', labelKey: 'appeal.ground.emergency' },
  { value: 'wrong_vehicle', labelKey: 'appeal.ground.wrong_vehicle' },
  { value: 'device_error', labelKey: 'appeal.ground.device_error' },
  { value: 'other', labelKey: 'appeal.ground.other' },
];

function buildAppealText(v: Violation, ground: string, description: string): string {
  const kind    = KIND_MK[v.kind] ?? v.kind;
  const date    = new Date(v.dateTime).toLocaleString('mk-MK');
  const speed   = v.speedRecorded
    ? `Според записот: ${v.speedRecorded} km/h при дозволени ${v.speedLimit} km/h.`
    : '';

  const groundTexts: Record<string, string> = {
    yellow_light: `Семафорот прикажуваше жолто светло, а не црвено — поминувањето беше законски дозволено (член 56 од ЗБСП). Запирањето би претставувало опасност за сообраќајот.`,
    sign_invisible: `Сообраќајната ознака не беше видлива во моментот на прекршокот: ${description}. Согласно член 44 од Законот за јавните патишта, нечитливоста на ознаката го исклучува прекршочниот карактер.`,
    emergency: `Постапувањето беше предизвикано од непредвидлива ситуација — виша сила. Конкретно: ${description}. Согласно начелото на крајна нужност, ваквото постапување го исклучува прекршочниот карактер.`,
    wrong_vehicle: `Возилото ${v.plate} не беше во моја сопственост/употреба во моментот на прекршокот. ${description}. Барам МВР да ги провери сопственичките записи и да го поништи налогот.`,
    device_error: `Изразувам сомнеж во точноста на мерниот уред/камерата ${v.cameraId}. ${description}. Барам увид во записот за калибрација согласно член 9 од Законот за метрологија.`,
    other: `${description}. Сметам дека налогот е неоснован и барам негово поништување.`,
  };

  const groundParagraph = groundTexts[ground] ?? groundTexts['other'];

  return `Предмет: ПРИГОВОР против прекршочен налог бр. ${v.refId}

Поднесувам приговор против прекршочниот налог бр. ${v.refId} од ${date} за наводно ${kind} на ${v.street.mk}, ${v.city.mk} (камера ${v.cameraId}).${speed ? ` ${speed}` : ''}

ОБРАЗЛОЖЕНИЕ:
${groundParagraph}

Согласно член 100 од Законот за прекршоци, барам:
1. Поништување на налогот бр. ${v.refId};
2. Обнова на постапката;
3. Писмен одговор во законскиот рок.

Со почит,

________________________________
Подносител на приговорот

Скопје, ${new Date().toLocaleDateString('mk-MK')}`;
}

function wrapText(text: string, max: number): string[] {
  const words = text.split(' '), lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + w).length > max && cur) { lines.push(cur.trim()); cur = w + ' '; }
    else cur += w + ' ';
  }
  if (cur) lines.push(cur.trim());
  return lines;
}

async function compressImage(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        
        let width = img.width;
        let height = img.height;
        
        if (width > 600) {
          height = (height * 600) / width;
          width = 600;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function buildPdf(appealText: string, v: Violation, images: string[] = []): Promise<Blob> {
  const { PDFDocument, rgb } = await import('pdf-lib');
  const fontkit = await import('@pdf-lib/fontkit');

  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit.default);

  const PAGE_SIZE: [number, number] = [595.28, 841.89]; // A4 size in points
  const [PW, PH] = PAGE_SIZE;
  const ML = 64;
  const MR = 48;
  const TW = PW - ML - MR;
  const BOTTOM = 76;

  const NAVY = rgb(10/255, 31/255, 60/255);
  const BLUE = rgb(37/255, 99/255, 235/255);
  const INK = rgb(15/255, 23/255, 42/255);
  const MUTED = rgb(100/255, 116/255, 139/255);
  const LGRAY = rgb(148/255, 163/255, 184/255);
  const BORDER = rgb(203/255, 213/255, 225/255);
  const SURFACE = rgb(248/255, 250/255, 252/255);
  const PALE_BLUE = rgb(239/255, 246/255, 255/255);
  const WHITE = rgb(1, 1, 1);

  let page = doc.addPage(PAGE_SIZE);
  let y = PH - 128;

  const fontData = await fetch('/fonts/NotoSans.ttf').then(r => r.arrayBuffer());
  const font = await doc.embedFont(new Uint8Array(fontData));

  type PdfPage = typeof page;
  type PdfColor = ReturnType<typeof rgb>;
  type EmbeddedImage = Awaited<ReturnType<typeof doc.embedPng>>;

  let logoImage: EmbeddedImage | null = null;
  try {
    const logoBytes = await fetch('/mvr.png').then((r) => {
      if (!r.ok) throw new Error('Logo not found');
      return r.arrayBuffer();
    });
    logoImage = await doc.embedPng(new Uint8Array(logoBytes));
  } catch {
    logoImage = null;
  }

  const now = new Date();

  const drawLogo = (targetPage: PdfPage, x: number, yPos: number, size: number) => {
    targetPage.drawRectangle({
      x,
      y: yPos,
      width: size,
      height: size,
      color: WHITE,
      borderColor: BORDER,
      borderWidth: 0.6,
    });

    if (logoImage) {
      const ratio = logoImage.width / logoImage.height;
      const padding = size * 0.12;
      const maxSize = size - padding * 2;
      const drawW = ratio >= 1 ? maxSize : maxSize * ratio;
      const drawH = ratio >= 1 ? maxSize / ratio : maxSize;
      targetPage.drawImage(logoImage, {
        x: x + (size - drawW) / 2,
        y: yPos + (size - drawH) / 2,
        width: drawW,
        height: drawH,
      });
      return;
    }

    targetPage.drawText('МВР', {
      x: x + size * 0.2,
      y: yPos + size * 0.42,
      size: size * 0.22,
      color: NAVY,
      font,
    });
  };

  const drawFullHeader = (targetPage: PdfPage) => {
    targetPage.drawRectangle({ x: 0, y: PH - 98, width: PW, height: 98, color: NAVY });
    targetPage.drawRectangle({ x: 0, y: PH - 102, width: PW, height: 4, color: BLUE });
    drawLogo(targetPage, ML, PH - 74, 48);

    targetPage.drawText('МИНИСТЕРСТВО ЗА ВНАТРЕШНИ РАБОТИ', {
      x: ML + 64,
      y: PH - 39,
      size: 11,
      color: WHITE,
      font,
    });
    targetPage.drawText('SafeChain MK | службен систем за сообраќајна безбедност', {
      x: ML + 64,
      y: PH - 57,
      size: 8.5,
      color: rgb(219/255, 234/255, 254/255),
      font,
    });
    targetPage.drawText('ОФИЦИЈАЛЕН НАЦРТ', {
      x: PW - MR - 96,
      y: PH - 39,
      size: 8,
      color: rgb(191/255, 219/255, 254/255),
      font,
    });
  };

  const drawCompactHeader = (targetPage: PdfPage) => {
    targetPage.drawRectangle({ x: 0, y: PH - 40, width: PW, height: 40, color: NAVY });
    drawLogo(targetPage, ML, PH - 34, 24);
    targetPage.drawText('SafeChain MK | МВР', {
      x: ML + 36,
      y: PH - 24,
      size: 8.5,
      color: WHITE,
      font,
    });
    targetPage.drawText(v.refId, {
      x: PW - MR - 84,
      y: PH - 24,
      size: 8,
      color: rgb(219/255, 234/255, 254/255),
      font,
    });
  };

  const drawFooter = (targetPage: PdfPage, pageNumber: number, pageCount: number) => {
    targetPage.drawLine({
      start: { x: ML, y: 52 },
      end: { x: PW - MR, y: 52 },
      thickness: 0.4,
      color: BORDER,
    });
    targetPage.drawText(
      `Генерирано на ${now.toLocaleDateString('mk-MK')} преку SafeChain платформата на МВР.`,
      { x: ML, y: 32, size: 7.5, color: MUTED, font }
    );
    targetPage.drawText(`${pageNumber}/${pageCount}`, {
      x: PW - MR - 20,
      y: 32,
      size: 7.5,
      color: MUTED,
      font,
    });
  };

  const startNewPage = (sectionTitle?: string) => {
    page = doc.addPage(PAGE_SIZE);
    drawCompactHeader(page);
    y = PH - 72;

    if (sectionTitle) {
      page.drawText(sectionTitle.toUpperCase(), {
        x: ML,
        y,
        size: 13,
        color: NAVY,
        font,
      });
      page.drawLine({
        start: { x: ML, y: y - 10 },
        end: { x: PW - MR, y: y - 10 },
        thickness: 0.8,
        color: BLUE,
      });
      y -= 34;
    }
  };

  const ensureSpace = (height: number) => {
    if (y - height < BOTTOM) startNewPage();
  };

  const drawSectionTitle = (label: string) => {
    ensureSpace(30);
    page.drawText(label.toUpperCase(), {
      x: ML,
      y,
      size: 9,
      color: BLUE,
      font,
    });
    page.drawLine({
      start: { x: ML, y: y - 8 },
      end: { x: PW - MR, y: y - 8 },
      thickness: 0.5,
      color: BORDER,
    });
    y -= 26;
  };

  const drawWrappedText = (
    text: string,
    options: {
      x?: number;
      width?: number;
      size?: number;
      lineHeight?: number;
      color?: PdfColor;
      indent?: number;
    } = {}
  ) => {
    const size = options.size ?? 10;
    const lineHeight = options.lineHeight ?? 15;
    const x = options.x ?? ML;
    const width = options.width ?? TW;
    const indent = options.indent ?? 0;
    const maxChars = Math.max(22, Math.floor(width / (size * 0.54)));
    const lines = wrapText(text, maxChars);

    for (const line of lines) {
      ensureSpace(lineHeight + 2);
      page.drawText(line, {
        x: x + indent,
        y,
        size,
        color: options.color ?? INK,
        font,
      });
      y -= lineHeight;
    }
  };

  const drawCallout = (text: string) => {
    const maxChars = Math.floor(TW / (9.5 * 0.54));
    const lines = wrapText(text, maxChars);
    const boxHeight = lines.length * 13 + 22;
    ensureSpace(boxHeight + 8);

    page.drawRectangle({
      x: ML - 10,
      y: y - boxHeight + 7,
      width: TW + 20,
      height: boxHeight,
      color: PALE_BLUE,
      borderColor: rgb(191/255, 219/255, 254/255),
      borderWidth: 0.6,
    });

    let lineY = y - 12;
    for (const line of lines) {
      page.drawText(line, {
        x: ML + 4,
        y: lineY,
        size: 9.5,
        color: NAVY,
        font,
      });
      lineY -= 13;
    }

    y -= boxHeight + 8;
  };

  drawFullHeader(page);

  page.drawText('ПРИГОВОР ЗА СООБРАЌАЕН ПРЕКРШОК', {
    x: ML,
    y,
    size: 18,
    color: NAVY,
    font,
  });
  page.drawText(`Референтен број: ${v.refId}`, {
    x: ML,
    y: y - 20,
    size: 9,
    color: MUTED,
    font,
  });
  page.drawRectangle({
    x: PW - MR - 126,
    y: y - 25,
    width: 126,
    height: 34,
    color: SURFACE,
    borderColor: BORDER,
    borderWidth: 0.6,
  });
  page.drawText('СТАТУС НА ДОКУМЕНТ', {
    x: PW - MR - 116,
    y: y - 4,
    size: 6.8,
    color: MUTED,
    font,
  });
  page.drawText('НАЦРТ ЗА ПОДНЕСУВАЊЕ', {
    x: PW - MR - 116,
    y: y - 18,
    size: 8,
    color: NAVY,
    font,
  });
  y -= 58;

  const rows: [string, string][] = [
    ['Код:', v.code],
    ['Датум и час:', new Date(v.dateTime).toLocaleString('mk-MK')],
    ['Локација:', `${v.street.mk}, ${v.city.mk}`],
    ['Возило:', `${v.vehicleMake}  |  ${v.plate}`],
    ['Камера:', v.cameraId],
    ...(v.speedRecorded
      ? [['Брзина:', `${v.speedRecorded} km/h  (ограничување: ${v.speedLimit} km/h)`] as [string, string]]
      : []),
    ['Казна:', `${amountDueNowMKD(v).toLocaleString('mk-MK')} МКД`],
    ['Рок:', new Date(v.dueDate).toLocaleDateString('mk-MK')],
  ];

  const tableHeight = 42 + rows.length * 19;
  page.drawRectangle({
    x: ML - 10,
    y: y - tableHeight,
    width: TW + 20,
    height: tableHeight,
    color: SURFACE,
    borderColor: BORDER,
    borderWidth: 0.7,
  });
  page.drawRectangle({
    x: ML - 10,
    y: y - tableHeight,
    width: 4,
    height: tableHeight,
    color: BLUE,
  });
  page.drawText('ПОДАТОЦИ ЗА ПРЕКРШОЧНИОТ НАЛОГ', {
    x: ML + 8,
    y: y - 18,
    size: 9,
    color: NAVY,
    font,
  });

  let rowY = y - 42;
  for (const [label, val] of rows) {
    page.drawText(label.replace(':', ''), {
      x: ML + 8,
      y: rowY,
      size: 10,
      color: MUTED,
      font,
    });

    page.drawText(val, {
      x: ML + 142,
      y: rowY,
      size: 10,
      color: INK,
      font,
    });

    rowY -= 19;
  }

  y -= tableHeight + 28;
  drawSectionTitle('Содржина на приговорот');

  const paragraphs = appealText.split('\n').map(p => p.trim()).filter(Boolean);

  const drawSignatureBlock = (dateLine: string) => {
    ensureSpace(84);

    page.drawText('Со почит,', {
      x: ML,
      y,
      size: 10.2,
      color: INK,
      font,
    });

    const lineY = y - 26;
    page.drawLine({
      start: { x: ML, y: lineY },
      end: { x: ML + 156, y: lineY },
      thickness: 0.6,
      color: LGRAY,
    });
    page.drawText('Подносител на приговорот', {
      x: ML,
      y: lineY - 15,
      size: 8,
      color: MUTED,
      font,
    });

    page.drawLine({
      start: { x: PW - MR - 156, y: lineY },
      end: { x: PW - MR, y: lineY },
      thickness: 0.6,
      color: LGRAY,
    });
    page.drawText('Службено лице / Печат', {
      x: PW - MR - 156,
      y: lineY - 15,
      size: 8,
      color: MUTED,
      font,
    });

    if (dateLine) {
      page.drawText(dateLine, {
        x: ML,
        y: lineY - 38,
        size: 8.5,
        color: INK,
        font,
      });
    }

    y = lineY - 62;
  };

  for (let idx = 0; idx < paragraphs.length; idx++) {
    const para = paragraphs[idx];
    if (para.startsWith('Предмет:')) {
      drawCallout(para);
      continue;
    }

    if (para === 'ОБРАЗЛОЖЕНИЕ:') {
      ensureSpace(22);
      page.drawText('ОБРАЗЛОЖЕНИЕ', {
        x: ML,
        y,
        size: 10.5,
        color: NAVY,
        font,
      });
      y -= 20;
      continue;
    }

    if (para === 'Со почит,') {
      drawSignatureBlock(paragraphs[idx + 3] ?? '');
      idx += 3;
      continue;
    }

    if (/^\d+\./.test(para)) {
      drawWrappedText(para, { x: ML + 14, width: TW - 14, size: 10, lineHeight: 15, color: INK });
    } else {
      drawWrappedText(para, { size: 10.2, lineHeight: 15.5, color: INK });
    }
    y -= 5;
  }

  const imagesToAdd = images.slice(0, 5);

  if (imagesToAdd.length > 0) {
    const drawEvidenceTitle = () => {
      ensureSpace(28);
      page.drawText('ДОДАТОЦИ - ДОКАЗИ', {
        x: ML,
        y,
        size: 10,
        color: BLUE,
        font,
      });
      page.drawLine({
        start: { x: ML, y: y - 8 },
        end: { x: PW - MR, y: y - 8 },
        thickness: 0.5,
        color: BORDER,
      });
      y -= 24;
    };

    drawEvidenceTitle();

    for (let i = 0; i < imagesToAdd.length; i++) {
      try {
        const imgData = imagesToAdd[i];

        if (!imgData || !imgData.includes('data:image')) continue;

        const rawBytes = dataUrlToBytes(imgData);

        let image;
        if (imgData.includes('jpeg') || imgData.includes('jpg')) {
          image = await doc.embedJpg(rawBytes);
        } else {
          image = await doc.embedPng(rawBytes);
        }

        const dims = image.size();
        const maxW = TW - 36;
        const fitImage = () => {
          const availableImageHeight = Math.max(96, y - BOTTOM - 78);
          const maxH = Math.min(220, availableImageHeight);
          let w = dims.width;
          let h = dims.height;

          if (w > maxW) {
            h = (h * maxW) / w;
            w = maxW;
          }
          if (h > maxH) {
            w = (w * maxH) / h;
            h = maxH;
          }

          return { w, h };
        };

        let { w, h } = fitImage();

        const cardHeight = h + 62;
        if (y - cardHeight - 16 < BOTTOM) {
          startNewPage('Додатоци - докази');
          ({ w, h } = fitImage());
        }
        const fittedCardHeight = h + 62;
        const imageTop = y - 34;
        const imageY = imageTop - h;
        const cardY = imageY - 22;

        page.drawRectangle({
          x: ML - 10,
          y: cardY,
          width: TW + 20,
          height: fittedCardHeight,
          color: WHITE,
          borderColor: BORDER,
          borderWidth: 0.7,
        });
        page.drawText(`Доказ ${i + 1}`, {
          x: ML + 4,
          y: y - 18,
          size: 10,
          color: NAVY,
          font,
        });

        page.drawImage(image, {
          x: ML + (TW - w) / 2,
          y: imageY,
          width: w,
          height: h,
        });

        page.drawText(`Приложен доказ кон приговорот ${v.refId}`, {
          x: ML + 4,
          y: cardY + 10,
          size: 8,
          color: MUTED,
          font,
        });

        y = cardY - 18;
      } catch {
      }
    }
  }

  const pages = doc.getPages();
  pages.forEach((pdfPage, index) => drawFooter(pdfPage, index + 1, pages.length));

  const pdfBytes = await doc.save({ useObjectStreams: false });
  return new Blob([pdfBytes.slice(0)], { type: 'application/pdf' });
}

type Step = 'form' | 'result';

export function AppealGenerator({
  violation,
  onAppealSubmitted,
}: {
  violation: Violation;
  onAppealSubmitted?: () => void;
}) {
  const { t } = useLang();
  const [open,        setOpen]        = useState(false);
  const [step,        setStep]        = useState<Step>('form');
  const [ground,      setGround]      = useState('');
  const [description, setDescription] = useState('');
  const [appealText,  setAppealText]  = useState('');
  const [pdfUrl,      setPdfUrl]      = useState<string | null>(null);
  const [showText,    setShowText]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [images,      setImages]      = useState<string[]>([]);
  const blobRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;
    
    const newImages: string[] = [];
    for (const file of Array.from(files)) {
      const data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.readAsDataURL(file);
      });
      const compressed = await compressImage(data);
      newImages.push(compressed);
    }
    
    setImages(prev => [...prev, ...newImages]);
    e.currentTarget.value = '';
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const generate = async () => {
    if (!ground || description.trim().length < 10) return;
    setLoading(true);

    try {
      const text = buildAppealText(violation, ground, description);
      const blob = await buildPdf(text, violation, images);

      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
      const url = URL.createObjectURL(blob);
      blobRef.current = url;

      setAppealText(text);
      setPdfUrl(url);
      setStep('result');
    } catch (err) {
      console.error('PDF generation failed:', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`${t('appeal.error')}\n\n${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href     = pdfUrl;
    a.download = `prigovor-${violation.refId}.pdf`;
    a.click();
  };

  const reset = () => {
    setStep('form');
    setGround('');
    setDescription('');
    setAppealText('');
    setPdfUrl(null);
    setShowText(false);
    setImages([]);
  };

  const canSubmit = ground !== '' && description.trim().length >= 10;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 p-5 sm:p-6 text-left"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
          <IcDoc cls="h-5 w-5" />
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-slate-900">{t('appeal.title')}</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {t('appeal.subtitle')}
          </p>
        </div>
        <IcChev cls="h-5 w-5 shrink-0 text-slate-400" open={open} />
      </button>

      {open && (
        <div className="border-t border-slate-200 p-5 sm:p-6 space-y-5">

          {step === 'form' && (
            <>
              <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
                <span className="font-semibold">{t('appeal.noteLabel')}:</span>{' '}
                {t('appeal.noteBody')}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {t('appeal.groundLabel')}
                </label>
                <select
                  value={ground}
                  onChange={(e) => setGround(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">{t('appeal.groundPlaceholder')}</option>
                  {GROUNDS.map((g) => (
                    <option key={g.value} value={g.value}>{t(g.labelKey)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {t('appeal.descriptionLabel')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder={t('appeal.descriptionPlaceholder')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                />
                <p className="mt-1 text-xs text-slate-400">
                  {t('appeal.characters', { count: description.trim().length })}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {t('appeal.imagesLabel')}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-slate-300 px-4 py-6 text-center hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <IcImage cls="h-5 w-5 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-600">
                    {t('appeal.imagesUpload')}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {t('appeal.imagesHelp')}
                  </p>
                </button>
                
                {images.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200">
                        <img
                          src={img}
                          alt={t('appeal.imageAlt', { index: idx + 1 })}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded text-white hover:bg-red-600 transition"
                        >
                          <IcX cls="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-1.5 py-1 text-center">
                          {t('appeal.imageLabel', { index: idx + 1 })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {images.length > 0 && (
                  <p className="mt-2 text-xs text-slate-500">
                    {t('appeal.imagesAttached', { count: images.length })}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={generate}
                disabled={!canSubmit || loading}
                className="w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 active:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? t('appeal.generating') : t('appeal.generate')}
              </button>
            </>
          )}

          {step === 'result' && (
            <div className="space-y-4">

              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100">
                  <IcCheck cls="h-4 w-4 text-emerald-700" />
                </span>
                <p className="text-sm font-semibold text-slate-800">
                  {t('appeal.ready')}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowText((s) => !s)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 bg-slate-50 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  <IcEye cls="h-4 w-4 text-slate-500" />
                  {showText ? t('appeal.hideText') : t('appeal.showText')}
                  <IcChev cls="h-4 w-4 text-slate-400 ml-auto" open={showText} />
                </button>
                {showText && (
                  <div className="px-4 py-4 border-t border-slate-200 bg-white">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">
                      {appealText}
                    </pre>
                  </div>
                )}
              </div>

              {pdfUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <div className="flex items-center gap-2 bg-slate-50 border-b border-slate-200 px-4 py-2">
                    <IcDoc cls="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-600">
                      {t('appeal.pdfPreview', { ref: violation.refId })}
                    </span>
                  </div>
                  <iframe
                    src={`${pdfUrl}#toolbar=0`}
                    title={t('appeal.iframeTitle')}
                    className="w-full"
                    style={{ height: 520, border: 'none' }}
                  />
                </div>
              )}

              <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800 leading-relaxed">
                {t('appeal.submitNote')}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={download}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  <IcDown cls="h-4 w-4" />
                  {t('appeal.download')}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <IcRefresh cls="h-4 w-4" />
                  {t('appeal.new')}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLocalStatus(violation.code, 'appeal_pending');
                  onAppealSubmitted?.();
                }}
                className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 active:bg-amber-700"
              >
                {t('appeal.confirm')}
              </button>
            </div>
          )}

        </div>
      )}
    </section>
  );
}
