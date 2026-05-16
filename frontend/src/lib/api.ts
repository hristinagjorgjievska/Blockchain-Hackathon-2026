import { findViolation, type Violation } from '../data/violations';
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
    return body.violation;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    return findViolation(code) ?? null;
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
  const body = await request<{ payment: PaymentRecord }>('/api/payments/non-crypto', {
    method: 'POST',
    body: JSON.stringify({ code, method: 'card' }),
  });
  return body.payment;
}

export async function createEncryptedMemo(input: {
  violation: Violation;
  fingerprint: string | null;
  amountMKD: number;
  amountSol: number;
  payer: string;
}): Promise<{ memo: string; summary: string[] }> {
  return request<{ memo: string; summary: string[] }>('/api/memos/encrypt', {
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
}

export async function decryptMemo(memo: string): Promise<DecryptedMemoPayload> {
  const body = await request<{ payload: DecryptedMemoPayload }>('/api/memos/decrypt', {
    method: 'POST',
    body: JSON.stringify({ memo }),
  });
  return body.payload;
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
