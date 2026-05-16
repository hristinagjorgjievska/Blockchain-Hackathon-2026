import { useState } from 'react';
import { useLang } from '../i18n/LangContext';
import { groupHex } from '../lib/hash';
import { shortId } from '../lib/format';
import { explorerAddressUrl, TREASURY_ADDRESS } from '../solana/config';
import { type Violation } from '../data/violations';
import { type PaymentRecord } from '../lib/paymentStore';
import { resolveNftStatus, type NftStatus } from '../lib/resolveNftStatus';
import { IconCheck, IconCopy, IconExternal } from './Icons';

export type { NftStatus };

function SolanaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 397.7 311.7" className={className} aria-hidden>
      <defs>
        <linearGradient id="sol-rec" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9945ff" />
          <stop offset="100%" stopColor="#14f195" />
        </linearGradient>
      </defs>
      <path fill="url(#sol-rec)" d="M64.6 237.9a11 11 0 0 1 7.7-3.2h317.4c4.9 0 7.3 5.9 3.9 9.4l-62.7 62.7a11 11 0 0 1-7.7 3.2H5.8c-4.9 0-7.3-5.9-3.9-9.4l62.7-62.7z" />
      <path fill="url(#sol-rec)" d="M64.6 3.2A11.2 11.2 0 0 1 72.3 0h317.4c4.9 0 7.3 5.9 3.9 9.4L330.9 72a11 11 0 0 1-7.7 3.2H5.8C.9 75.2-1.5 69.3 1.9 65.8L64.6 3.2z" />
      <path fill="url(#sol-rec)" d="M333.1 120.1a11 11 0 0 0-7.7-3.2H7.9c-4.9 0-7.3 5.9-3.9 9.4l62.7 62.7a11 11 0 0 0 7.7 3.2h317.5c4.9 0 7.3-5.9 3.9-9.4l-62.7-62.7z" />
    </svg>
  );
}

const STATUS_CFG: Record<NftStatus, { bg: string; text: string; dot: string }> = {
  unpaid:         { bg: 'bg-red-500/15',     text: 'text-red-300',     dot: 'bg-red-400'     },
  paid:           { bg: 'bg-emerald-500/15', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  voided:         { bg: 'bg-slate-500/15',   text: 'text-slate-300',   dot: 'bg-slate-400'   },
  appeal_pending: { bg: 'bg-amber-500/15',   text: 'text-amber-300',   dot: 'bg-amber-400'   },
};

interface Props {
  violation: Violation;
  fingerprint: string | null;
  paid: PaymentRecord | null;
  localAppealPending?: boolean;
}

export function NftRecord({ violation, fingerprint, paid, localAppealPending }: Props) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  const nftStatus = resolveNftStatus(violation, paid, localAppealPending);
  const c = STATUS_CFG[nftStatus];
  const treasury = TREASURY_ADDRESS.toBase58();

  const SHIMMER = 'animate-shimmer rounded bg-gradient-to-r from-white/5 via-white/15 to-white/5 bg-[length:200%_100%]';

  const copy = () => {
    if (!fingerprint) return;
    navigator.clipboard?.writeText(fingerprint);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="overflow-hidden rounded-2xl ring-1 ring-violet-900/30">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-br from-[#1a0533] via-[#1e1060] to-[#0c1a3d] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-violet-500/20 ring-1 ring-violet-500/30">
            <SolanaLogo className="h-3.5 w-3.5" />
          </span>
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-widest text-violet-300/80">
            {t('nft.label')} · {violation.refId}
          </span>
        </div>
        <span className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ring-1 ${c.bg} ${c.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
          {t(`nft.status.${nftStatus}`)}
        </span>
      </div>

      {/* Fingerprint */}
      <div className="bg-[#0f0a24] px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-400/60">
            {t('nft.fingerprint')} · SHA-256
          </span>
          <button
            type="button"
            onClick={copy}
            disabled={!fingerprint}
            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium text-violet-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400 disabled:opacity-40"
          >
            {copied ? <IconCheck className="h-3 w-3 text-emerald-400" /> : <IconCopy className="h-3 w-3" />}
            {copied ? t('common.copied') : t('common.copy')}
          </button>
        </div>
        {fingerprint ? (
          <p className="mt-1.5 break-all font-mono text-[11px] leading-relaxed text-cyan-200/80">
            {groupHex(fingerprint, 8)}
          </p>
        ) : (
          <div className="mt-2 space-y-1.5" aria-label={t('auth.computing')}>
            <div className={`h-2 w-full ${SHIMMER}`} />
            <div className={`h-2 w-2/3 ${SHIMMER}`} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/5 bg-[#0f0a24] px-4 py-2.5">
        <a
          href={explorerAddressUrl(treasury)}
          target="_blank"
          rel="noreferrer"
          title={treasury}
          className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-violet-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
        >
          {shortId(treasury, 6)}
          <IconExternal className="h-3 w-3" />
        </a>
        <span className="text-[10px] font-semibold text-violet-400/40">Solana Devnet</span>
      </div>
    </section>
  );
}
