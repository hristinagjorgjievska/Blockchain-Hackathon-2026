import { useEffect, useRef, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useLang } from '../i18n/LangContext';
import { VIOLATIONS, amountDueNowMKD, type Violation, type ViolationKind } from '../data/violations';
import { listNftViolations } from '../lib/api';
import { getPayment } from '../lib/paymentStore';
import { resolveNftStatus, type NftStatus } from '../lib/resolveNftStatus';
import { formatMKD, formatDateTime, shortId } from '../lib/format';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCalendar,
  IconCar,
  IconChain,
  IconGauge,
  IconPin,
} from './Icons';

function SolanaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 397.7 311.7" className={className} aria-hidden>
      <defs>
        <linearGradient id="sol-car" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9945ff" />
          <stop offset="100%" stopColor="#14f195" />
        </linearGradient>
      </defs>
      <path fill="url(#sol-car)" d="M64.6 237.9a11 11 0 0 1 7.7-3.2h317.4c4.9 0 7.3 5.9 3.9 9.4l-62.7 62.7a11 11 0 0 1-7.7 3.2H5.8c-4.9 0-7.3-5.9-3.9-9.4l62.7-62.7z" />
      <path fill="url(#sol-car)" d="M64.6 3.2A11.2 11.2 0 0 1 72.3 0h317.4c4.9 0 7.3 5.9 3.9 9.4L330.9 72a11 11 0 0 1-7.7 3.2H5.8C.9 75.2-1.5 69.3 1.9 65.8L64.6 3.2z" />
      <path fill="url(#sol-car)" d="M333.1 120.1a11 11 0 0 0-7.7-3.2H7.9c-4.9 0-7.3 5.9-3.9 9.4l62.7 62.7a11 11 0 0 0 7.7 3.2h317.5c4.9 0 7.3-5.9 3.9-9.4l-62.7-62.7z" />
    </svg>
  );
}

function FakeQr({ seed }: { seed: string }) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 33 + seed.charCodeAt(i)) >>> 0;
  const cells: JSX.Element[] = [];
  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 15; x++) {
      const finder = (x < 4 && y < 4) || (x > 10 && y < 4) || (x < 4 && y > 10);
      if (finder) continue;
      if (((hash + x * 19 + y * 23 + x * y) % 9) < 4)
        cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />);
    }
  }
  const marker = (x: number, y: number) => (
    <g key={`m-${x}-${y}`}>
      <rect x={x} y={y} width={4} height={4} fill="currentColor" />
      <rect x={x + 1} y={y + 1} width={2} height={2} fill="white" />
    </g>
  );
  return (
    <svg viewBox="0 0 15 15" className="h-full w-full" aria-hidden shapeRendering="crispEdges">
      <rect width={15} height={15} fill="white" />
      {marker(0, 0)}{marker(11, 0)}{marker(0, 11)}
      {cells}
    </svg>
  );
}

const KIND_ACCENT: Record<ViolationKind, string> = {
  speeding:             'from-orange-500 via-red-500 to-orange-400',
  red_light:            'from-red-600 via-rose-500 to-red-400',
  expired_registration: 'from-blue-600 via-indigo-500 to-blue-400',
  no_parking:           'from-yellow-400 via-amber-500 to-yellow-300',
};

const KIND_ICON: Record<ViolationKind, JSX.Element> = {
  speeding:             <IconGauge className="h-5 w-5" />,
  red_light:            <IconArrowRight className="h-5 w-5" />,
  expired_registration: <IconCar className="h-5 w-5" />,
  no_parking:           <IconPin className="h-5 w-5" />,
};

const KIND_ICON_BG: Record<ViolationKind, string> = {
  speeding:             'bg-orange-500/20 text-orange-400 ring-orange-500/20',
  red_light:            'bg-red-500/20 text-red-400 ring-red-500/20',
  expired_registration: 'bg-blue-500/20 text-blue-400 ring-blue-500/20',
  no_parking:           'bg-yellow-500/20 text-yellow-400 ring-yellow-500/20',
};

const STATUS_CFG: Record<NftStatus, { bg: string; text: string; dot: string; label: string; amount: string }> = {
  unpaid:         { bg: 'bg-red-500/15',     text: 'text-red-400',     dot: 'bg-red-500',     label: 'ring-red-500/20',     amount: 'text-white'                      },
  paid:           { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-500', label: 'ring-emerald-500/20', amount: 'text-emerald-400'                 },
  voided:         { bg: 'bg-slate-500/15',   text: 'text-slate-400',   dot: 'bg-slate-500',   label: 'ring-slate-500/20',   amount: 'text-slate-500 line-through'      },
  appeal_pending: { bg: 'bg-amber-500/15',   text: 'text-amber-400',   dot: 'bg-amber-500',   label: 'ring-amber-500/20',   amount: 'text-amber-300'                  },
};

function NftCard({
  violation,
  index,
  onClick,
}: {
  violation: Violation;
  index: number;
  onClick: () => void;
}) {
  const { t, lang } = useLang();
  const paid = getPayment(violation.code);
  const status = resolveNftStatus(violation, paid);
  const s = STATUS_CFG[status];
  const k = KIND_ICON_BG[violation.kind];
  const amount = amountDueNowMKD(violation);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-[272px] shrink-0 flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-800 text-left ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-1.5 hover:ring-white/20 hover:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:w-[292px]"
    >
      {/* Per-kind color accent bar */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${KIND_ACCENT[violation.kind]}`} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-0">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded-md bg-white/10 ring-1 ring-white/10">
            <SolanaLogo className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">SafeChain MK</span>
        </div>
        <span className="font-mono text-[10px] text-white/25">#{String(index + 1).padStart(3, '0')}</span>
      </div>

      {/* Status block */}
      <div className={`mx-4 mt-3 rounded-xl px-3 py-2.5 ring-1 ${s.bg} ${s.label}`}>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 shrink-0 rounded-full ${s.dot} ${status === 'unpaid' ? 'animate-pulse' : ''}`} />
          <span className={`font-display text-xl font-extrabold uppercase tracking-tight leading-none ${s.text}`}>
            {t(`nft.status.${status}`)}
          </span>
        </div>
        <div className="mt-1 font-mono text-[9.5px] text-white/30">{violation.refId}</div>
      </div>

      {/* Violation type + date */}
      <div className="mt-3.5 flex items-center gap-3 px-4">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ${k}`}>
          {KIND_ICON[violation.kind]}
        </span>
        <div className="min-w-0">
          <div className="text-sm font-bold text-white leading-tight truncate">
            {t(`kind.${violation.kind}`)}
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-white/45">
            <IconCalendar className="h-3 w-3 shrink-0" />
            {formatDateTime(violation.dateTime, lang)}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="mt-2 flex items-center gap-1.5 px-4 text-[11px] text-white/40">
        <IconPin className="h-3 w-3 shrink-0" />
        <span className="truncate">{violation.street[lang]}, {violation.city[lang]}</span>
      </div>

      {/* Divider */}
      <div className="mx-4 mt-4 h-px bg-white/8" />

      {/* Amount + QR + CTA */}
      <div className="flex items-end justify-between gap-2 px-4 py-4">
        <div className="min-w-0">
          <div className="text-[9px] font-bold uppercase tracking-widest text-white/35">
            {status === 'paid' ? t('carousel.paid') : t('carousel.amountDue')}
          </div>
          <div className={`mt-0.5 text-lg font-extrabold leading-tight ${s.amount}`}>
            {status === 'paid' ? '✓ ' : ''}{formatMKD(status === 'paid' ? (paid?.amountMKD ?? amount) : amount, lang)}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-white p-1">
            <FakeQr seed={`${violation.refId}-${violation.code}`} />
          </div>
          <span className="flex items-center gap-1 rounded-xl bg-white/10 px-2.5 py-2 text-[11px] font-semibold text-white/80 ring-1 ring-white/10 transition group-hover:bg-white/15 group-hover:text-white">
            {t('carousel.view')}
            <IconArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>

      {/* Solana chain strip */}
      <div className="flex items-center justify-between border-t border-white/[0.06] bg-black/25 px-4 py-2">
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/25">Solana Devnet</span>
        <span className="font-mono text-[9px] text-white/20">{shortId(violation.code.replace('SC-', ''), 8)}…</span>
      </div>
    </button>
  );
}

interface Props {
  onOpen: (violation: Violation) => void;
}

export function NftCarousel({ onOpen }: Props) {
  const { t } = useLang();
  const account = useActiveAccount();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [violations, setViolations] = useState<Violation[]>(VIOLATIONS);
  const address = account?.address ?? '';
  const ownerName = 'Андреј Стојаноски';
  const licensePlate = 'SK 501 TB';

  useEffect(() => {
    if (!address) return;
    let active = true;
    listNftViolations().then((records) => {
      if (active && records.length > 0) setViolations(records);
    });
    return () => {
      active = false;
    };
  }, [address]);

  if (!address) return null;

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 310 : -310, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#060d1a] via-[#080f20] to-[#050c18] py-10">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-0 h-72 w-[500px] rounded-full bg-violet-700/8 blur-3xl" />
        <div className="absolute right-1/3 bottom-0 h-56 w-[400px] rounded-full bg-blue-600/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/6 ring-1 ring-white/12">
                <IconChain className="h-4 w-4 text-white/70" />
              </span>
              <h2 className="font-display text-lg font-bold text-white/90">
                {t('carousel.title')}
              </h2>
            </div>
            <p className="mt-1 text-[12px] text-white/40">
              {t('carousel.subtitle', { count: String(violations.length) })}
              {' · '}
              <span className="font-mono text-white/55">{shortId(address, 6)}</span>
              {' · '}
              <span className="font-semibold text-white/55">
                {t('carousel.ownerName')} {ownerName}
              </span>
              {' · '}
              <span className="font-semibold text-white/55">
                {t('carousel.licensePlates')} {licensePlate}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label={t('carousel.prev')}
              className="grid h-9 w-9 place-items-center rounded-xl bg-white/6 text-white/60 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <IconArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label={t('carousel.next')}
              className="grid h-9 w-9 place-items-center rounded-xl bg-white/6 text-white/60 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <IconArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="mt-5 flex gap-4 overflow-x-auto pb-4 [scroll-snap-type:x_mandatory] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {violations.map((v, i) => (
            <div key={v.code} className="[scroll-snap-align:start]">
              <NftCard violation={v} index={i} onClick={() => onOpen(v)} />
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-center gap-1.5">
          {violations.map((v) => (
            <span key={v.code} className="h-0.5 w-5 rounded-full bg-white/15" />
          ))}
        </div>
      </div>
    </section>
  );
}
