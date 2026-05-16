import type { Violation } from '../data/violations';
import type { PaymentRecord } from './paymentStore';
import { getLocalStatus } from './violationStatusStore';

export type NftStatus = 'unpaid' | 'paid' | 'voided' | 'appeal_pending';

/**
 * Priority: authority-set status (voided) > local appeal submission > remote
 * payment record > default unpaid.
 *
 * Pass `localAppealPending: true` to override from React state rather than
 * reading localStorage — ensures immediate re-render when appeal is submitted.
 */
export function resolveNftStatus(
  violation: Violation,
  paid: PaymentRecord | null,
  localAppealPending?: boolean,
): NftStatus {
  if (violation.status === 'unpaid') return 'unpaid';
  if (violation.status === 'voided') return 'voided';
  if (violation.status === 'paid') return 'paid';
  if (violation.status === 'appeal_pending') return 'appeal_pending';
  const isAppealPending = localAppealPending ?? (getLocalStatus(violation.code) === 'appeal_pending');
  if (isAppealPending) return 'appeal_pending';
  if (paid) return 'paid';
  return 'unpaid';
}
