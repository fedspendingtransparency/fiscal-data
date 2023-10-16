import localStorageHelper from './local-storage-helper';
import globalConstants from '../constants';

describe('Local Storage Helper', () => {
  const staticTestDate = 1487076708000;

  const key = 'testKey',
    key2 = 'testKey2',
    value = 'testValue',
    value2 = 'testValue2';

  beforeAll(() => {
    const values = {};
    window.localStorage.__proto__.setItem = jest.fn().mockImplementation((k, v) => (values[k] = v));
    window.localStorage.__proto__.getItem = jest.fn().mockImplementation(k => (values[k] ? values[k] : null));
    window.localStorage.__proto__.removeItem = jest.fn().mockImplementation(k => delete values[k]);
    jest.spyOn(Date.prototype, 'getTime').mockImplementation(() => staticTestDate);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('set adds a value to storage with default ttl', () => {
    const testValue = JSON.stringify({
      value: value,
      expires: staticTestDate + globalConstants.config.localStorage.ttl,
    });
    localStorageHelper.set(key, value);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(key, testValue);
  });

  it('set adds a value to storage with a null ttl', () => {
    const testValue = JSON.stringify({ value: value, expires: null });
    localStorageHelper.set(key, value, null);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(key, testValue);
  });

  it('set adds a value to storage with a specific ttl', () => {
    const testValue = JSON.stringify({ value: value2, expires: staticTestDate + 5000 });
    localStorageHelper.set(key2, value2, 5000);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(key2, testValue);
  });

  it('gets a value that was added to storage', () => {
    localStorageHelper.set('keyToGet', 'valueToGet');
    const returnValue = localStorageHelper.get('keyToGet');
    expect(returnValue).toEqual('valueToGet');
  });

  it('get returns null if no key or an unknown key', () => {
    expect(localStorageHelper.get('someKey')).toBeNull();
    expect(localStorageHelper.get()).toBeNull();
  });

  it('get returns null if value is expired', () => {
    localStorageHelper.set('keyForExpired', 'valueForExpired', 5000);
    jest.spyOn(Date.prototype, 'getTime').mockImplementation(() => staticTestDate + 50000);
    expect(localStorageHelper.get('keyForExpired')).toBeNull();
  });

  it('remove an item', () => {
    localStorageHelper.set(key, value);
    expect(localStorageHelper.get(key)).toEqual(value);
    localStorageHelper.remove(key);
    expect(localStorageHelper.get(key)).toBeNull();
  });
});
