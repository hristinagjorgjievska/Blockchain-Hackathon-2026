import type { Violation } from '../data/violations';
import type { PaymentRecord } from './paymentStore';
import { getLocalStatus } from './violationStatusStore';

export type NftStatus = 'unpaid' | 'paid' | 'voided' | 'appeal_pending';

/**
 * Priority: authority-set terminal states (voided, paid, appeal_pending) >
 * local payment record > local appeal submission > authority 'unpaid' > default.
 *
 * A local payment record overrides a server-side 'unpaid' status so the NFT
 * card reflects the payment immediately, before the backend catches up.
 *
 * Pass `localAppealPending: true` to override from React state rather than
 * reading localStorage — ensures immediate re-render when appeal is submitted.
 */
export function resolveNftStatus(
  violation: Violation,
  paid: PaymentRecord | null,
  localAppealPending?: boolean,
): NftStatus {
  // Terminal authority states — always trust these.
  if (violation.status === 'voided') return 'voided';
  if (violation.status === 'paid') return 'paid';
  if (violation.status === 'appeal_pending') return 'appeal_pending';
  // Local payment overrides server-side 'unpaid'.
  if (paid) return 'paid';
  const isAppealPending = localAppealPending ?? (getLocalStatus(violation.code) === 'appeal_pending');
  if (isAppealPending) return 'appeal_pending';
  return 'unpaid';
}
