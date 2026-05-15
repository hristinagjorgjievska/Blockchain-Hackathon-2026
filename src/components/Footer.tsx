import { useLang } from '../i18n/LangContext';
import { IconLock, IconShield } from './Icons';

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="mt-16 bg-navy text-blue-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-white">
            <IconShield className="h-5 w-5" />
            <span className="font-extrabold">Safe City MK</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-blue-200">{t('footer.about.body')}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 font-semibold text-white">
            <IconLock className="h-4 w-4 text-emerald-300" />
            {t('footer.security.title')}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-blue-200">{t('footer.security.body')}</p>
        </div>
        <div>
          <div className="font-semibold text-white">{t('footer.poweredBy')}</div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: 'linear-gradient(135deg,#9945ff,#14f195)' }}
            />
            <span className="font-semibold text-white">Solana</span>
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
              Devnet
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-blue-300">{t('footer.disclaimer')}</p>
      </div>
    </footer>
  );
}
