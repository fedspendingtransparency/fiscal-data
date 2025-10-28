type CacheEntry<T> = { value: T; exp: number };
const memoryCache = new Map<string, CacheEntry<any>>();

const parseEntry = <T>(raw: string): CacheEntry<T> | null => {
  try {
    const parsed = JSON.parse(raw) || {};
    const value = (parsed.v ?? parsed.value) as T;
    const exp = Number(parsed.exp ?? parsed.expiresAt ?? 0);
    if (value === undefined) return null;
    return { value, exp };
  } catch {
    return null;
  }
};

export const getCache = <T>(key: string): T | null => {
  if (memoryCache.has(key)) {
    const { value, exp } = memoryCache.get(key);
    if (!exp || exp > Date.now()) return value as T;
    memoryCache.delete(key);
  }
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  const entry = parseEntry<T>(raw);
  if (!entry) return null;

  const { value, exp } = entry;
  if (exp && exp <= Date.now()) {
    localStorage.removeItem(key);
    return null;
  }
  memoryCache.set(key, { value, exp });
  return value;
};

export const setCache = <T>(key: string, value: T, ttlMs = 1000 * 60 * 60) => {
  const exp = ttlMs ? Date.now() + ttlMs : 0;
  const entry: CacheEntry<T> = { value: value, exp };
  memoryCache.set(key, entry);
  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {}
};

export const makeKey = (...parts: string[]) => `frs:${parts.join('|')}`;
export const __clearLocalCacheMemoryForTests = () => memoryCache.clear();
