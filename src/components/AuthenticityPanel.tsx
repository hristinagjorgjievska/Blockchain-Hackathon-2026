import { useState } from 'react';
import { useLang } from '../i18n/LangContext';
import { groupHex } from '../lib/hash';
import { shortId } from '../lib/format';
import { TREASURY_ADDRESS, explorerAddressUrl } from '../solana/config';
import { IconChain, IconCheck, IconCopy, IconExternal, IconFingerprint } from './Icons';

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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <IconFingerprint className="h-5 w-5 text-blue-700" />
        <h2 className="text-lg font-bold text-slate-900">{t('auth.title')}</h2>
      </div>
      <p className="mt-1 text-sm text-slate-500">{t('auth.lead')}</p>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('auth.fingerprint')} · SHA-256
          </span>
          <button
            type="button"
            onClick={copy}
            disabled={!fingerprint}
            className="flex items-center gap-1 text-xs font-medium text-blue-700 transition hover:underline disabled:opacity-50"
          >
            {copied ? <IconCheck className="h-3.5 w-3.5" /> : <IconCopy className="h-3.5 w-3.5" />}
            {copied ? t('common.copied') : t('common.copy')}
          </button>
        </div>
        <p className="mt-2 break-all font-mono text-xs leading-relaxed text-slate-700">
          {fingerprint ? groupHex(fingerprint, 8) : t('auth.computing')}
        </p>
        <p className="mt-2 text-xs text-slate-500">{t('auth.fingerprint.note')}</p>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('auth.network')}
          </div>
          <div className="mt-1 flex items-center gap-1.5 font-semibold text-slate-800">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: 'linear-gradient(135deg,#9945ff,#14f195)' }}
            />
            Solana Devnet
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('auth.treasury')}
          </div>
          <a
            href={explorerAddressUrl(treasury)}
            target="_blank"
            rel="noreferrer"
            className="mt-1 flex items-center gap-1 font-mono text-sm font-semibold text-blue-700 transition hover:underline"
          >
            {shortId(treasury, 6)}
            <IconExternal className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="mt-3 flex gap-2 rounded-xl bg-blue-50 p-3 text-sm text-blue-900">
        <IconChain className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
        <span>{t('auth.chainNote')}</span>
      </div>
    </section>
  );
}
