import authenticatingFetch from './authenticating-fetch';

describe('Authenticating fetch in running with access to global Headers (as when ' +
  'running within browser)', () => {

  global.fetch = jest.fn();
  const fetchSpy = jest.spyOn(global, 'fetch');

  const mockSetter = jest.fn();
  class MockHeaders {
    set = mockSetter;
  }

  global.Headers = MockHeaders;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets the Authorization header property of a Headers obj to be the correct ' +
    'authorization header when only a url is provided', () => {
    const myFetch = authenticatingFetch('HereIsMyKey', fetchSpy);
    myFetch('https://www.test.url/');
    expect(mockSetter).toBeCalledWith("Authorization", "Basic HereIsMyKey");
  });

  it('sets the Authorization header property of a Headers obj to be the correct ' +
    'authorization header when an options param is included', () => {
    const myFetch = authenticatingFetch('ThereGoesMyKey', fetchSpy);
    myFetch('https://www.test.url/', {method: 'GET', headers: new MockHeaders()});
    expect(mockSetter).toBeCalledWith("Authorization", "Basic ThereGoesMyKey");
  });
});
