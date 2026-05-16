import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { codeHash } from './pricing.js';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(here, '../.data');
const paymentsFile = resolve(dataDir, 'payments.json');

function ensureDataDir() {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
}

function readPayments() {
  try {
    if (!existsSync(paymentsFile)) return {};
    return JSON.parse(readFileSync(paymentsFile, 'utf8'));
  } catch {
    return {};
  }
}

function writePayments(data) {
  ensureDataDir();
  writeFileSync(paymentsFile, `${JSON.stringify(data, null, 2)}\n`);
}

export function insertLocalPayment(config, code, payment) {
  const hash = codeHash(code, config.securityCodePepper);
  const data = readPayments();
  data[hash] = [payment, ...(data[hash] ?? [])];
  writePayments(data);
  return payment;
}

export function selectLatestLocalPayment(config, code) {
  const hash = codeHash(code, config.securityCodePepper);
  return readPayments()[hash]?.[0] ?? null;
}
