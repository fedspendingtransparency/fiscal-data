import { create } from 'zustand';

const DEFAULT_REFRESH_INTERVAL_MS = 300000;

export const createCachedFetchStore = (fetcher, refreshIntervalMs = DEFAULT_REFRESH_INTERVAL_MS) =>
  create((set, get) => ({
    payload: null,
    timeStamp: 0,
    lastCached: 0,
    status: 'idle',
    error: null,
    fetch: async () => {
      set({ status: 'loading' });
      try {
        const payload = await fetcher();
        const now = Date.now();
        set({ payload, timeStamp: now, lastCached: now, status: 'hasValue', error: null });
      } catch (error) {
        set({ status: 'hasError', error });
      }
    },
    refreshIfStale: () => {
      const { lastCached, status, fetch } = get();
      if (status === 'loading') return;
      const now = Date.now();
      if (lastCached === 0 || now - lastCached >= refreshIntervalMs) {
        fetch();
      }
    },
  }));
