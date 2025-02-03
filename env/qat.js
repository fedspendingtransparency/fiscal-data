module.exports = {
  ENV_ID: 'qat',
  BASE_URL: 'https://qat.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['experimental-page', 'afg-overview', 'publishedReportsSection', 'dataPreview'],
  ADDITIONAL_DATASETS: {},
  USE_MOCK_RELEASE_CALENDAR_DATA_ON_API_FAIL: true,
  ADDITIONAL_ENDPOINTS: {
    '137': {
      endpoint: 'v1/accounting/od/rates_of_exchange',
      dateField: 'record_date',
      downloadName: 'RprtRateXchg',
      alwaysSortWith: ['-effective_date', 'country'],
      dataDisplays: [
        {
          title: 'Exchange Rate Trend',
        },
      ],
      showChartForCompleteTable: true,
      userFilter: {
        field: 'country_currency_desc',
        label: 'Country-Currency',
        notice: `If current rates deviate from the published rates by 10% or more, Treasury
         will issue amendments to this quarterly report. An amendment to a currency exchange
         rate for the quarter will appear on the report as a separate line with a new effective
         date. The latest available data will display first.`,
        dataUnmatchedMessage: `This may be because the currency existed under a different
          name for that time period. Please check to see if the currency you are
          looking for appears under a different name, or change the date
          selected for available results.`,
      },
      selectColumns: ['record_date', 'country_currency_desc', 'exchange_rate', 'effective_date'],
    },
  },
};
