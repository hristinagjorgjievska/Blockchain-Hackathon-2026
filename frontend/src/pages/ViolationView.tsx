import { useEffect, useState, type ReactNode } from 'react';
import { useLang } from '../i18n/LangContext';
import {
  amountDueNowMKD,
  canonicalString,
  findViolation,
  type Violation,
} from '../data/violations';
import { sha256Hex } from '../lib/hash';
import { getPayment, type PaymentRecord } from '../lib/paymentStore';
import { getRemotePayment, lookupViolation } from '../lib/api';
import { formatDate, formatDateTime, formatMKD } from '../lib/format';
import { AuthenticityPanel } from '../components/AuthenticityPanel';
import { EvidenceGallery } from '../components/EvidenceGallery';
import { PaymentPanel } from '../components/PaymentPanel';
import { AppealGenerator } from '../components/AppealGenerator';
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
    getRemotePayment(code).then((remote) => {
      if (alive && remote) setPaid(remote);
    });
    return () => {
      alive = false;
    };
  }, [code]);

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

  const speedValue =
    violation.speedRecorded && violation.speedLimit
      ? `${violation.speedRecorded} / ${violation.speedLimit} km/h`
      : null;

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
        {paid ? (
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
            <IconCheck className="h-4 w-4" />
            {t('status.paid')}
          </span>
        ) : (
          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
            {t('status.unpaid')}
          </span>
        )}
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

          <EvidenceGallery violation={violation} />

          <AppealGenerator violation={violation} />


          <AuthenticityPanel fingerprint={fingerprint} />
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <PaymentPanel
              violation={violation}
              fingerprint={fingerprint}
              paid={paid}
              onPaid={setPaid}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
