const STORAGE_KEY = 'safecity:violation_status';

type LocalStatus = 'appeal_pending';

function readAll(): Record<string, LocalStatus> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, LocalStatus>) : {};
  } catch {
    return {};
  }
}

export function getLocalStatus(code: string): LocalStatus | null {
  return readAll()[code] ?? null;
}

export function setLocalStatus(code: string, status: LocalStatus): void {
  const all = readAll();
  all[code] = status;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}
