import { getCache, makeKey, __clearLocalCacheMemoryForTests } from './filter-reports-cache';

describe('local-cache helper', () => {
  const KEY = makeKey('opts', 'datasetA', 'endpoint', 'field');

  beforeEach(() => {
    localStorage.clear();
    __clearLocalCacheMemoryForTests();
    jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('hydrates memory from localStorage', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        v: ['X'],
        exp: Date.now() + 60_000,
      })
    );

    expect(getCache(KEY)).toEqual(['X']);
    localStorage.clear();
    expect(getCache(KEY)).toEqual(['X']);
  });

  it('removes expired localStorage entry and returns null', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        v: ['Z'],
        exp: Date.now() + 1_000,
      })
    );

    jest.spyOn(Date, 'now').mockReturnValue(1_700_000_002_500);
    expect(getCache(KEY)).toBeNull();
    expect(localStorage.getItem(KEY)).toBeNull();
  });
});
