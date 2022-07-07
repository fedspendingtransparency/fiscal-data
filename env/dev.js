module.exports = {
  ENV_ID: 'dev',
  API_BASE_URL: 'https://api.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['experimental-page', 'not-found-md', 'apiNKL', 'aboutUsMDX', 'topics'],
  ADDITIONAL_DATASETS: {
    "015-BFS-2014Q3-038": {
      "seoConfig": {
        "pageTitle": "Federal Borrowings Program: Summary General Ledger Balances Report",
        "description": "A monthly summary report containing outstanding principal " +
          "debt and related interest balances for all borrowing accounts.",
        "keywords": "Debt, Financial Summaries, Interest and " +
          "Exchange Rates, Revenue, Savings Bonds, Spending"
      },
      "topics": [
        "debt",
        "financial-summaries"
      ],
      "relatedDatasets": [
        "015-BFS-2014Q3-037",
        "015-BFS-2014Q1-11",
        "015-BFS-2014Q3-076",
        "015-BFS-2014Q1-03",
        "015-BFS-2014Q1-13",
        "015-BFS-2014Q3-103"
      ],
      "slug": "/fbp-summary-general-ledger-balances-report/",
      "currentDateButton": "byMonth"
    }
  },
  USE_MOCK_RELEASE_CALENDAR_DATA_ON_API_FAIL: true
};
