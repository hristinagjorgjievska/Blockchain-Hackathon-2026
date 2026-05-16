import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useLang } from '../i18n/LangContext';
import {
  EARLY_PAYMENT_DAYS,
  amountDueNowMKD,
  discountMKD,
  type Violation,
} from '../data/violations';
import {
  createEncryptedMemo,
  createNonCryptoPayment,
  decryptMemo,
  recordCryptoPayment,
  type DecryptedMemoPayload,
} from '../lib/api';
import { formatDate, formatDateTime, formatEUR, formatMKD, formatSOL, shortId } from '../lib/format';
import { savePayment, type PaymentRecord } from '../lib/paymentStore';
import { FAUCET_URL, explorerTxUrl, mkdToSol } from '../solana/config';
import { PayError, payFine } from '../solana/payment';
import {
  IconAlert,
  IconBolt,
  IconCard,
  IconCheck,
  IconCopy,
  IconExternal,
  IconScale,
  IconSpinner,
  IconWallet,
} from './Icons';

type Status = 'idle' | 'preparing' | 'confirming' | 'saving' | 'error';
type PaymentMethod = 'non_crypto' | 'crypto';

interface Props {
  violation: Violation;
  fingerprint: string | null;
  paid: PaymentRecord | null;
  onPaid: (record: PaymentRecord) => void;
}

function Row({
  label,
  value,
  strong,
  accent,
}: {
  label: string;
  value: string;
  strong?: boolean;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span
        className={`text-right tabular-nums ${strong ? 'font-bold' : 'font-medium'} ${
          accent ?? 'text-slate-800'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function TxTimeline({ status }: { status: Status }) {
  const { t } = useLang();
  const steps: { key: string; state: 'done' | 'active' | 'pending' }[] = [
    { key: 'pay.step.encrypt', state: status === 'preparing' ? 'active' : 'done' },
    { key: 'pay.step.authorize', state: status === 'confirming' ? 'active' : 'pending' },
  ];

  return (
    <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/70 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
        {t('pay.processing')}
      </div>
      <div className="mt-2.5 space-y-1">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-3 py-1">
            {s.state === 'done' ? (
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
                <IconCheck className="h-4 w-4" />
              </span>
            ) : s.state === 'active' ? (
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-white">
                <IconSpinner className="h-4 w-4 animate-spin" />
              </span>
            ) : (
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-bold text-slate-400">
                {i + 1}
              </span>
            )}
            <span
              className={`text-sm font-medium ${
                s.state === 'pending' ? 'text-slate-400' : 'text-slate-700'
              }`}
            >
              {t(s.key)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MethodButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: JSX.Element;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
        active
          ? 'bg-white text-blue-800 shadow-sm ring-1 ring-slate-200'
          : 'text-slate-500 hover:bg-white/70 hover:text-slate-800'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export function PaymentPanel({ violation, fingerprint, paid, onPaid }: Props) {
  const { t, lang } = useLang();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [method, setMethod] = useState<PaymentMethod>('non_crypto');
  const [status, setStatus] = useState<Status>('idle');
  const [errKind, setErrKind] = useState<PayError['kind'] | null>(null);
  const [copied, setCopied] = useState(false);
  const [decryptedMemo, setDecryptedMemo] = useState<DecryptedMemoPayload | null>(null);
  const [memoDecrypting, setMemoDecrypting] = useState(false);
  const [memoDecryptError, setMemoDecryptError] = useState(false);

  const amountMKD = amountDueNowMKD(violation);
  const amountSol = mkdToSol(amountMKD);
  const discount = discountMKD(violation);
  const busy = status === 'preparing' || status === 'confirming' || status === 'saving';
  const baseFineValue =
    lang === 'en'
      ? formatEUR(violation.baseFineEUR, lang)
      : `${formatMKD(violation.baseFineMKD, lang)} · ${formatEUR(
          violation.baseFineEUR,
          lang,
        )}`;

  const chooseMethod = (next: PaymentMethod) => {
    if (busy) return;
    setMethod(next);
    setStatus('idle');
    setErrKind(null);
  };

  const handleCryptoPay = async () => {
    if (!publicKey) return;
    setStatus('preparing');
    setErrKind(null);

    try {
      const payer = publicKey.toBase58();
      const encryptedMemo = await createEncryptedMemo({
        violation,
        fingerprint,
        amountMKD,
        amountSol,
        payer,
      });
      const signature = await payFine({
        connection,
        payer: publicKey,
        sendTransaction,
        amountSol,
        memo: encryptedMemo.memo,
        onSent: () => setStatus('confirming'),
      });
      const localRecord: PaymentRecord = {
        method: 'crypto',
        signature,
        paidAtIso: new Date().toISOString(),
        amountMKD,
        amountSol,
        payer,
        memo: encryptedMemo.memo,
        memoSummary: encryptedMemo.summary,
        network: 'Solana Devnet',
      };
      const persisted = await recordCryptoPayment({
        code: violation.code,
        signature,
        amountMKD,
        amountSol,
        payer,
        memo: encryptedMemo.memo,
        memoSummary: encryptedMemo.summary,
      });
      const record = persisted ?? localRecord;
      savePayment(violation.code, record);
      onPaid(record);
      setStatus('idle');
    } catch (e) {
      const kind = e instanceof PayError ? e.kind : 'generic';
      if (kind === 'rejected') {
        setStatus('idle');
        setErrKind(null);
        return;
      }
      setErrKind(kind);
      setStatus('error');
    }
  };

  const handleNonCryptoPay = async () => {
    setStatus('saving');
    setErrKind(null);
    try {
      const record = await createNonCryptoPayment(violation.code);
      savePayment(violation.code, record);
      onPaid(record);
      setStatus('idle');
    } catch {
      setErrKind('generic');
      setStatus('error');
    }
  };

  const copyReceipt = () => {
    if (!paid) return;
    const value = paid.signature ?? paid.receiptId;
    if (!value) return;
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

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

  if (paid) {
    const paidMethod = paid.method ?? 'crypto';
    const paidAmountMKD = paid.amountMKD ?? amountMKD;
    const receiptValue = paid.signature ?? paid.receiptId ?? '';
    const receiptLabel =
      paidMethod === 'crypto' ? t('pay.receipt.signature') : t('pay.receipt.id');

    return (
      <section className="overflow-hidden rounded-2xl border border-emerald-300 bg-white shadow-card">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 p-5 text-white sm:p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl"
          />
          <div className="relative flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 animate-scaleIn place-items-center rounded-full bg-white/15 ring-1 ring-white/30">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
                aria-hidden
              >
                <path d="m4.5 12.5 5 5 10-11" strokeDasharray="40" className="animate-drawCheck" />
              </svg>
            </span>
            <div>
              <h2 className="font-display text-lg font-bold">{t('pay.success.title')}</h2>
              <p className="text-sm text-emerald-50/90">
                {paidMethod === 'crypto'
                  ? t('pay.success.body.crypto')
                  : t('pay.success.body.nonCrypto')}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3.5 p-5 sm:p-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('pay.receipt')}
          </div>
          <Row
            label={t('pay.receipt.amount')}
            value={
              paid.amountSol
                ? `${formatSOL(paid.amountSol)} · ${formatMKD(paidAmountMKD, lang)}`
                : formatMKD(paidAmountMKD, lang)
            }
            strong
          />
          <Row label={t('pay.receipt.date')} value={formatDateTime(paid.paidAtIso, lang)} />
          <Row
            label={t('pay.receipt.method')}
            value={paidMethod === 'crypto' ? t('pay.method.crypto') : t('pay.method.card')}
          />
          {paid.network && <Row label={t('pay.receipt.network')} value={paid.network} />}

          {receiptValue && (
            <div>
              <div className="text-sm text-slate-500">{receiptLabel}</div>
              <div className="mt-1 flex items-start gap-2">
                <code className="min-w-0 flex-1 break-all rounded-lg bg-slate-100 px-2.5 py-2 font-mono text-xs leading-relaxed text-slate-700">
                  {receiptValue}
                </code>
                <button
                  type="button"
                  onClick={copyReceipt}
                  className="shrink-0 rounded-lg border border-slate-300 p-2 text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                  aria-label={copied ? t('common.copied') : t('common.copy')}
                >
                  {copied ? (
                    <IconCheck className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <IconCopy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {paid.memo && (
            <div>
              <div className="text-sm text-slate-500">{t('pay.receipt.memo')}</div>
              <code className="mt-1 block break-all rounded-lg bg-slate-100 px-2.5 py-2 font-mono text-xs leading-relaxed text-slate-700">
                {paid.memo}
              </code>
              {paid.memoSummary && (
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {t('pay.receipt.memoSummary', { fields: paid.memoSummary.join(', ') })}
                </p>
              )}
              <button
                type="button"
                onClick={() => handleDecryptMemo(paid.memo!)}
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

          {paid.signature && (
            <a
              href={explorerTxUrl(paid.signature)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 px-4 py-3 font-semibold text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.85)] transition duration-150 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 active:translate-y-px"
            >
              <IconExternal className="h-4 w-4" />
              {t('common.explorer')}
            </a>
          )}
          <p className="text-xs leading-relaxed text-slate-500">{t('pay.receipt.note')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100">
            <IconScale className="h-5 w-5" />
          </span>
          <h2 className="font-display text-lg font-bold text-slate-900">{t('pay.title')}</h2>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {t('pay.breakdown')}
          </div>
          <Row label={t('pay.base')} value={baseFineValue} />
          {discount > 0 && (
            <Row
              label={t('pay.discount', {
                percent: violation.earlyPaymentDiscountPercent,
                days: EARLY_PAYMENT_DAYS,
              })}
              value={`- ${formatMKD(discount, lang)}`}
              accent="text-emerald-600"
            />
          )}
          <Row
            label={t('pay.discountDeadline')}
            value={formatDate(violation.earlyPaymentDeadline, lang)}
          />
          <div className="my-1 border-t border-dashed border-slate-300" />
          <Row label={t('pay.total')} value={formatMKD(amountMKD, lang)} strong />
          {method === 'crypto' && (
            <Row label={t('pay.sol')} value={formatSOL(amountSol)} strong accent="text-blue-700" />
          )}
          <p className="pt-1 text-xs leading-relaxed text-slate-500">
            {violation.legalNote[lang]}
          </p>
          <p className="text-xs leading-relaxed text-emerald-700">
            {t('pay.discountRule', {
              percent: violation.earlyPaymentDiscountPercent,
              days: EARLY_PAYMENT_DAYS,
            })}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          <MethodButton
            active={method === 'non_crypto'}
            icon={<IconCard className="h-4 w-4" />}
            label={t('pay.method.card')}
            onClick={() => chooseMethod('non_crypto')}
          />
          <MethodButton
            active={method === 'crypto'}
            icon={<IconWallet className="h-4 w-4" />}
            label={t('pay.method.crypto')}
            onClick={() => chooseMethod('crypto')}
          />
        </div>

        {method === 'non_crypto' ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <IconCard className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display font-bold text-slate-900">{t('pay.card.title')}</div>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{t('pay.card.body')}</p>
              </div>
            </div>

            {status === 'error' && errKind && (
              <div className="mt-3 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
                <IconAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <p className="text-sm font-medium text-red-700">{t(`pay.err.${errKind}`)}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleNonCryptoPay}
              disabled={busy}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-700 px-4 py-3.5 font-bold text-white shadow-[0_12px_28px_-10px_rgba(5,150,105,0.85)] transition duration-150 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 active:translate-y-px disabled:cursor-wait disabled:opacity-75"
            >
              {status === 'saving' ? (
                <IconSpinner className="h-5 w-5 animate-spin" />
              ) : (
                <IconCard className="h-5 w-5" />
              )}
              {status === 'saving' ? t('pay.card.processing') : t('pay.card.payNow')}
            </button>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">{t('pay.card.note')}</p>
          </div>
        ) : !connected ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4 text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
              <IconWallet className="h-5 w-5" />
            </span>
            <div className="mt-2.5 font-display font-bold text-slate-900">
              {t('pay.connect.title')}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">{t('pay.connect.body')}</p>
            <div className="mt-3 flex justify-center">
              <WalletMultiButton />
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3">
              <span className="flex items-center gap-2 text-sm">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                  <IconWallet className="h-4 w-4" />
                </span>
                <span className="text-slate-500">{t('pay.wallet')}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-sm font-semibold text-slate-800">
                  {publicKey ? shortId(publicKey.toBase58(), 4) : ''}
                </span>
              </span>
            </div>

            {busy ? (
              <TxTimeline status={status} />
            ) : (
              <>
                {status === 'error' && errKind && (
                  <div className="mt-3 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
                    <IconAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <p className="text-sm font-medium text-red-700">{t(`pay.err.${errKind}`)}</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleCryptoPay}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 px-4 py-3.5 font-bold text-white shadow-[0_12px_28px_-10px_rgba(37,99,235,0.85)] transition duration-150 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 active:translate-y-px"
                >
                  <IconBolt className="h-5 w-5" />
                  {status === 'error'
                    ? t('pay.retry')
                    : t('pay.payNow', { amount: amountSol.toFixed(3) })}
                </button>
              </>
            )}
          </div>
        )}

        {method === 'crypto' && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>{t('pay.devnetNote')}</span>
            <a
              href={FAUCET_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded font-medium text-blue-700 transition-colors hover:text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              {t('pay.faucet')}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
