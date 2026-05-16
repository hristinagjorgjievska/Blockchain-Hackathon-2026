import { useCallback, useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n/LangContext';
import { EvidenceFrame } from './EvidenceFrame';
import { LocationMap } from './LocationMap';
import {
  IconArrowRight,
  IconCamera,
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconSearch,
} from './Icons';
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

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

  const openAt = (i: number) => {
    lastFocused.current = document.activeElement as HTMLElement | null;
    setActive(i);
  };
  const close = useCallback(() => {
    setActive(null);
    lastFocused.current?.focus();
  }, []);
  const step = useCallback((dir: number) => {
    setActive((cur) => (cur === null ? cur : (cur + dir + ITEMS.length) % ITEMS.length));
  }, []);

  useEffect(() => {
    if (active === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Tab') {
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>('button');
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close, step]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100">
            <IconCamera className="h-5 w-5" />
          </span>
          <h2 className="font-display text-lg font-bold text-slate-900">{t('evidence.title')}</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{t('evidence.subtitle')}</p>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
        {ITEMS.map((item, i) => (
          <button
            key={item.key}
            type="button"
            onClick={() => openAt(i)}
            className={`group block overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
              item.key === 'scene' ? 'sm:col-span-2' : ''
            }`}
          >
            <div className="relative bg-navy-950">
              {renderVisual(item.key)}
              <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-md bg-navy-950/80 px-2 py-1 text-xs font-medium text-white opacity-0 ring-1 ring-white/15 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                <IconSearch className="h-3.5 w-3.5" />
                {t('evidence.zoom')}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 px-3.5 py-2.5">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-800">{t(item.labelKey)}</div>
                <div className="mt-0.5 truncate text-xs text-slate-500">{meta(item.key)}</div>
              </div>
              <IconArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-blue-600" />
            </div>
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-50 flex animate-fadeIn flex-col bg-navy-950/90 p-4 backdrop-blur-sm sm:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={t('evidence.title')}
        >
          <div
            className="flex items-center justify-between gap-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <div className="font-display font-semibold">{t(ITEMS[active].labelKey)}</div>
              <div className="truncate text-xs text-white/55">{meta(ITEMS[active].key)}</div>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
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
              className="shrink-0 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              aria-label={t('evidence.prev')}
            >
              <IconChevronLeft className="h-6 w-6" />
            </button>
            <div
              key={ITEMS[active].key}
              className="w-full max-w-4xl animate-scaleIn overflow-hidden rounded-xl shadow-float ring-1 ring-white/10"
            >
              {renderVisual(ITEMS[active].key)}
            </div>
            <button
              type="button"
              onClick={() => step(1)}
              className="shrink-0 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              aria-label={t('evidence.next')}
            >
              <IconChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div
            className="flex items-center justify-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {ITEMS.map((it, i) => (
              <button
                key={it.key}
                type="button"
                onClick={() => setActive(i)}
                aria-label={t(it.labelKey)}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
                  i === active ? 'w-6 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
