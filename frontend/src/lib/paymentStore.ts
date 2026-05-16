/**
 * Local record of fine payments. The authoritative record lives on the Solana
 * blockchain (the transaction signature); this store only caches it so the UI
 * can show the paid state on return visits without re-querying the chain.
 */
export interface PaymentRecord {
  method: 'crypto' | 'non_crypto';
  receiptId?: string;
  signature?: string;
  paidAtIso: string;
  amountMKD: number;
  amountSol?: number;
  payer?: string;
  memo?: string;
  memoSummary?: string[];
  network?: string;
  provider?: string;
}

const STORAGE_KEY = 'safecity:payments';

function readAll(): Record<string, PaymentRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, PaymentRecord>) : {};
  } catch {
    return {};
  }
}

export function getPayment(code: string): PaymentRecord | null {
  return readAll()[code] ?? null;
}

export function savePayment(code: string, record: PaymentRecord): void {
  const all = readAll();
  all[code] = record;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}
