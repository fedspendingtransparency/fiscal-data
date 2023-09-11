module.exports = {
  ENV_ID: 'dev',
  BASE_URL: 'https://dev.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.dev.fiscaldata.treasury.gov',
  AUTHENTICATE_API: true,
  DATA_DOWNLOAD_BASE_URL: 'https://dev.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.dev.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: [
    'experimental-page',
    'not-found-md',
    'apiNKL',
    'aboutUsMDX',
    'spending-trends-chart',
    'revenue-trends-section',
  ],
  ADDITIONAL_DATASETS: {},
  USE_MOCK_RELEASE_CALENDAR_DATA_ON_API_FAIL: true,
  ADDITIONAL_ENDPOINTS: {},
};
