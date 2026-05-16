import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { createServer } from 'node:http';
import { getConfig } from './env.js';
import { DEMO_VIOLATIONS } from './demoData.js';
import { insertLocalPayment, selectLatestLocalPayment } from './localStore.js';
import { amountDueNowMKD, canonicalCode, codeHash, isValidCodeFormat } from './pricing.js';
import {
  hasSupabase,
  checkDatabase,
  insertPayment,
  selectLatestPayment,
  selectViolationByCode,
  selectViolations,
} from './supabase.js';

const config = getConfig();

function send(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  });
  res.end(payload);
}

function notFound(res) {
  send(res, 404, { error: 'Not found' });
}

function readJson(req) {
  return new Promise((resolveJson, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 128_000) {
        req.destroy();
        reject(new Error('Request body is too large'));
      }
    });
    req.on('end', () => {
      if (!raw) {
        resolveJson({});
        return;
      }
      try {
        resolveJson(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

async function findViolation(code) {
  if (!isValidCodeFormat(code)) return null;
  const target = canonicalCode(code);

  if (hasSupabase(config)) {
    try {
      const violation = await selectViolationByCode(config, code);
      if (violation) {
        const demo = DEMO_VIOLATIONS.find(
          (v) => v.refId === violation.refId || canonicalCode(v.code) === target,
        );
        return demo
          ? {
              ...demo,
              ...violation,
              code: violation.code ?? demo.code,
              status: violation.status ?? demo.status,
            }
          : violation;
      }
    } catch (error) {
      console.warn('Supabase violation lookup failed:', error.message);
    }
  }

  if (!config.supabaseDemoFallback) return null;
  return DEMO_VIOLATIONS.find((v) => canonicalCode(v.code) === target) ?? null;
}

function hydrateListedViolation(violation) {
  const demo = DEMO_VIOLATIONS.find((v) => v.refId === violation.refId);
  if (demo) {
    return {
      ...demo,
      ...violation,
      code: violation.code ?? demo.code,
      status: violation.status ?? demo.status,
    };
  }
  return violation.code ? violation : null;
}

async function listViolations() {
  if (hasSupabase(config)) {
    try {
      const violations = await selectViolations(config);
      const listed = violations.map(hydrateListedViolation).filter((violation) => violation?.code);
      if (listed.length > 0) {
        return { violations: listed, source: 'supabase' };
      }
    } catch (error) {
      console.warn('Supabase violation list failed:', error.message);
    }
  }

  if (!config.supabaseDemoFallback) return { violations: [], source: 'none' };
  return { violations: DEMO_VIOLATIONS, source: 'demo-fallback' };
}

function receiptId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `SCMK-${date}-${randomBytes(4).toString('hex').toUpperCase()}`;
}

function base64url(buffer) {
  return Buffer.from(buffer).toString('base64url');
}

function fromBase64url(value) {
  return Buffer.from(value, 'base64url');
}

function memoKey() {
  const raw = config.memoEncryptionKey || config.securityCodePepper;
  if (/^[a-f0-9]{64}$/i.test(raw)) return Buffer.from(raw, 'hex');
  try {
    const fromB64 = Buffer.from(raw, 'base64url');
    if (fromB64.length === 32) return fromB64;
  } catch {
    /* ignore */
  }
  return createHash('sha256').update(raw).digest();
}

function hasAdminAccess(req) {
  if (!config.adminToken) return true;
  const auth = req.headers.authorization ?? '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
  return bearer === config.adminToken || req.headers['x-admin-token'] === config.adminToken;
}

function encryptMemo(body) {
  const summary = ['refId', 'codeHash', 'amountMKD', 'amountSol', 'payer', 'fingerprint', 'paidAt'];
  const payload = {
    v: 1,
    refId: body.refId,
    codeHash: codeHash(body.code, config.securityCodePepper),
    amountMKD: body.amountMKD,
    amountSol: body.amountSol,
    payer: body.payer,
    fingerprint: body.fingerprint ?? null,
    paidAt: new Date().toISOString(),
  };
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', memoKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return {
    memo: `SCMK1.${base64url(iv)}.${base64url(encrypted)}.${base64url(tag)}`,
    summary,
  };
}

function decryptMemo(memo) {
  const [version, ivText, encryptedText, tagText] = String(memo ?? '').split('.');
  if (version !== 'SCMK1' || !ivText || !encryptedText || !tagText) {
    throw new Error('Invalid encrypted memo format');
  }
  const decipher = createDecipheriv('aes-256-gcm', memoKey(), fromBase64url(ivText));
  decipher.setAuthTag(fromBase64url(tagText));
  const decrypted = Buffer.concat([
    decipher.update(fromBase64url(encryptedText)),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString('utf8'));
}

async function handlePaymentPersist(code, payment) {
  if (!hasSupabase(config)) return insertLocalPayment(config, code, payment);
  try {
    return await insertPayment(config, code, payment);
  } catch (error) {
    console.warn('Supabase payment insert failed:', error.message);
    return insertLocalPayment(config, code, payment);
  }
}

async function route(req, res) {
  if (req.method === 'OPTIONS') {
    send(res, 200, { ok: true });
    return;
  }

  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  if (req.method === 'GET' && url.pathname === '/api/health') {
    let databaseReady = false;
    let databaseError = null;
    if (hasSupabase(config)) {
      try {
        databaseReady = await checkDatabase(config);
      } catch (error) {
        databaseError = error.message;
      }
    }
    send(res, 200, {
      ok: true,
      supabaseConfigured: hasSupabase(config),
      databaseReady,
      databaseError,
      demoFallback: config.supabaseDemoFallback,
      memoEncryption: 'aes-256-gcm',
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/demo-codes') {
    send(res, 200, {
      codes: config.publicDemoCodes ? DEMO_VIOLATIONS.map((v) => v.code) : [],
    });
    return;
  }

  if (req.method === 'GET' && (url.pathname === '/api/nfts' || url.pathname === '/api/violations')) {
    const { violations, source } = await listViolations();
    send(res, 200, { violations, source });
    return;
  }

  const violationMatch = url.pathname.match(/^\/api\/violations\/([^/]+)$/);
  if (req.method === 'GET' && violationMatch) {
    const code = decodeURIComponent(violationMatch[1]);
    const violation = await findViolation(code);
    if (!violation) {
      send(res, 404, { error: 'Violation not found' });
      return;
    }
    send(res, 200, { violation });
    return;
  }

  const paymentMatch = url.pathname.match(/^\/api\/payments\/([^/]+)$/);
  if (req.method === 'GET' && paymentMatch) {
    const code = decodeURIComponent(paymentMatch[1]);
    if (!isValidCodeFormat(code)) {
      send(res, 400, { error: 'Invalid code' });
      return;
    }
    if (!hasSupabase(config)) {
      send(res, 200, { payment: selectLatestLocalPayment(config, code) });
      return;
    }
    try {
      const payment = await selectLatestPayment(config, code);
      send(res, 200, { payment: payment ?? selectLatestLocalPayment(config, code) });
    } catch (error) {
      console.warn('Supabase payment lookup failed:', error.message);
      send(res, 200, { payment: selectLatestLocalPayment(config, code) });
    }
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/memos/encrypt') {
    const body = await readJson(req);
    if (!isValidCodeFormat(body.code) || !body.refId || !body.payer) {
      send(res, 400, { error: 'Missing memo fields' });
      return;
    }
    send(res, 200, encryptMemo(body));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/memos/decrypt') {
    if (!hasAdminAccess(req)) {
      send(res, 401, { error: 'Admin token required' });
      return;
    }
    const body = await readJson(req);
    try {
      send(res, 200, { payload: decryptMemo(body.memo) });
    } catch (error) {
      send(res, 400, { error: error.message || 'Unable to decrypt memo' });
    }
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/payments/non-crypto') {
    const body = await readJson(req);
    const violation = await findViolation(body.code);
    if (!violation) {
      send(res, 404, { error: 'Violation not found' });
      return;
    }
    const payment = await handlePaymentPersist(violation.code, {
      method: 'non_crypto',
      receiptId: receiptId(),
      paidAtIso: new Date().toISOString(),
      amountMKD: amountDueNowMKD(violation),
      provider: body.method === 'bank' ? 'official-bank-transfer' : 'official-card-bank',
    });
    send(res, 200, { payment });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/payments/crypto') {
    const body = await readJson(req);
    const violation = await findViolation(body.code);
    if (!violation) {
      send(res, 404, { error: 'Violation not found' });
      return;
    }
    if (!body.signature || !body.payer || !body.memo) {
      send(res, 400, { error: 'Missing crypto payment fields' });
      return;
    }
    const payment = await handlePaymentPersist(violation.code, {
      method: 'crypto',
      signature: body.signature,
      paidAtIso: new Date().toISOString(),
      amountMKD: Number(body.amountMKD || amountDueNowMKD(violation)),
      amountSol: Number(body.amountSol || 0),
      payer: body.payer,
      memo: body.memo,
      memoSummary: body.memoSummary ?? [],
      network: 'Solana Devnet',
    });
    send(res, 200, { payment });
    return;
  }

  notFound(res);
}

const server = createServer((req, res) => {
  route(req, res).catch((error) => {
    console.error(error);
    send(res, 500, { error: error.message || 'Internal server error' });
  });
});

server.listen(config.port, config.host, () => {
  console.log(`SafeChain backend listening on http://${config.host}:${config.port}`);
});
