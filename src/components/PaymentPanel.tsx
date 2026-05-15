import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useLang } from '../i18n/LangContext';
import { discountMKD, type Violation } from '../data/violations';
import { formatDateTime, formatMKD, formatSOL, shortId } from '../lib/format';
import { savePayment, type PaymentRecord } from '../lib/paymentStore';
import { FAUCET_URL, explorerTxUrl, mkdToSol } from '../solana/config';
import { PayError, payFine } from '../solana/payment';
import {
  IconAlert,
  IconBolt,
  IconCheck,
  IconCopy,
  IconExternal,
  IconScale,
  IconSpinner,
  IconWallet,
} from './Icons';

type Status = 'idle' | 'preparing' | 'confirming' | 'error';

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
      <span className={`${strong ? 'font-bold' : 'font-medium'} ${accent ?? 'text-slate-800'}`}>
        {value}
      </span>
    </div>
  );
}

export function PaymentPanel({ violation, fingerprint, paid, onPaid }: Props) {
  const { t, lang } = useLang();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [status, setStatus] = useState<Status>('idle');
  const [errKind, setErrKind] = useState<PayError['kind'] | null>(null);
  const [copied, setCopied] = useState(false);

  const amountSol = mkdToSol(violation.amountDueMKD);
  const discount = discountMKD(violation);
  const busy = status === 'preparing' || status === 'confirming';

  const handlePay = async () => {
    if (!publicKey) return;
    setStatus('preparing');
    setErrKind(null);
    const memo = `SafeCityMK|code=${violation.code}|ref=${violation.refId}|fp=${(
      fingerprint ?? 'pending'
    ).slice(0, 16)}|status=paid`;
    try {
      const signature = await payFine({
        connection,
        payer: publicKey,
        sendTransaction,
        amountSol,
        memo,
        onSent: () => setStatus('confirming'),
      });
      const record: PaymentRecord = {
        signature,
        paidAtIso: new Date().toISOString(),
        amountSol,
        payer: publicKey.toBase58(),
        memo,
      };
      savePayment(violation.code, record);
      onPaid(record);
      setStatus('idle');
    } catch (e) {
      setErrKind(e instanceof PayError ? e.kind : 'generic');
      setStatus('error');
    }
  };

  const copySig = () => {
    if (!paid) return;
    navigator.clipboard?.writeText(paid.signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (paid) {
    return (
      <section className="overflow-hidden rounded-2xl border border-emerald-300 bg-white shadow-sm">
        <div className="bg-emerald-50 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
              <IconCheck className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-emerald-900">{t('pay.success.title')}</h2>
              <p className="text-sm text-emerald-700">{t('pay.success.body')}</p>
            </div>
          </div>
        </div>
        <div className="space-y-3 p-5 sm:p-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('pay.receipt')}
          </div>
          <Row
            label={t('pay.receipt.amount')}
            value={`${formatSOL(paid.amountSol)} · ${formatMKD(violation.amountDueMKD, lang)}`}
            strong
          />
          <Row label={t('pay.receipt.date')} value={formatDateTime(paid.paidAtIso, lang)} />
          <Row label={t('pay.receipt.network')} value="Solana Devnet" />
          <div>
            <div className="text-sm text-slate-500">{t('pay.receipt.signature')}</div>
            <div className="mt-1 flex items-center gap-2">
              <code className="min-w-0 flex-1 break-all rounded-lg bg-slate-100 px-2.5 py-2 font-mono text-xs text-slate-700">
                {paid.signature}
              </code>
              <button
                type="button"
                onClick={copySig}
                className="shrink-0 rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-50"
                aria-label={t('common.copy')}
              >
                {copied ? (
                  <IconCheck className="h-4 w-4 text-emerald-600" />
                ) : (
                  <IconCopy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-500">{t('pay.receipt.memo')}</div>
            <code className="mt-1 block break-all rounded-lg bg-slate-100 px-2.5 py-2 font-mono text-xs text-slate-700">
              {paid.memo}
            </code>
          </div>
          <a
            href={explorerTxUrl(paid.signature)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            <IconExternal className="h-4 w-4" />
            {t('common.explorer')}
          </a>
          <p className="text-xs text-slate-500">{t('pay.receipt.note')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <IconScale className="h-5 w-5 text-blue-700" />
        <h2 className="text-lg font-bold text-slate-900">{t('pay.title')}</h2>
      </div>

      <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {t('pay.breakdown')}
        </div>
        <Row label={t('pay.base')} value={formatMKD(violation.baseFineMKD, lang)} />
        {discount > 0 && (
          <Row
            label={t('pay.discount')}
            value={`− ${formatMKD(discount, lang)}`}
            accent="text-emerald-600"
          />
        )}
        <div className="my-1 border-t border-dashed border-slate-300" />
        <Row label={t('pay.total')} value={formatMKD(violation.amountDueMKD, lang)} strong />
        <Row label={t('pay.sol')} value={formatSOL(amountSol)} strong accent="text-blue-700" />
        <p className="pt-1 text-xs text-slate-400">{t('pay.rateNote')}</p>
      </div>

      {!connected ? (
        <div className="mt-4 rounded-xl border border-slate-200 p-4 text-center">
          <IconWallet className="mx-auto h-7 w-7 text-slate-400" />
          <div className="mt-2 font-semibold text-slate-800">{t('pay.connect.title')}</div>
          <p className="mt-1 text-sm text-slate-500">{t('pay.connect.body')}</p>
          <div className="mt-3 flex justify-center">
            <WalletMultiButton />
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <span className="flex items-center gap-1.5 text-slate-500">
              <IconWallet className="h-4 w-4" />
              {t('pay.wallet')}
            </span>
            <span className="font-mono font-semibold text-slate-800">
              {publicKey ? shortId(publicKey.toBase58(), 5) : ''}
            </span>
          </div>

          <button
            type="button"
            onClick={handlePay}
            disabled={busy}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3.5 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {busy ? (
              <IconSpinner className="h-5 w-5 animate-spin" />
            ) : (
              <IconBolt className="h-5 w-5" />
            )}
            {status === 'preparing'
              ? t('pay.preparing')
              : status === 'confirming'
                ? t('pay.confirming')
                : t('pay.payNow', { amount: amountSol.toFixed(3) })}
          </button>

          {status === 'error' && errKind && (
            <p className="mt-2 flex items-start gap-1.5 text-sm text-red-600">
              <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{t(`pay.err.${errKind}`)}</span>
            </p>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span>{t('pay.devnetNote')}</span>
        <a
          href={FAUCET_URL}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-blue-700 hover:underline"
        >
          {t('pay.faucet')}
        </a>
      </div>
    </section>
  );
}
