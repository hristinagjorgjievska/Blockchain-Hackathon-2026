import { useState, type CSSProperties, type ReactNode } from 'react';
import { useLang } from '../i18n/LangContext';
import { CodeInput } from '../components/CodeInput';
import { PhishingNotice } from '../components/PhishingNotice';
import { SmsComparison } from '../components/SmsComparison';
import { Reveal } from '../components/Reveal';
import { isValidCodeFormat, type Violation } from '../data/violations';
import { lookupViolation } from '../lib/api';
import {
  IconActivity,
  IconCamera,
  IconChain,
  IconEye,
  IconLinkOff,
  IconLock,
  IconMessage,
  IconShield,
} from '../components/Icons';

const TRUST = [
  { icon: <IconLinkOff className="h-4 w-4" />, key: 'home.trust.noLinks', tone: 'text-emerald-300' },
  { icon: <IconCamera className="h-4 w-4" />, key: 'home.trust.evidence', tone: 'text-blue-300' },
  { icon: <IconChain className="h-4 w-4" />, key: 'home.trust.onchain', tone: 'text-cyan-300' },
];

const STEPS = [
  { icon: <IconMessage className="h-6 w-6" />, t: 'how.s1.title', b: 'how.s1.body' },
  { icon: <IconLock className="h-6 w-6" />, t: 'how.s2.title', b: 'how.s2.body' },
  { icon: <IconEye className="h-6 w-6" />, t: 'how.s3.title', b: 'how.s3.body' },
];

function delayStyle(ms: number): CSSProperties {
  return { animationDelay: `${ms}ms` };
}

function HowStep({
  index,
  icon,
  title,
  body,
}: {
  index: number;
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
      <div
        aria-hidden
        className="h-1 w-full bg-gradient-to-r from-blue-400/60 via-blue-500/80 to-blue-400/60"
      />
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 ring-1 ring-blue-100">
            {icon}
          </span>
          <span className="font-display text-3xl font-bold text-slate-200">
            {`0${index}`}
          </span>
        </div>
        <h3 className="mt-4 font-display text-base font-bold text-slate-900">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{body}</p>
      </div>
    </div>
  );
}

function SectionHead({
  icon,
  title,
  lead,
}: {
  icon: ReactNode;
  title: string;
  lead?: string;
}) {
  return (
    <div className="text-center">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
        {icon}
      </span>
      <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.7rem]">
        {title}
      </h2>
      {lead && (
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">{lead}</p>
      )}
    </div>
  );
}

export function Home({ onFound }: { onFound: (violation: Violation) => void }) {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (raw: string) => {
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
    window.setTimeout(async () => {
      const found = await lookupViolation(code);
      setLoading(false);
      if (found) onFound(found);
      else setError(t('code.error.notFound'));
    }, 700);
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-800 via-navy-900 to-navy-950 text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <img
            src="/hero.png"
            alt=""
            className="h-full w-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-navy-950/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/55 via-navy-900/68 to-navy-950/92" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/45 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-14 sm:pt-20">
          <div className="text-center">
            <div className="animate-fadeUp">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100">
                <IconShield className="h-3.5 w-3.5 text-blue-300" />
                {t('home.eyebrow')}
              </span>
            </div>
            <h1
              className="mt-5 animate-fadeUp text-balance font-display text-[1.7rem] font-bold leading-[1.13] tracking-tight sm:text-[2.4rem] lg:text-[2.9rem]"
              style={delayStyle(60)}
            >
              {t('home.title')}
            </h1>
            <p
              className="mx-auto mt-4 max-w-2xl animate-fadeUp text-[15px] leading-relaxed text-blue-100/85 sm:text-base"
              style={delayStyle(120)}
            >
              {t('home.subtitle')}
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-2xl">
            <div className="animate-fadeUp" style={delayStyle(170)}>
              <CodeInput onSubmit={handleSubmit} loading={loading} error={error} />
            </div>
            <p
              className="mt-4 flex animate-fadeUp items-center justify-center gap-1.5 text-xs text-blue-200/90"
              style={delayStyle(230)}
            >
              <IconLock className="h-3.5 w-3.5 text-emerald-300" />
              {t('home.manualAccess')}
            </p>
            <div
              className="mt-6 flex animate-fadeUp flex-wrap justify-center gap-2.5"
              style={delayStyle(290)}
            >
              {TRUST.map((item) => (
                <span
                  key={item.key}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-sm text-blue-100"
                >
                  <span className={item.tone}>{item.icon}</span>
                  {t(item.key)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-16">
        <Reveal>
          <PhishingNotice />
        </Reveal>

        <section>
          <Reveal>
            <SectionHead icon={<IconActivity className="h-5 w-5" />} title={t('how.title')} />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 90} className="h-full">
                <HowStep index={i + 1} icon={s.icon} title={t(s.t)} body={t(s.b)} />
              </Reveal>
            ))}
          </div>
        </section>

        <section>
          <Reveal>
            <SectionHead
              icon={<IconMessage className="h-5 w-5" />}
              title={t('sms.title')}
              lead={t('sms.lead')}
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-8">
              <SmsComparison />
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
