import { clusterApiUrl, PublicKey } from '@solana/web3.js';

export const SOLANA_CLUSTER = 'devnet' as const;
export const RPC_ENDPOINT = clusterApiUrl('devnet');

/**
 * Public address of the Safe City MK fine-collection account on Solana devnet.
 * Only the public key is used — the app never spends from this account, it only
 * receives fine payments so that settlement can be verified on-chain by anyone.
 */
export const TREASURY_ADDRESS = new PublicKey('CRQ3vWquPewjJhfvuJFVWiW1qkwoSD94W694SjkU6JuM');

/** Demo conversion rate used to price MKD fines in SOL on devnet. */
export const MKD_PER_SOL = 100_000;

export const FAUCET_URL = 'https://faucet.solana.com/';

export function explorerTxUrl(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}

export function explorerAddressUrl(address: string): string {
  return `https://explorer.solana.com/address/${address}?cluster=devnet`;
}

/** Convert a MKD fine amount into the SOL amount payable on devnet. */
export function mkdToSol(mkd: number): number {
  return Math.round((mkd / MKD_PER_SOL) * 1e6) / 1e6;
}
