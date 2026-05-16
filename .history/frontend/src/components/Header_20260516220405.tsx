import { useEffect, useRef, useState } from 'react';
import { ConnectButton, useActiveAccount } from 'thirdweb/react';
import { inAppWallet, createWallet } from 'thirdweb/wallets';
import { thirdwebClient } from '../thirdweb/client';
import { useLang } from '../i18n/LangContext';
import { LANG_LABELS, LANGS, type Lang } from '../i18n/strings';
import { IconBuilding, IconLock } from './Icons';

const WALLETS = [
  inAppWallet({
    auth: { options: ['email', 'google', 'apple', 'phone'] },
  }),
  createWallet('io.magiceden.wallet'),
];

/** Desktop: horizontal button group.  Mobile: native dropdown. */
function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <>
      {/* Desktop: horizontal pill */}
      <div className="hidden sm:flex items-center rounded-lg bg-white/10 p-0.5 ring-1 ring-white/10">
        {LANGS.map((l) => {
          const active = lang === l;
          return (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={active}
              className={`rounded-md px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
                active ? 'bg-white text-navy-900 shadow-sm' : 'text-blue-200 hover:text-white'
              }`}
            >
              {LANG_LABELS[l]}
            </button>
          );
        })}
      </div>

      {/* Mobile: dropdown */}
      <div ref={ref} className="relative sm:hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white ring-1 ring-white/10 transition-colors"
        >
          {LANG_LABELS[lang]}
          <svg className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[7rem] overflow-hidden rounded-lg border border-white/15 bg-navy-800 shadow-xl ring-1 ring-black/20">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => { setLang(l); setOpen(false); }}
                className={`block w-full px-3.5 py-2 text-left text-xs font-bold uppercase tracking-wide transition-colors ${
                  lang === l
                    ? 'bg-white/15 text-white'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function SolanaConnectButton({ label }: { label: string }) {
  const account = useActiveAccount();

  return (
    <ConnectButton
      client={thirdwebClient}
      wallets={WALLETS}
      connectButton={{ label }}
      connectModal={{
        size: 'compact',
        title: 'SafeChain MK',
        titleIcon: '/logo.png',
      }}
      detailsButton={
        account
          ? {
              render: () => (
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                >
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full"
                    style={{ background: 'linear-gradient(135deg,#9945ff,#14f195)' }}
                  />
                  <span className="font-mono text-xs">
                    {account.address.slice(0, 6)}…{account.address.slice(-4)}
                  </span>
                  <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    SOL
                  </span>
                </button>
              ),
            }
          : { displayBalanceToken: undefined }
      }
      theme="dark"
    />
  );
}

export function Header({ onHome }: { onHome: () => void }) {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_12px_34px_-14px_rgba(5,13,28,0.85)]' : ''
      }`}
    >
      <div className="border-b border-white/10 bg-navy-900">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={onHome}
            aria-label="SafeChain MK — почетна"
            className="group flex items-center gap-2.5 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
          >
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-lg shadow-[0_6px_16px_-4px_rgba(0,0,0,0.45)] ring-1 ring-white/25 transition-transform duration-150 group-hover:scale-[1.04]">
              <img
                src="/logo.png"
                alt=""
                className="h-full w-full object-cover"
                width={44}
                height={44}
              />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[13px] font-bold tracking-tight text-white sm:text-[15px]">
                SafeChain<span className="hidden sm:inline"> MK</span>
              </span>
              <span className="hidden text-[10.5px] font-medium text-blue-200/80 sm:block">
                {t('header.tagline')}
              </span>
            </span>
          </button>

          <span className="ml-1 hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold text-blue-100 sm:flex">
            <IconBuilding className="h-3.5 w-3.5 text-blue-300" />
            {t('header.official')}
          </span>

          <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
            <div className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-xs lg:flex">
              <IconLock className="h-3.5 w-3.5 text-emerald-300" />
              <span className="text-blue-200/90">{t('header.secureAddress')}</span>
              <span className="font-mono text-[12px] font-semibold text-white">safecity.gov.mk</span>
            </div>
            <LangToggle lang={lang} setLang={setLang} />
            <SolanaConnectButton label={t('header.login')} />
          </div>
        </div>
        <div
          aria-hidden
          className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/55 to-transparent"
        />
      </div>
    </header>
  );
}
