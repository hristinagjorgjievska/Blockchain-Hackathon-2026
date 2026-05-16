const STORAGE_KEY = 'safecity:appeals';

interface AppealRecord {
  text: string;
  createdAt: string;
}

function readAll(): Record<string, AppealRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, AppealRecord>) : {};
  } catch {
    return {};
  }
}

export function getAppeal(code: string): AppealRecord | null {
  return readAll()[code] ?? null;
}

export function saveAppeal(code: string, text: string): void {
  const all = readAll();
  all[code] = { text, createdAt: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}
