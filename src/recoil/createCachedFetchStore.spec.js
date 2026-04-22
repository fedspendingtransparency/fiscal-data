import { act } from '@testing-library/react';
import { createCachedFetchStore } from './createCachedFetchStore';

describe('createCachedFetchStore', () => {
  const samplePayload = [{ id: 1 }];

  it('initializes with default state', () => {
    const useStore = createCachedFetchStore(jest.fn());
    expect(useStore.getState()).toMatchObject({
      payload: null,
      timeStamp: 0,
      lastCached: 0,
      status: 'idle',
      error: null,
    });
  });

  it('transitions status and populates payload on successful fetch', async () => {
    const fetcher = jest.fn().mockResolvedValue(samplePayload);
    const useStore = createCachedFetchStore(fetcher);

    await act(async () => {
      await useStore.getState().fetch();
    });

    const state = useStore.getState();
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(state.status).toBe('hasValue');
    expect(state.payload).toBe(samplePayload);
    expect(state.lastCached).toBeGreaterThan(0);
    expect(state.error).toBeNull();
  });

  it('records error on failed fetch', async () => {
    const boom = new Error('boom');
    const fetcher = jest.fn().mockRejectedValue(boom);
    const useStore = createCachedFetchStore(fetcher);

    await act(async () => {
      await useStore.getState().fetch();
    });

    const state = useStore.getState();
    expect(state.status).toBe('hasError');
    expect(state.error).toBe(boom);
    expect(state.payload).toBeNull();
  });

  describe('refreshIfStale', () => {
    it('fetches on first call when lastCached is 0', async () => {
      const fetcher = jest.fn().mockResolvedValue(samplePayload);
      const useStore = createCachedFetchStore(fetcher);

      await act(async () => {
        useStore.getState().refreshIfStale();
      });

      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it('fetches when data is older than the refresh interval', async () => {
      const fetcher = jest.fn().mockResolvedValue(samplePayload);
      const refreshIntervalMs = 300000;
      const useStore = createCachedFetchStore(fetcher, refreshIntervalMs);

      useStore.setState({ lastCached: Date.now() - refreshIntervalMs - 1, status: 'hasValue' });

      await act(async () => {
        useStore.getState().refreshIfStale();
      });

      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it('does not fetch when data is still fresh', () => {
      const fetcher = jest.fn().mockResolvedValue(samplePayload);
      const useStore = createCachedFetchStore(fetcher, 300000);

      useStore.setState({ lastCached: Date.now(), status: 'hasValue' });
      useStore.getState().refreshIfStale();

      expect(fetcher).not.toHaveBeenCalled();
    });

    it('does not fetch when a request is already in flight', () => {
      const fetcher = jest.fn().mockResolvedValue(samplePayload);
      const useStore = createCachedFetchStore(fetcher);

      useStore.setState({ status: 'loading' });
      useStore.getState().refreshIfStale();

      expect(fetcher).not.toHaveBeenCalled();
    });
  });
});
