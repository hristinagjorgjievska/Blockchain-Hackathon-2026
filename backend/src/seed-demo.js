import { getConfig } from './env.js';
import { DEMO_VIOLATIONS } from './demoData.js';
import { deleteViolationsExceptRefs, hasSupabase, upsertViolations } from './supabase.js';

const config = getConfig();

if (!hasSupabase(config)) {
  console.error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.');
  process.exit(1);
}

const rows = await upsertViolations(config, DEMO_VIOLATIONS);
const deleted = await deleteViolationsExceptRefs(
  config,
  DEMO_VIOLATIONS.map((violation) => violation.refId),
);
console.log(
  `Seeded ${rows.length} violation records into Supabase. Removed ${deleted.length} stale records.`,
);
