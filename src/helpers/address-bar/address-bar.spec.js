import { removeAddressPathQuery, updateAddressPath } from './address-bar';

jest.useFakeTimers();
describe('updateAddressPath', () => {
  const originalWindow = global.window;
  let window;
  beforeEach(() => {
    global.window = { location: { pathname: '' } };
    window = global.window;
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it('updates the location path to specified anchor tag', () => {
    const curId = 'testAnchor';
    const history = window.history;
    let statePath = history.state ? history.state.updatedPath : '';
    expect(statePath).not.toContain(curId);

    expect(updateAddressPath(curId, window.location)).toBeTruthy();
    jest.runAllTimers();

    statePath = history.state ? history.state.updatedPath : '';
    expect(statePath).toContain(curId);
  });

  it('returns null with missing id or location', () => {
    expect(updateAddressPath(null, window.location)).toBeNull();
    expect(updateAddressPath('testAnchor', null)).toBeNull();
  });
});

describe('removeAddressPathQuery', () => {
  const query = '?glossary=apple';
  const path = '/path-name/';

  beforeEach(() => {
    window.history.pushState({}, '', path + query);
    jest.spyOn(window.history, 'replaceState').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('updates the location path to remove the query', () => {
    expect(window.location.search).toBe(query);
    expect(removeAddressPathQuery(window.location)).toBeTruthy();
    jest.runAllTimers();
    expect(window.history.replaceState).toHaveBeenCalledWith('', '', path);
  });

  it('returns null with invalid parameters', () => {
    expect(removeAddressPathQuery({ pathname: undefined, search: undefined })).toBeFalsy();
  });
});
