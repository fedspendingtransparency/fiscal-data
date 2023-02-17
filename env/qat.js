module.exports = {
  ENV_ID: 'qat',
  BASE_URL: 'https://qat.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['chartingConfigurationTool', 'experimental-page'],
  ADDITIONAL_DATASETS: {
    "015-BFS-2014Q3-040": {
      "seoConfig": {
        "pageTitle": "Treasury Managed Accounts",
        "description": "Balances of Contract Disputes Receivables, "
          + "No FEAR Act Receivables, and Unclaimed Money for Treasury Managed Accounts.",
        "keywords": "Financial Summaries"
      },
      "topics": [
        "financial-summaries"
      ],
      "relatedDatasets": [
        "015-BFS-2014Q3-105",
        "015-BFS-2014Q1-07",
        "015-BFS-2014Q1-13"
      ],
      "slug": "/treasury-managed-accounts/",
      "currentDateButton": "byMonth"
    }
  },
  USE_MOCK_RELEASE_CALENDAR_DATA_ON_API_FAIL: true,
  ADDITIONAL_ENDPOINTS: {}
}
