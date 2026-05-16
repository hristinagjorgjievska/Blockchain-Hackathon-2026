import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { createMemoInstruction } from '@solana/spl-memo';
import { TREASURY_ADDRESS } from './config';

export type PayErrorKind = 'rejected' | 'insufficient' | 'generic';

export class PayError extends Error {
  kind: PayErrorKind;
  constructor(kind: PayErrorKind, message: string) {
    super(message);
    this.kind = kind;
    this.name = 'PayError';
  }
}

function classify(error: unknown): PayError {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();
  if (
    lower.includes('user rejected') ||
    lower.includes('rejected the request') ||
    lower.includes('declined') ||
    lower.includes('cancel')
  ) {
    return new PayError('rejected', message);
  }
  if (
    lower.includes('insufficient') ||
    lower.includes('not enough') ||
    lower.includes('debit an account but found no record')
  ) {
    return new PayError('insufficient', message);
  }
  return new PayError('generic', message);
}

export interface PayFineParams {
  connection: Connection;
  payer: PublicKey;
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>;
  amountSol: number;
  memo: string;
  /** Called once the wallet has submitted the transaction, before confirmation. */
  onSent?: () => void;
}

/**
 * Pays a traffic fine on Solana devnet: a SOL transfer to the SafeChain
 * treasury plus a Memo instruction that records the violation code on-chain.
 * Returns the confirmed transaction signature.
 */
export async function payFine({
  connection,
  payer,
  sendTransaction,
  amountSol,
  memo,
  onSent,
}: PayFineParams): Promise<string> {
  try {
    const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash('confirmed');

    const transaction = new Transaction({
      feePayer: payer,
      blockhash,
      lastValidBlockHeight,
    });
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: TREASURY_ADDRESS,
        lamports,
      }),
      createMemoInstruction(memo, [payer]),
    );

    const signature = await sendTransaction(transaction, connection);
    onSent?.();
    await connection.confirmTransaction(
      { signature, blockhash, lastValidBlockHeight },
      'confirmed',
    );
    return signature;
  } catch (error) {
    throw error instanceof PayError ? error : classify(error);
  }
}
