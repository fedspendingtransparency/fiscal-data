module.exports = {
  ENV_ID: 'dev',
  API_BASE_URL: 'https://api.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['experimental-page', 'not-found-md', 'apiNKL', 'aboutUsMDX'],
  ADDITIONAL_DATASETS: {},
  USE_MOCK_RELEASE_CALENDAR_DATA_ON_API_FAIL: true
};
