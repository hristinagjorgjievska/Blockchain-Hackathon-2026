import { useState } from 'react';
import { useLang } from '../i18n/LangContext';
import { groupHex } from '../lib/hash';
import { shortId } from '../lib/format';
import { TREASURY_ADDRESS, explorerAddressUrl } from '../solana/config';
import { IconChain, IconCheck, IconCopy, IconExternal, IconFingerprint } from './Icons';

const SHIMMER =
  'animate-shimmer rounded bg-gradient-to-r from-white/5 via-white/20 to-white/5 bg-[length:200%_100%]';

export function AuthenticityPanel({ fingerprint }: { fingerprint: string | null }) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const treasury = TREASURY_ADDRESS.toBase58();

  const copy = () => {
    if (!fingerprint) return;
    navigator.clipboard?.writeText(fingerprint);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100">
          <IconFingerprint className="h-5 w-5" />
        </span>
        <h2 className="font-display text-lg font-bold text-slate-900">{t('auth.title')}</h2>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{t('auth.lead')}</p>

      <div className="mt-4 overflow-hidden rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 p-4 ring-1 ring-navy-700">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-blue-200">
            <IconFingerprint className="h-3.5 w-3.5" />
            {t('auth.fingerprint')} · SHA-256
          </span>
          <button
            type="button"
            onClick={copy}
            disabled={!fingerprint}
            className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-blue-200 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-40"
          >
            {copied ? (
              <IconCheck className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <IconCopy className="h-3.5 w-3.5" />
            )}
            {copied ? t('common.copied') : t('common.copy')}
          </button>
        </div>
        {fingerprint ? (
          <p className="mt-2.5 break-all font-mono text-xs leading-relaxed text-cyan-100/90">
            {groupHex(fingerprint, 8)}
          </p>
        ) : (
          <div className="mt-3 space-y-1.5" aria-label={t('auth.computing')}>
            <div className={`h-3 w-full ${SHIMMER}`} />
            <div className={`h-3 w-3/4 ${SHIMMER}`} />
          </div>
        )}
        <p className="mt-3 text-[11px] leading-relaxed text-blue-300/75">
          {t('auth.fingerprint.note')}
        </p>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3.5">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {t('auth.network')}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 font-semibold text-slate-800">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: 'linear-gradient(135deg,#9945ff,#14f195)' }}
            />
            Solana Devnet
          </div>
        </div>
        <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3.5">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {t('auth.treasury')}
          </div>
          <a
            href={explorerAddressUrl(treasury)}
            target="_blank"
            rel="noreferrer"
            title={treasury}
            className="mt-1.5 inline-flex items-center gap-1 rounded font-mono text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            {shortId(treasury, 6)}
            <IconExternal className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="mt-3 flex gap-2.5 rounded-xl bg-blue-50 p-3.5 ring-1 ring-blue-100">
        <IconChain className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
        <span className="text-sm leading-relaxed text-blue-900">{t('auth.chainNote')}</span>
      </div>
    </section>
  );
}
