module.exports = {
  ENV_ID: 'qat',
  BASE_URL: 'https://qat.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['experimental-page', 'react-table-poc', 'react-table-non-raw-data', 'afg-overview'],
  ADDITIONAL_DATASETS: {},
  USE_MOCK_RELEASE_CALENDAR_DATA_ON_API_FAIL: true,
  ADDITIONAL_ENDPOINTS: {},
  NOTIFICATION_BANNER_TEXT: 'Dataset Page Name',
  NOTIFICATION_BANNER_DISPLAY_PAGES: process.env.GENERAL_ALERT_BANNER_PAGES ? process.env.GENERAL_ALERT_BANNER_PAGES.split(',') : [],
  NOTIFICATION_BANNER_DISPLAY_PATHS: process.env.GENERAL_ALERT_BANNER_PATHS ? process.env.GENERAL_ALERT_BANNER_PATHS.split(',') : [],
};
