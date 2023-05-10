import { removeAddressPathQuery, updateAddressPath } from './address-bar';

jest.useFakeTimers();
describe('updateAddressPath', () => {

  const originalWindow = global.window;
  let window;
  beforeEach(() => {
    global.window = {location: {pathname: ''}};
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

});

describe('removeAddressPathQuery', () => {

  const query = '?glossary=apple';
  const path = '/path-name/';
  const mockPathname = jest.fn();
  const mockSearch= jest.fn();
  const mockHistory = jest.fn();
  beforeEach(() => {

    Object.defineProperty(window, 'location', {
      value: {
        get pathname() {
          return mockPathname();
        },
        get search() {
          return mockSearch();
        }
      }
    });
    Object.defineProperty(window, 'history', {
      value: {
        get state() {
          return mockHistory();
        }
      }
    })
    window.history.replaceState = jest.fn();
  });

  it('updates the location path to remove the query', () => {
    mockPathname.mockReturnValue(path);
    mockSearch.mockReturnValue(query);
    mockHistory.mockReturnValue(`${path+query}`);
    const history = window.history;
    expect(history.state).toContain(query);

    expect(removeAddressPathQuery(window.location)).toBeTruthy();
    jest.runAllTimers();

    expect(window.history.replaceState).toHaveBeenCalledWith('','', path);
  });

  it('returns null with invalid parameters', () => {
    mockPathname.mockReturnValue(undefined);
    mockSearch.mockReturnValue(undefined);
    mockHistory.mockReturnValue(undefined);
    expect(removeAddressPathQuery(window.location)).toBeFalsy();
  })

});

