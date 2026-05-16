import { VIOLATIONS, findViolation, type Violation } from '../data/violations';
import type { PaymentRecord } from './paymentStore';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface DecryptedMemoPayload {
  v: number;
  refId: string;
  codeHash: string;
  amountMKD: number;
  amountSol: number;
  payer: string;
  fingerprint: string | null;
  paidAt: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = (await res.json()) as { error?: string };
      message = body.error ?? message;
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, message);
  }

  return (await res.json()) as T;
}

export async function lookupViolation(code: string): Promise<Violation | null> {
  try {
    const body = await request<{ violation: Violation }>(
      `/api/violations/${encodeURIComponent(code)}`,
    );
    const local = findViolation(code);
    return local
      ? {
          ...local,
          ...body.violation,
          status: body.violation.status ?? local.status,
        }
      : body.violation;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    return findViolation(code) ?? null;
  }
}

export async function listNftViolations(): Promise<Violation[]> {
  try {
    const body = await request<{ violations: Violation[]; source?: string }>('/api/nfts');
    return body.violations.length > 0 ? body.violations : VIOLATIONS;
  } catch {
    return VIOLATIONS;
  }
}

export async function getRemotePayment(code: string): Promise<PaymentRecord | null> {
  try {
    const body = await request<{ payment: PaymentRecord | null }>(
      `/api/payments/${encodeURIComponent(code)}`,
    );
    return body.payment;
  } catch {
    return null;
  }
}

export async function createNonCryptoPayment(code: string): Promise<PaymentRecord> {
  try {
    const body = await request<{ payment: PaymentRecord }>('/api/payments/non-crypto', {
      method: 'POST',
      body: JSON.stringify({ code, method: 'card' }),
    });
    return body.payment;
  } catch {
    // Backend unavailable (Vercel static deploy) — generate a local receipt.
    const violation = findViolation(code);
    const amountMKD = violation
      ? Math.round(violation.baseFineMKD * 0.5)
      : 0;
    return {
      method: 'non_crypto',
      receiptId: `RCP-${Date.now().toString(36).toUpperCase()}`,
      paidAtIso: new Date().toISOString(),
      amountMKD,
      network: 'card',
      provider: 'demo',
    };
  }
}

export async function createEncryptedMemo(input: {
  violation: Violation;
  fingerprint: string | null;
  amountMKD: number;
  amountSol: number;
  payer: string;
}): Promise<{ memo: string; summary: string[] }> {
  try {
    return await request<{ memo: string; summary: string[] }>('/api/memos/encrypt', {
      method: 'POST',
      body: JSON.stringify({
        code: input.violation.code,
        refId: input.violation.refId,
        fingerprint: input.fingerprint,
        amountMKD: input.amountMKD,
        amountSol: input.amountSol,
        payer: input.payer,
      }),
    });
  } catch {
    // Fallback: plaintext memo when backend is unavailable (e.g. Vercel static deploy)
    const memo = `SafeChain|${input.violation.code}|${input.violation.refId}|${input.amountMKD}MKD|${input.amountSol}SOL`;
    return {
      memo,
      summary: ['code', 'refId', 'amountMKD', 'amountSol'],
    };
  }
}

// Parses the plaintext fallback memo written by createEncryptedMemo when the
// backend is unreachable (e.g. Vercel static deploy).
// Format: SafeChain|<code>|<refId>|<amountMKD>MKD|<amountSol>SOL
function parsePlaintextMemo(memo: string): DecryptedMemoPayload {
  const parts = memo.split('|');
  if (parts[0] !== 'SafeChain' || parts.length < 5) throw new Error('Unknown memo format');
  return {
    v: 1,
    refId: parts[2],
    codeHash: '',
    amountMKD: parseFloat(parts[3].replace('MKD', '')),
    amountSol: parseFloat(parts[4].replace('SOL', '')),
    payer: '',
    fingerprint: null,
    paidAt: '',
  };
}

export async function decryptMemo(memo: string): Promise<DecryptedMemoPayload> {
  try {
    const body = await request<{ payload: DecryptedMemoPayload }>('/api/memos/decrypt', {
      method: 'POST',
      body: JSON.stringify({ memo }),
    });
    return body.payload;
  } catch {
    // Backend unavailable (Vercel static deploy) — fall back to local parsing.
    if (memo.startsWith('SafeChain|')) return parsePlaintextMemo(memo);
    throw new Error('Memo could not be decrypted');
  }
}

export async function recordCryptoPayment(input: {
  code: string;
  signature: string;
  amountMKD: number;
  amountSol: number;
  payer: string;
  memo: string;
  memoSummary: string[];
}): Promise<PaymentRecord | null> {
  try {
    const body = await request<{ payment: PaymentRecord }>('/api/payments/crypto', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return body.payment;
  } catch {
    return null;
  }
}
