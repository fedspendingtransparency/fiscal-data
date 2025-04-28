module.exports = {
  ENV_ID: 'dev',
  BASE_URL: 'https://dev.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.dev.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://dev.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.dev.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['experimental-page', 'not-found-md', 'apiNKL', 'aboutUsMDX', 'publishedReportsSection', 'chartingConfigurationTool'],
  ADDITIONAL_DATASETS: {
    '015-BFS-2025Q2-002': {
      slug: '/monthly-treasury-disbursements/',
      hideRawDataTable: true,
      seoConfig: {
        pageTitle: 'Monthly Treasury Disbursements',
        description: '?',
        keywords: '',
      },
      topics: [],
    },
  },
  USE_MOCK_RELEASE_CALENDAR_DATA_ON_API_FAIL: true,
  ADDITIONAL_ENDPOINTS: {
    322: {
      endpoint: '',
    },
  },
};
