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
import { getRemotePayment, lookupViolation } from '../lib/api';
import { resolveNftStatus } from '../lib/resolveNftStatus';
import { getLocalStatus } from '../lib/violationStatusStore';
import { formatDate, formatDateTime, formatMKD } from '../lib/format';
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
  IconGauge,
  IconHash,
  IconPin,
  IconScale,
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
  const [paidSubmitted, setPaidSubmitted] = useState(false);
  const [appealPending, setAppealPending] = useState<boolean>(
    () => getLocalStatus(code) === 'appeal_pending',
  );

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
          </div>
          <div className="shrink-0">
            <img src="/mvr.png" alt="МВР" className="h-36 w-36 object-contain opacity-80 sm:h-44 sm:w-44" />
          </div>
        </div>
      </div>
    );
  }

  if (nftStatus === 'paid') {
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

        <section className="mt-8 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {t('nft.status.paid')}
          </span>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 max-w-2xl">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                <IconCheck className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                {t('view.paid.title')}
              </h1>
              <p className="mt-4 leading-relaxed text-slate-600">{t('view.paid.body')}</p>
              <p className="mt-4 font-mono text-xs text-slate-400">{violation.refId}</p>
            </div>
            <img
              src="/mvr.png"
              alt="МВР"
              className="h-24 w-24 shrink-0 object-contain opacity-80 sm:h-32 sm:w-32"
            />
          </div>
        </section>

        <div className="mt-6">{violationDetails}</div>
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
