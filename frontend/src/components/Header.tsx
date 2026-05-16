import { useEffect, useState } from 'react';
import { ConnectButton } from 'thirdweb/react';
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

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center rounded-lg bg-white/10 p-0.5 ring-1 ring-white/10">
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
                src="/mvr.png"
                alt=""
                className="h-full w-full object-cover"
                width={44}
                height={44}
              />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-bold tracking-tight text-white">
                SafeChain MK
              </span>
              <span className="block text-[10.5px] font-medium text-blue-200/80">
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
            <ConnectButton
              client={thirdwebClient}
              wallets={WALLETS}
              connectButton={{ label: t('header.login') }}
              connectModal={{
                size: 'compact',
                title: 'SafeChain MK',
                titleIcon: '/mvr.png',
              }}
              detailsButton={{ displayBalanceToken: undefined }}
              theme="dark"
            />
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
