
 // * Dependency: npm install pdf-lib
 

import { useRef, useState } from 'react';

type Violation = {
  kind: string;
  dateTime: string;
  speedRecorded?: number;
  speedLimit?: number;
  refId: string;
  street: { mk: string };
  city: { mk: string };
  cameraId: string;
  plate: string;
  code: string;
  vehicleMake: string;
  amountDueMKD: number;
  dueDate: string;
};

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
  speeding:   'пречекорување на дозволена брзина',
  red_light:  'поминување на црвено светло',
  bus_lane:   'возење во лента за автобуси',
  no_parking: 'непрописно паркирање',
};

const GROUNDS = [
  { value: 'yellow_light',   label: 'Светлото беше жолто при поминување' },
  { value: 'sign_invisible', label: 'Сообраќајниот знак не беше видлив' },
  { value: 'emergency',      label: 'Итна ситуација / виша сила' },
  { value: 'wrong_vehicle',  label: 'Возилото не е мое / е продадено' },
  { value: 'device_error',   label: 'Грешка на мерниот уред или камерата' },
  { value: 'other',          label: 'Друга причина' },
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
  let page = doc.addPage([595.28, 841.89]); // A4 size in points
  
  const PW = 595.28;
  const ML = 70.87;
  const MR = 40;
  const TW = PW - ML - MR;
  
  const NAVY = rgb(13/255, 51/255, 99/255);
  const LGRAY = rgb(140/255, 140/255, 140/255);
  const BLACK = rgb(30/255, 30/255, 30/255);
  const WHITE = rgb(1, 1, 1);
  
  let y = 800;
  
  const fontData = await fetch('/fonts/NotoSans.ttf').then(r => r.arrayBuffer());
  const font = await doc.embedFont(new Uint8Array(fontData));
  
  page.drawRectangle({
    x: 0,
    y: y - 40,
    width: PW,
    height: 40,
    color: NAVY,
  });
  
  page.drawText('МИНИСТЕРСТВО ЗА ВНАТРЕШНИ РАБОТИ  |  SafeChain', {
    x: PW / 2 - 150,
    y: y - 32,
    size: 10,
    color: WHITE,
    font,
  });
  
  y -= 60;
  
  page.drawText('ПРИГОВОР', {
    x: PW / 2 - 60,
    y: y,
    size: 24,
    color: NAVY,
    font,
  });
  
  y -= 15;
  
  page.drawText(`Референтен број: ${v.refId}`, {
    x: PW / 2 - 80,
    y: y,
    size: 10,
    color: LGRAY,
    font,
  });
  
  y -= 15;
  
  page.drawLine({
    start: { x: ML, y: y },
    end: { x: PW - MR, y: y },
    thickness: 1,
    color: NAVY,
  });
  
  y -= 15;
  
  const rows: [string, string][] = [
    ['Код:', v.code],
    ['Датум и час:', new Date(v.dateTime).toLocaleString('mk-MK')],
    ['Локација:', `${v.street.mk}, ${v.city.mk}`],
    ['Возило:', `${v.vehicleMake}  |  ${v.plate}`],
    ['Камера:', v.cameraId],
    ...(v.speedRecorded
      ? [['Брзина:', `${v.speedRecorded} km/h  (ограничување: ${v.speedLimit} km/h)`] as [string, string]]
      : []),
    ['Казна:', `${v.amountDueMKD.toLocaleString('mk-MK')} МКД`],
    ['Рок:', new Date(v.dueDate).toLocaleDateString('mk-MK')],
  ];
  
  for (const [label, val] of rows) {
    page.drawText(label, {
      x: ML,
      y: y,
      size: 10,
      color: BLACK,
      font,
    });
    
    page.drawText(val, {
      x: ML + 140,
      y: y,
      size: 10,
      color: BLACK,
      font,
    });
    
    y -= 18;
  }
  
  y -= 12;
  
  page.drawLine({
    start: { x: ML, y: y },
    end: { x: PW - MR, y: y },
    thickness: 0.5,
    color: rgb(210/255, 210/255, 210/255),
  });
  
  y -= 20;
 
  const paragraphs = appealText.split('\n').map(p => p.trim()).filter(Boolean);
  
  for (const para of paragraphs) {
    if (y < 80) {
      page = doc.addPage([595.28, 841.89]);
      y = 800;
    }
    
    const wrappedPara = wrapText(para, 60);
    
    for (const line of wrappedPara) {
      if (y < 80) {
        page = doc.addPage([595.28, 841.89]);
        y = 800;
      }
      
      page.drawText(line, {
        x: ML,
        y: y,
        size: 10,
        color: BLACK,
        font,
      });
      
      y -= 15;
    }
    
    y -= 5;
  }
  
  y -= 25;
  if (y < 80) {
    page = doc.addPage([595.28, 841.89]);
    y = 800;
  }
  
  page.drawLine({
    start: { x: ML, y: y },
    end: { x: ML + 150, y: y },
    thickness: 0.5,
    color: LGRAY,
  });
  
  page.drawLine({
    start: { x: PW - MR - 150, y: y },
    end: { x: PW - MR, y: y },
    thickness: 0.5,
    color: LGRAY,
  });
  
  y -= 15;
  
  page.drawText('Потпис на подносителот', {
    x: ML,
    y: y,
    size: 8,
    color: LGRAY,
    font,
  });
  
  page.drawText('Службено лице / Печат', {
    x: PW - MR - 150,
    y: y,
    size: 8,
    color: LGRAY,
    font,
  });
  
  page.drawText(
    `Документот е генериран на ${new Date().toLocaleDateString('mk-MK')} преку SafeChain платформата на МВР.`,
    {
      x: ML,
      y: 30,
      size: 8,
      color: LGRAY,
      font,
    }
  );

  const imagesToAdd = images.slice(0, 5);
  
  if (imagesToAdd.length > 0) {
    page = doc.addPage([595.28, 841.89]);
    y = 800;
    
    page.drawText('ДОДАТОЦИ - ДОКАЗИ', {
      x: PW / 2 - 80,
      y: y,
      size: 18,
      color: NAVY,
      font,
    });
    
    y -= 35;
    
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
        const maxW = 420;
        const maxH = 220;
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
        
        if (y - h < 80) {
          page = doc.addPage([595.28, 841.89]);
          y = 800;
        }
        
        page.drawImage(image, {
          x: ML + (TW - w) / 2,
          y: y - h,
          width: w,
          height: h,
        });
        
        page.drawText(`Доказ ${i + 1}`, {
          x: ML,
          y: y - h - 20,
          size: 8,
          color: LGRAY,
          font,
        });
        
        y -= h + 40;
      } catch {
      }
    }
  }
  
  const pdfBytes = await doc.save({ useObjectStreams: false });
  return new Blob([pdfBytes.slice(0)], { type: 'application/pdf' });
}

type Step = 'form' | 'result';

export function AppealGenerator({ violation }: { violation: Violation }) {
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
      console.error('Грешка при генерирање PDF:', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Грешка при генерирање на документот.\n\n${msg}\n\nОбидете се повторно или освежете ја страницата.`);
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
          <h2 className="font-bold text-slate-900">Поднеси приговор</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Генерирај формален приговор + PDF документ за преземање.
          </p>
        </div>
        <IcChev cls="h-5 w-5 shrink-0 text-slate-400" open={open} />
      </button>

      {open && (
        <div className="border-t border-slate-200 p-5 sm:p-6 space-y-5">

          {step === 'form' && (
            <>
              <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
                <span className="font-semibold">Напомена:</span> Документот е нацрт.
                Прочитајте го, потпишете го и поднесете до МВР.
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Основа за приговор
                </label>
                <select
                  value={ground}
                  onChange={(e) => setGround(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">— Изберете причина —</option>
                  {GROUNDS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Ваше образложение
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder='Пр: „Светлото беше жолто кога почнав да поминувам — беше невозможно безбедно да запрам."'
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                />
                <p className="mt-1 text-xs text-slate-400">
                  {description.trim().length} карактери (мин. 10)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Додади докази (слики) - опционално
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
                    Кликни за да поставиш слики со докази
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    JPG, PNG · макс. 5 слики за брза генерација
                  </p>
                </button>
                
                {images.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200">
                        <img src={img} alt={`Доказ ${idx + 1}`} className="w-full h-24 object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded text-white hover:bg-red-600 transition"
                        >
                          <IcX cls="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-1.5 py-1 text-center">
                          Доказ {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {images.length > 0 && (
                  <p className="mt-2 text-xs text-slate-500">
                    {images.length} слика(и) прилошена(и)
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={generate}
                disabled={!canSubmit || loading}
                className="w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 active:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Генерирање…' : 'Генерирај приговор →'}
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
                  PDF документот е готов за преземање
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowText((s) => !s)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 bg-slate-50 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  <IcEye cls="h-4 w-4 text-slate-500" />
                  {showText ? 'Скриј текст' : 'Прегледај текст на приговорот'}
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
                      PDF Преглед — {violation.refId}
                    </span>
                  </div>
                  <iframe
                    src={`${pdfUrl}#toolbar=0`}
                    title="Преглед на приговор"
                    className="w-full"
                    style={{ height: 520, border: 'none' }}
                  />
                </div>
              )}

              <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800 leading-relaxed">
                Отпечатете го документот, потпишете го и поднесете го до најблиската
                станица на МВР или преку <span className="font-semibold">е-Управа</span>.
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={download}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  <IcDown cls="h-4 w-4" />
                  Преземи PDF
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <IcRefresh cls="h-4 w-4" />
                  Нов приговор
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </section>
  );
}
