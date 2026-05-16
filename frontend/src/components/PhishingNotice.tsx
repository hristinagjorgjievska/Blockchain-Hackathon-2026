import type { ReactNode } from 'react';
import { useLang } from '../i18n/LangContext';
import { IconAlert, IconKey, IconLinkOff, IconLock, IconShield } from './Icons';

const POINTS: { key: string; icon: ReactNode }[] = [
  { key: 'phishing.p1', icon: <IconLinkOff className="h-4 w-4" /> },
  { key: 'phishing.p2', icon: <IconLock className="h-4 w-4" /> },
  { key: 'phishing.p3', icon: <IconKey className="h-4 w-4" /> },
  { key: 'phishing.p4', icon: <IconShield className="h-4 w-4" /> },
];

export function PhishingNotice() {
  const { t } = useLang();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-300/70 bg-gradient-to-br from-amber-50 to-orange-50/70 p-5 shadow-card sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber-300/30 blur-3xl"
      />
      <div className="relative">
        <div className="flex items-start gap-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-400/25 text-amber-700 ring-1 ring-amber-300">
            <IconAlert className="h-6 w-6" />
          </span>
          <div>
            <span className="inline-flex items-center rounded-full bg-amber-200/70 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-amber-800">
              {t('phishing.badge')}
            </span>
            <h2 className="mt-1 font-display text-lg font-bold text-amber-950">
              {t('phishing.title')}
            </h2>
          </div>
        </div>

        <p className="mt-3.5 text-sm leading-relaxed text-amber-900">{t('phishing.lead')}</p>

        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {POINTS.map((p) => (
            <li
              key={p.key}
              className="flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-white/70 p-3"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700">
                {p.icon}
              </span>
              <span className="text-sm leading-snug text-amber-900">{t(p.key)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
