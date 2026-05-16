import { useEffect, useState, type ReactNode } from 'react';
import { useLang } from '../i18n/LangContext';
import {
  amountDueNowMKD,
  canonicalString,
  findViolation,
  type Violation,
} from '../data/violations';
import { sha256Hex } from '../lib/hash';
import { getPayment, savePayment, type PaymentRecord } from '../lib/paymentStore';
import { decryptMemo, getRemotePayment, lookupViolation, type DecryptedMemoPayload } from '../lib/api';
import { explorerTxUrl } from '../solana/config';
import { resolveNftStatus } from '../lib/resolveNftStatus';
import { getLocalStatus } from '../lib/violationStatusStore';
import { getAppeal } from '../lib/appealStore';
import { buildAppealPdf } from '../components/AppealGenerator';
import { formatDate, formatDateTime, formatMKD, formatSOL } from '../lib/format';
import { NftRecord } from '../components/NftRecord';
import { EvidenceGallery } from '../components/EvidenceGallery';
import { PaymentPanel } from '../components/PaymentPanel';
import { AppealGenerator } from '../components/AppealGenerator';
import { FAQ } from '../components/FAQ';
import {
  IconAlert,
  IconArrowLeft,
  IconCalendar,
  IconCamera,
  IconCar,
  IconCheck,
  IconClock,
  IconExternal,
  IconGauge,
  IconHash,
  IconPin,
  IconScale,
  IconSpinner,
} from '../components/Icons';

function Field({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</div>
        <div className="font-semibold text-slate-800">{value}</div>
      </div>
    </div>
  );
}

function AppealDownloadButton({ violation, appealText }: { violation: Violation; appealText: string }) {
  const [loading, setLoading] = useState(false);

  const download = async () => {
    setLoading(true);
    try {
      const blob = await buildAppealPdf(appealText, violation);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prigovor-${violation.refId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={download}
      disabled={loading}
      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 active:bg-amber-700 disabled:cursor-wait disabled:opacity-70"
    >
      {loading
        ? <IconSpinner className="h-4 w-4 animate-spin" />
        : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
      }
      {loading ? 'Се генерира…' : 'Преземи приговор (PDF)'}
    </button>
  );
}

export function ViolationView({
  code,
  initialViolation,
  onBack,
}: {
  code: string;
  initialViolation?: Violation;
  onBack: () => void;
}) {
  const { t, lang } = useLang();
  const [violation, setViolation] = useState<Violation | null | undefined>(
    () => initialViolation ?? findViolation(code),
  );
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [paid, setPaid] = useState<PaymentRecord | null>(() => getPayment(code));
  const [paidSubmitted, setPaidSubmitted] = useState(() => !!getPayment(code));
  const [appealPending, setAppealPending] = useState<boolean>(
    () => getLocalStatus(code) === 'appeal_pending',
  );
  const [decryptedMemo, setDecryptedMemo] = useState<DecryptedMemoPayload | null>(null);
  const [memoDecrypting, setMemoDecrypting] = useState(false);
  const [memoDecryptError, setMemoDecryptError] = useState(false);

  const handleDecryptMemo = async (memo: string) => {
    setMemoDecrypting(true);
    setMemoDecryptError(false);
    try {
      setDecryptedMemo(await decryptMemo(memo));
    } catch {
      setDecryptedMemo(null);
      setMemoDecryptError(true);
    } finally {
      setMemoDecrypting(false);
    }
  };

  function calculateDaysRemaining(dueDate: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const timeDiff = due.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return Math.max(0, daysDiff);
  }

  useEffect(() => {
    let alive = true;
    if (violation) {
      return () => {
        alive = false;
      };
    }
    lookupViolation(code).then((found) => {
      if (alive) setViolation(found);
    });
    return () => {
      alive = false;
    };
  }, [code, violation]);

  useEffect(() => {
    let alive = true;
    if (violation) {
      setFingerprint(null);
      sha256Hex(canonicalString(violation)).then((h) => {
        if (alive) setFingerprint(h);
      });
    }
    return () => {
      alive = false;
    };
  }, [violation]);

  useEffect(() => {
    let alive = true;
    if (violation === undefined) {
      return () => {
        alive = false;
      };
    }
    if (violation?.status === 'unpaid' && !paidSubmitted) {
      return () => {
        alive = false;
      };
    }
    getRemotePayment(code).then((remote) => {
      if (alive && remote) {
        savePayment(code, remote);
        setPaid(remote);
      }
    });
    return () => {
      alive = false;
    };
  }, [code, violation?.status, paidSubmitted]);

  if (violation === undefined) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-slate-600">{t('common.loading')}</p>
      </div>
    );
  }

  if (violation === null) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <IconAlert className="mx-auto h-10 w-10 text-amber-500" />
        <p className="mt-3 text-slate-600">{t('code.error.notFound')}</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 rounded-xl bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800"
        >
          {t('view.back')}
        </button>
      </div>
    );
  }

  const authorityUnpaid = violation.status === 'unpaid' && !paidSubmitted;
  const statusViolation =
    paidSubmitted && violation.status === 'unpaid'
      ? { ...violation, status: undefined }
      : violation;
  const effectivePaid = authorityUnpaid ? null : paid;
  const nftStatus = resolveNftStatus(statusViolation, effectivePaid, appealPending);

  const speedValue =
    violation.speedRecorded && violation.speedLimit
      ? `${violation.speedRecorded} / ${violation.speedLimit} km/h`
      : null;

  const violationDetails = (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-slate-900">{t('view.detailsTitle')}</h2>
      <div className="mt-3 rounded-xl bg-blue-50 p-3 text-sm text-blue-900">
        <span className="font-bold">{t(`kind.${violation.kind}`)}</span>
        {' — '}
        {t(`kind.${violation.kind}.desc`)}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field
          icon={<IconCalendar className="h-4 w-4" />}
          label={t('view.field.datetime')}
          value={formatDateTime(violation.dateTime, lang)}
        />
        <Field
          icon={<IconPin className="h-4 w-4" />}
          label={t('view.field.location')}
          value={`${violation.street[lang]}, ${violation.city[lang]}`}
        />
        <Field
          icon={<IconCar className="h-4 w-4" />}
          label={t('view.field.vehicle')}
          value={`${t(`color.${violation.carColor}`)} ${violation.vehicleMake}`}
        />
        <Field
          icon={<IconHash className="h-4 w-4" />}
          label={t('view.field.plate')}
          value={violation.plate}
        />
        <Field
          icon={<IconCamera className="h-4 w-4" />}
          label={t('view.field.camera')}
          value={violation.cameraId}
        />
        {speedValue && (
          <Field
            icon={<IconGauge className="h-4 w-4" />}
            label={t('view.field.speed')}
            value={speedValue}
          />
        )}
        <Field
          icon={<IconClock className="h-4 w-4" />}
          label={t('view.field.issued')}
          value={formatDateTime(violation.issuedAt, lang)}
        />
        <Field
          icon={<IconCalendar className="h-4 w-4" />}
          label={t('view.field.due')}
          value={formatDate(violation.earlyPaymentDeadline, lang)}
        />
        <Field
          icon={<IconScale className="h-4 w-4" />}
          label={t('view.field.legal')}
          value={violation.legalNote[lang]}
        />
      </div>
    </section>
  );

  if (nftStatus === 'voided') {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-blue-700"
        >
          <IconArrowLeft className="h-4 w-4" />
          {t('view.back')}
        </button>
        <div className="mt-8 flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:gap-16">
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              {t('nft.status.voided')}
            </span>
            <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">{t('view.voided.title')}</h1>
            <p className="mt-4 leading-relaxed text-slate-600">{t('view.voided.body')}</p>
            <p className="mt-4 font-mono text-xs text-slate-400">{violation.refId}</p>
          </div>
          <div className="shrink-0">
            <img src="/mvr.png" alt="МВР" className="h-36 w-36 object-contain opacity-80 sm:h-44 sm:w-44" />
          </div>
        </div>
      </div>
    );
  }

  if (nftStatus === 'appeal_pending') {
    const storedAppeal = getAppeal(code);
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-blue-700"
        >
          <IconArrowLeft className="h-4 w-4" />
          {t('view.back')}
        </button>
        <div className="mt-8 flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:gap-16">
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              {t('nft.status.appeal_pending')}
            </span>
            <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">{t('nft.status.appeal_pending')}</h1>
            <p className="mt-4 leading-relaxed text-slate-600">{t('view.appeal.banner')}</p>
            <p className="mt-4 font-mono text-xs text-slate-400">{violation.refId}</p>
            {storedAppeal && (
              <AppealDownloadButton violation={violation} appealText={storedAppeal.text} />
            )}
          </div>
          <div className="shrink-0">
            <img src="/mvr.png" alt="МВР" className="h-36 w-36 object-contain opacity-80 sm:h-44 sm:w-44" />
          </div>
        </div>
      </div>
    );
  }

  if (nftStatus === 'paid') {
    const txRecord = effectivePaid ?? paid;
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-blue-700"
        >
          <IconArrowLeft className="h-4 w-4" />
          {t('view.back')}
        </button>
        <div className="mt-8 flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:gap-16">
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t('nft.status.paid')}
            </span>
            <div className="mt-4 grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <IconCheck className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">{t('view.paid.title')}</h1>
            <p className="mt-4 leading-relaxed text-slate-600">{t('view.paid.body')}</p>
            <p className="mt-4 font-mono text-xs text-slate-400">{violation.refId}</p>
          </div>
          <div className="shrink-0">
            <img src="/mvr.png" alt="МВР" className="h-36 w-36 object-contain opacity-80 sm:h-44 sm:w-44" />
          </div>
        </div>

        <div className="mt-8">{violationDetails}</div>

        {txRecord && (
          <section className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-3.5 w-3.5 rounded-full"
                style={{ background: 'linear-gradient(135deg,#9945ff,#14f195)' }}
              />
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t('pay.receipt')}
              </div>
            </div>

            {/* Violation fields committed on-chain */}
            <div className="grid gap-x-6 gap-y-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{t('view.field.datetime')}</div>
                <div className="font-semibold text-slate-800">{formatDateTime(violation.dateTime, lang)}</div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{t('view.field.location')}</div>
                <div className="font-semibold text-slate-800">{violation.street[lang]}, {violation.city[lang]}</div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{t('view.field.plate')}</div>
                <div className="font-mono font-semibold text-slate-800">{violation.plate}</div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{t('view.field.vehicle')}</div>
                <div className="font-semibold text-slate-800">{t(`color.${violation.carColor}`)} {violation.vehicleMake}</div>
              </div>
              {violation.speedRecorded && violation.speedLimit && (
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{t('view.field.speed')}</div>
                  <div className="font-semibold text-slate-800">{violation.speedRecorded} / {violation.speedLimit} km/h</div>
                </div>
              )}
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{t('pay.receipt.amount')}</div>
                <div className="font-semibold text-slate-800">
                  {txRecord.amountSol
                    ? `${formatSOL(txRecord.amountSol)} · ${formatMKD(txRecord.amountMKD, lang)}`
                    : formatMKD(txRecord.amountMKD, lang)}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{t('pay.receipt.date')}</div>
                <div className="font-semibold text-slate-800">{formatDateTime(txRecord.paidAtIso, lang)}</div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{t('view.field.camera')}</div>
                <div className="font-semibold text-slate-800">{violation.cameraId}</div>
              </div>
            </div>

            {/* Memo */}
            {txRecord.memo && (
              <div>
                <div className="text-sm text-slate-500">{t('pay.receipt.memo')}</div>
                <code className="mt-1 block break-all rounded-lg bg-slate-100 px-2.5 py-2 font-mono text-xs leading-relaxed text-slate-700">
                  {txRecord.memo}
                </code>
                {txRecord.memoSummary && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {t('pay.receipt.memoSummary', { fields: txRecord.memoSummary.join(', ') })}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => handleDecryptMemo(txRecord.memo!)}
                  disabled={memoDecrypting}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-wait disabled:opacity-70"
                >
                  {memoDecrypting && <IconSpinner className="h-3.5 w-3.5 animate-spin" />}
                  {memoDecrypting ? t('pay.receipt.memoDecrypting') : t('pay.receipt.memoDecrypt')}
                </button>
                {memoDecryptError && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {t('pay.receipt.memoDecryptError')}
                  </p>
                )}
                {decryptedMemo && (
                  <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <div className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                      {t('pay.receipt.memoDecrypted')}
                    </div>
                    <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-white/80 p-2.5 font-mono text-[11px] leading-relaxed text-slate-700 ring-1 ring-emerald-100">
                      {JSON.stringify(decryptedMemo, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Solana Explorer link */}
            {txRecord.signature && (
              <a
                href={explorerTxUrl(txRecord.signature)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 px-4 py-3 font-semibold text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.85)] transition duration-150 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 active:translate-y-px"
              >
                <IconExternal className="h-4 w-4" />
                {t('common.explorer')}
              </a>
            )}
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-blue-700"
      >
        <IconArrowLeft className="h-4 w-4" />
        {t('view.back')}
      </button>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div>
          <div className="font-mono text-xs font-medium uppercase tracking-wide text-slate-400">
            {`${t('view.ref')} ${violation.refId}`}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {t('view.title')}
          </h1>
        </div>
        {(() => {
          const cfg = {
            paid:           { cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
            unpaid:         { cls: 'bg-red-100 text-red-700',         dot: 'bg-red-500'     },
            voided:         { cls: 'bg-slate-100 text-slate-600',     dot: 'bg-slate-400'   },
            appeal_pending: { cls: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-500'   },
          }[nftStatus];
          return (
            <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${cfg.cls}`}>
              <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
              {t(`nft.status.${nftStatus}`)}
            </span>
          );
        })()}
        <div className="ml-auto rounded-xl bg-navy px-4 py-2 text-right text-white">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-blue-200">
            {t('view.amountDue')}
          </div>
          <div className="text-lg font-extrabold">
            {formatMKD(amountDueNowMKD(violation), lang)}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {violationDetails}

          <EvidenceGallery violation={violation} />

          <AppealGenerator
            violation={violation}
            onAppealSubmitted={() => setAppealPending(true)}
          />

          <FAQ
            title={t('faq.violation.title')}
            items={[
              {
                question: t('faq.violation.daysLeftQ'),
                answer: t('faq.violation.daysLeftA').replace(
                  '{days}',
                  calculateDaysRemaining(violation.dueDate).toString()
                ),
              },
              { question: t('faq.violation.disagreeQ'), answer: t('faq.violation.disagreeA') },
              { question: t('faq.violation.appealQ'), answer: t('faq.violation.appealA') },
              { question: t('faq.violation.paymentQ'), answer: t('faq.violation.paymentA') },
              { question: t('faq.violation.evidenceQ'), answer: t('faq.violation.evidenceA') },
            ]}
          />

          <NftRecord
            violation={statusViolation}
            fingerprint={fingerprint}
            paid={effectivePaid}
            localAppealPending={appealPending}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:[scrollbar-width:thin]">
            <PaymentPanel
              violation={violation}
              fingerprint={fingerprint}
              paid={effectivePaid}
              onPaid={(record) => {
                setPaid(record);
                setPaidSubmitted(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
