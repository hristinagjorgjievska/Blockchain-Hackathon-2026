import { useLang } from '../i18n/LangContext';
import { IconBuilding, IconLock, IconShield } from './Icons';

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="relative mt-20 overflow-hidden bg-navy-900 text-blue-100">
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 left-1/2 h-56 w-[40rem] -translate-x-1/2 rounded-full bg-blue-600/12 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 ring-1 ring-white/20">
              <IconShield className="h-5 w-5 text-white" />
            </span>
            <span className="font-display text-base font-bold tracking-tight text-white">
              Safe City MK
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-blue-200/80">{t('footer.about.body')}</p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-blue-100">
            <IconBuilding className="h-3.5 w-3.5 text-blue-300" />
            {t('header.official')}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 font-display text-sm font-semibold text-white">
            <IconLock className="h-4 w-4 text-emerald-300" />
            {t('footer.security.title')}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-blue-200/80">
            {t('footer.security.body')}
          </p>
        </div>

        <div>
          <div className="font-display text-sm font-semibold text-white">
            {t('footer.poweredBy')}
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2">
            <span
              aria-hidden
              className="h-3.5 w-3.5 rounded-full"
              style={{ background: 'linear-gradient(135deg,#9945ff,#14f195)' }}
            />
            <span className="font-semibold text-white">Solana</span>
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-100">
              Devnet
            </span>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs leading-relaxed text-blue-300/70">
          {t('footer.disclaimer')}
        </p>
      </div>
    </footer>
  );
}
