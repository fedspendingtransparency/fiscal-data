import authenticatingFetch from './authenticating-fetch';

describe('Authenticating fetch in running without access to global Headers ' +
  '(as in build-time)', () => {

  global.fetch = jest.fn();
  const fetchSpy = jest.spyOn(global, 'fetch');

  global.Headers = undefined;

  it('returns a fetch function that includes adds the correct authorization header when ' +
    'only a url is provided.', () => {
    const myFetch = authenticatingFetch('HereIsMyKey', fetchSpy);
    myFetch('https://www.test.url/');
    expect(fetchSpy)
      .toBeCalledWith("https://www.test.url/",
        { "headers": { "Authorization": "Basic HereIsMyKey" } });
    jest.resetAllMocks();
  });

  it('returns a fetch function that includes adds the correct authorization header when a ' +
    'url and an options param are provided.', () => {
    const myFetch = authenticatingFetch('HereIsMyKey', fetchSpy);
    myFetch('https://www.test.url/', { method: 'GET' });
    expect(fetchSpy).toBeCalledWith("https://www.test.url/", {
      method: "GET",
      "headers": { "Authorization": "Basic HereIsMyKey" }
    });
    jest.resetAllMocks();
  });

  it('returns a fetch function that includes adds the correct authorization header when ' +
    'only a url is provided and other options are provided including a simple object ' +
    'for headers.', () => {
    const myFetch = authenticatingFetch('HereIsMyKey', fetchSpy);
    myFetch('https://www.test.url/',
      { method: 'GET', headers: { 'Accept-Encoding': 'x-compress; x-zip' } });
    expect(fetchSpy).toBeCalledWith("https://www.test.url/", {
      method: "GET",
      "headers": { "Accept-Encoding": "x-compress; x-zip", "Authorization": "Basic HereIsMyKey" }
    });
    jest.resetAllMocks();
  });


  it('throws an error when called without both arguments.', () => {
    expect(() => {authenticatingFetch('HereIsMyKey');}).toThrow();
    expect(() => {authenticatingFetch();}).toThrow();
  });
});
