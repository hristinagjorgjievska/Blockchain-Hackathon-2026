import { useCallback, useEffect, useState } from 'react';
import { useLang } from '../i18n/LangContext';
import { EvidenceFrame } from './EvidenceFrame';
import { LocationMap } from './LocationMap';
import { IconCamera, IconChevronLeft, IconChevronRight, IconClose, IconSearch } from './Icons';
import { formatDateTime } from '../lib/format';
import type { Violation } from '../data/violations';

type EvidenceKey = 'scene' | 'plate' | 'map';

const ITEMS: { key: EvidenceKey; labelKey: string }[] = [
  { key: 'scene', labelKey: 'evidence.tab.scene' },
  { key: 'plate', labelKey: 'evidence.tab.plate' },
  { key: 'map', labelKey: 'evidence.tab.map' },
];

export function EvidenceGallery({ violation }: { violation: Violation }) {
  const { t, lang } = useLang();
  const [active, setActive] = useState<number | null>(null);

  const renderVisual = (key: EvidenceKey) =>
    key === 'map' ? (
      <LocationMap violation={violation} />
    ) : (
      <EvidenceFrame violation={violation} variant={key} />
    );

  const meta = (key: EvidenceKey) =>
    key === 'map'
      ? `${violation.coordinates.lat.toFixed(5)}, ${violation.coordinates.lng.toFixed(5)}`
      : `${t('evidence.camera')} ${violation.cameraId} · ${t('evidence.captured')} ${formatDateTime(
          violation.dateTime,
          lang,
        )}`;

  const close = useCallback(() => setActive(null), []);
  const step = useCallback((dir: number) => {
    setActive((cur) => (cur === null ? cur : (cur + dir + ITEMS.length) % ITEMS.length));
  }, []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close, step]);

  return (
    <section>
      <div className="flex items-center gap-2">
        <IconCamera className="h-5 w-5 text-blue-700" />
        <h2 className="text-lg font-bold text-slate-900">{t('evidence.title')}</h2>
      </div>
      <p className="mt-1 text-sm text-slate-500">{t('evidence.subtitle')}</p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ITEMS.map((item, i) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setActive(i)}
            className={`group overflow-hidden rounded-xl border border-slate-200 bg-white text-left transition hover:border-blue-300 hover:shadow-md ${
              item.key === 'scene' ? 'sm:col-span-2' : ''
            }`}
          >
            <div className="relative bg-slate-900">
              {renderVisual(item.key)}
              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                <IconSearch className="h-3.5 w-3.5" />
                {t('evidence.zoom')}
              </span>
            </div>
            <div className="px-3 py-2.5">
              <div className="text-sm font-semibold text-slate-800">{t(item.labelKey)}</div>
              <div className="mt-0.5 text-xs text-slate-500">{meta(item.key)}</div>
            </div>
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/85 p-4 sm:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between text-white">
            <div>
              <div className="font-semibold">{t(ITEMS[active].labelKey)}</div>
              <div className="text-xs text-white/60">{meta(ITEMS[active].key)}</div>
            </div>
            <button
              type="button"
              onClick={close}
              className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label={t('evidence.close')}
            >
              <IconClose className="h-6 w-6" />
            </button>
          </div>
          <div
            className="flex flex-1 items-center justify-center gap-2 py-4 sm:gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => step(-1)}
              className="shrink-0 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              aria-label="previous"
            >
              <IconChevronLeft className="h-6 w-6" />
            </button>
            <div className="w-full max-w-4xl overflow-hidden rounded-xl">
              {renderVisual(ITEMS[active].key)}
            </div>
            <button
              type="button"
              onClick={() => step(1)}
              className="shrink-0 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              aria-label="next"
            >
              <IconChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
