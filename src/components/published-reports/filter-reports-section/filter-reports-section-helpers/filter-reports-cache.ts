export type CacheEntry<T> = { value: T; expiresAt: number };
const memory = new Map<string, CacheEntry<any>>();

export const makeKey = (...parts: string[]) => `frs:${parts.join('|')}`;

export const getCache = <T>(key: string): T | null => {
  const now = Date.now();

  const getMemory = memory.get(key);
  if (getMemory) {
    if (!getMemory.expiresAt || getMemory.expiresAt > now) return getMemory.value as T;
    memory.delete(key);
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed: CacheEntry<T> = JSON.parse(raw);

    if (parsed.expiresAt && parsed.expiresAt <= now) {
      localStorage.removeItem(key);
      return null;
    }

    memory.set(key, parsed); // hydrate memory
    return parsed.value;
  } catch {
    return null;
  }
};

export const setCache = <T>(key: string, value: T, ttlMs = 0) => {
  const entry: CacheEntry<T> = { value, expiresAt: ttlMs ? Date.now() + ttlMs : 0 };
  memory.set(key, entry);
  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {}
};
