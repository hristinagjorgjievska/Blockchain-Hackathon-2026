import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const projectRoot = resolve(here, '../..');

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;
  const eq = trimmed.indexOf('=');
  if (eq === -1) return null;
  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  return [key, value];
}

export function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const path = resolve(projectRoot, file);
    if (!existsSync(path)) continue;
    const lines = readFileSync(path, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const parsed = parseEnvLine(line);
      if (!parsed) continue;
      const [key, value] = parsed;
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

export function getConfig() {
  loadEnv();
  return {
    port: Number(process.env.PORT || 8787),
    host: process.env.HOST || '127.0.0.1',
    supabaseUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      '',
    supabaseDemoFallback: process.env.SUPABASE_DEMO_FALLBACK !== 'false',
    publicDemoCodes: process.env.PUBLIC_DEMO_CODES_ENABLED === 'true',
    securityCodePepper: process.env.SECURITY_CODE_PEPPER || 'safecity-mk-dev-code-pepper',
    memoEncryptionKey: process.env.MEMO_ENCRYPTION_KEY || '',
    adminToken: process.env.ADMIN_TOKEN || '',
  };
}
