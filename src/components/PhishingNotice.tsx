import { useLang } from '../i18n/LangContext';
import { IconAlert, IconLinkOff } from './Icons';

const POINTS = ['phishing.p1', 'phishing.p2', 'phishing.p3', 'phishing.p4'];

export function PhishingNotice() {
  const { t } = useLang();

  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-400/30 text-amber-700">
          <IconAlert className="h-5 w-5" />
        </span>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-amber-700">
            {t('phishing.badge')}
          </div>
          <h2 className="text-base font-bold text-amber-900">{t('phishing.title')}</h2>
        </div>
      </div>
      <p className="mt-3 text-sm text-amber-900">{t('phishing.lead')}</p>
      <ul className="mt-3 space-y-2">
        {POINTS.map((p) => (
          <li key={p} className="flex gap-2 text-sm text-amber-900">
            <IconLinkOff className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span>{t(p)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
