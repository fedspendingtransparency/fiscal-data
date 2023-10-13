// handy way to throw an error right from the function signature.
const paramsRequired = () => {
  throw new Error('Both authKey and fetchUtils params are required for authenticatingFetch.');
};

// receives fetchUtil as an argument so that it is not dependent upon browser-provided fetch
// and can therefore be used at build time.
module.exports = (authKey = paramsRequired(), fetchUtil = paramsRequired()) => (url, options) => {
  // consolidate auth header with any options that may be passed in
  options = options === undefined ? {} : options;

  // already have headers property so just, so just add/overwrite 'Authorization'
  if (options.headers) {
    if (options.headers.set) {
      // use formal Headers object property setter if available
      options.headers.set('Authorization', `Basic ${authKey}`);
    } else {
      // otherwise treat headers as simple object
      options.headers['Authorization'] = `Basic ${authKey}`;
    }
  } else {
    if (typeof Headers !== 'undefined') {
      // formal Headers is available so use it and its setter
      options.headers = new Headers();
      options.headers.set('Authorization', `Basic ${authKey}`);
    } else {
      // just use simple object
      options.headers = { Authorization: `Basic ${authKey}` };
    }
  }
  return fetchUtil(url, options);
};
