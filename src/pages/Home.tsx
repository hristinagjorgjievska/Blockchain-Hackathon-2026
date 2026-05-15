import { useState, type ReactNode } from 'react';
import { useLang } from '../i18n/LangContext';
import { CodeInput } from '../components/CodeInput';
import { PhishingNotice } from '../components/PhishingNotice';
import { findViolation, isValidCodeFormat } from '../data/violations';
import {
  IconAlert,
  IconBolt,
  IconCamera,
  IconChain,
  IconCheck,
  IconLinkOff,
  IconLock,
  IconPhone,
} from '../components/Icons';

const TRUST = [
  { icon: <IconLinkOff className="h-4 w-4" />, key: 'home.trust.noLinks' },
  { icon: <IconCamera className="h-4 w-4" />, key: 'home.trust.evidence' },
  { icon: <IconChain className="h-4 w-4" />, key: 'home.trust.onchain' },
];

function HowStep({ step, icon, title, body }: { step: string; icon: ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
          {icon}
        </span>
        <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{step}</span>
      </div>
      <h3 className="mt-3 font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-500">{body}</p>
    </div>
  );
}

function SmsCard({
  safe,
  tag,
  body,
  why,
}: {
  safe: boolean;
  tag: string;
  body: string;
  why: string;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 ${safe ? 'border-emerald-200' : 'border-red-200'}`}
    >
      <div
        className={`flex items-center gap-2 text-sm font-bold ${
          safe ? 'text-emerald-700' : 'text-red-600'
        }`}
      >
        {safe ? <IconCheck className="h-4 w-4" /> : <IconAlert className="h-4 w-4" />}
        {tag}
      </div>
      <div
        className={`mt-3 whitespace-pre-line rounded-xl border px-4 py-3 text-sm leading-relaxed text-slate-700 ${
          safe ? 'border-slate-200 bg-slate-50' : 'border-red-200 bg-red-50'
        }`}
      >
        {body}
      </div>
      <p className="mt-3 text-xs text-slate-500">{why}</p>
    </div>
  );
}

export function Home({ onFound }: { onFound: (code: string) => void }) {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (raw: string) => {
    const code = raw.trim();
    setError(null);
    if (!code) {
      setError(t('code.error.empty'));
      return;
    }
    if (!isValidCodeFormat(code)) {
      setError(t('code.error.format'));
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      const found = findViolation(code);
      setLoading(false);
      if (found) onFound(found.code);
      else setError(t('code.error.notFound'));
    }, 700);
  };

  const steps = [
    { icon: <IconPhone className="h-5 w-5" />, t: 'how.s1.title', b: 'how.s1.body' },
    { icon: <IconLock className="h-5 w-5" />, t: 'how.s2.title', b: 'how.s2.body' },
    { icon: <IconBolt className="h-5 w-5" />, t: 'how.s3.title', b: 'how.s3.body' },
  ];

  return (
    <div>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-3xl px-4 pt-12 text-center sm:pt-16">
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-200">
            {t('home.eyebrow')}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {t('home.title')}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
            {t('home.subtitle')}
          </p>
        </div>
        <div className="mx-auto max-w-2xl px-4 pb-12 pt-8">
          <div className="animate-fadeUp">
            <CodeInput onSubmit={handleSubmit} loading={loading} error={error} />
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-blue-200">
            <IconLock className="h-3.5 w-3.5 text-emerald-300" />
            {t('home.manualAccess')}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {TRUST.map((item) => (
              <span
                key={item.key}
                className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm text-blue-100"
              >
                {item.icon}
                {t(item.key)}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-14 px-4 py-12">
        <PhishingNotice />

        <section>
          <h2 className="text-center text-2xl font-extrabold text-slate-900">{t('how.title')}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {steps.map((s, i) => (
              <HowStep
                key={s.t}
                step={`${t('how.step')} ${i + 1}`}
                icon={s.icon}
                title={t(s.t)}
                body={t(s.b)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-center text-2xl font-extrabold text-slate-900">{t('sms.title')}</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-500">{t('sms.lead')}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <SmsCard
              safe
              tag={t('sms.legit.tag')}
              body={t('sms.legit.body')}
              why={t('sms.legit.why')}
            />
            <SmsCard
              safe={false}
              tag={t('sms.phish.tag')}
              body={t('sms.phish.body')}
              why={t('sms.phish.why')}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
