import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useLang } from '../i18n/LangContext';
import { LANGS, type Lang } from '../i18n/strings';
import { IconLock, IconShield } from './Icons';

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center rounded-lg bg-white/10 p-0.5 text-xs font-bold">
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`rounded-md px-2 py-1 uppercase transition ${
            lang === l ? 'bg-white text-navy' : 'text-blue-100 hover:text-white'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function Header({ onHome }: { onHome: () => void }) {
  const { lang, setLang, t } = useLang();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <button type="button" onClick={onHome} className="flex items-center gap-2.5 text-left">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600">
            <IconShield className="h-5 w-5 text-white" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight">Safe City MK</span>
            <span className="block text-[11px] text-blue-200">{t('header.tagline')}</span>
          </span>
        </button>

        <span className="ml-1 hidden items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-blue-100 sm:flex">
          <IconShield className="h-3.5 w-3.5" />
          {t('header.official')}
        </span>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs lg:flex">
            <IconLock className="h-3.5 w-3.5 text-emerald-300" />
            <span className="text-blue-100">{t('header.secureAddress')}</span>
            <span className="font-mono font-semibold text-white">safecity.gov.mk</span>
          </div>
          <LangToggle lang={lang} setLang={setLang} />
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
}
