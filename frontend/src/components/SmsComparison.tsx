import { useLang } from '../i18n/LangContext';
import { VIOLATIONS } from '../data/violations';
import {
  IconAlert,
  IconArrowRight,
  IconCheck,
  IconChevronLeft,
  IconShield,
  IconSignal,
} from './Icons';

/** The code and link are language-independent demo tokens embedded in the SMS copy. */
const LEGIT_CODE = VIOLATIONS[0].code;
const PHISH_LINK = 'https://mvrgovm.help';

function StatusBar() {
  return (
    <div
      aria-hidden
      className="flex items-center justify-between px-6 pb-1 pt-2.5 text-[11px] font-semibold text-slate-500"
    >
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <IconSignal className="h-3 w-3" />
        <span className="flex items-center gap-px">
          <span className="flex h-2.5 w-5 items-center rounded-[3px] border border-slate-400 px-px">
            <span className="block h-1.5 w-3 rounded-[1px] bg-slate-500" />
          </span>
          <span className="h-1 w-0.5 rounded-r bg-slate-400" />
        </span>
      </span>
    </div>
  );
}

function MessageBody({ body, token, safe }: { body: string; token: string; safe: boolean }) {
  const idx = body.indexOf(token);
  const chip = safe
    ? 'rounded-md bg-emerald-100 px-1.5 py-0.5 font-mono text-[12px] font-semibold text-emerald-800 ring-1 ring-emerald-300'
    : 'rounded-md bg-red-100 px-1.5 py-0.5 font-mono text-[12px] font-semibold text-red-700 ring-1 ring-red-300 [word-break:break-all]';

  return (
    <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-700">
      {idx === -1 ? (
        body
      ) : (
        <>
          {body.slice(0, idx)}
          <span className={chip}>{token}</span>
          {body.slice(idx + token.length)}
        </>
      )}
    </p>
  );
}

interface ColumnProps {
  safe: boolean;
  sender: string;
  senderNote: string;
  tag: string;
  body: string;
  token: string;
  why: string;
}

function SmsColumn({ safe, sender, senderNote, tag, body, token, why }: ColumnProps) {
  const { t } = useLang();

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`grid h-7 w-7 place-items-center rounded-full ${
            safe ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
          }`}
        >
          {safe ? <IconCheck className="h-4 w-4" /> : <IconAlert className="h-4 w-4" />}
        </span>
        <span
          className={`font-display text-base font-bold ${
            safe ? 'text-emerald-700' : 'text-red-600'
          }`}
        >
          {tag}
        </span>
      </div>

      <div className="mx-auto w-full max-w-[20.5rem]">
        <div className="rounded-[2.4rem] bg-gradient-to-b from-navy-700 to-navy-950 p-2.5 shadow-lift ring-1 ring-white/10">
          <div className="relative flex h-[39rem] flex-col overflow-hidden rounded-[1.9rem] bg-white">
            <div
              aria-hidden
              className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-navy-950"
            />
            <StatusBar />

            <div className="flex items-center gap-2.5 border-b border-slate-200 px-4 py-2.5">
              <IconChevronLeft className="h-5 w-5 shrink-0 text-blue-600" />
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                <IconShield className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="truncate text-sm font-semibold text-slate-900">{sender}</span>
                  <IconCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                </div>
                <div className="text-[11px] font-medium text-emerald-600">
                  {senderNote}
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-1.5 px-4 py-5">
              <div className="flex">
                <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-slate-100 px-3.5 py-2.5">
                  <MessageBody body={body} token={token} safe={safe} />
                </div>
              </div>
              <div className="pl-2 text-[10px] text-slate-400">{t('sms.now')}</div>
            </div>

            <div
              aria-hidden
              className="flex items-center gap-2 border-t border-slate-200 px-3 py-2.5"
            >
              <div className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-[12px] text-slate-400">
                {t('sms.inputPlaceholder')}
              </div>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-400">
                <IconArrowRight className="h-3.5 w-3.5 -rotate-90" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mt-4 flex gap-2 rounded-xl border p-3 text-xs leading-relaxed ${
          safe
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-red-200 bg-red-50 text-red-700'
        }`}
      >
        {safe ? (
          <IconCheck className="mt-0.5 h-4 w-4 shrink-0" />
        ) : (
          <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
        )}
        <span>{why}</span>
      </div>
    </div>
  );
}

export function SmsComparison() {
  const { t } = useLang();

  return (
    <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
      <SmsColumn
        safe
        sender="SafeChain MK"
        senderNote={t('sms.legit.senderNote')}
        tag={t('sms.legit.tag')}
        body={t('sms.legit.body')}
        token={LEGIT_CODE}
        why={t('sms.legit.why')}
      />
      <SmsColumn
        safe={false}
        sender="SafeChain MK"
        senderNote={t('sms.legit.senderNote')}
        tag={t('sms.phish.tag')}
        body={t('sms.phish.body')}
        token={PHISH_LINK}
        why={t('sms.phish.why')}
      />
    </div>
  );
}
