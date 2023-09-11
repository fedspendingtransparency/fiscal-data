module.exports = {
  ENV_ID: 'stg',
  BASE_URL: 'https://stg.fiscaldata.treasury.gov',
  // Api data in staging is incomplete and will throw page breaking errors on our site
  API_BASE_URL: 'https://api.stg.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://stg.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.stg.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['experimental-page'],
  EXCLUDED_PAGE_PATHS: [],
  ADDITIONAL_ENDPOINTS: {},
};
