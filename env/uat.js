module.exports = {
  ENV_ID: 'uat',
  BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.uat.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.uat.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['experimental-page', 'afg-overview', 'publishedReportsSection', 'dataPreview'],
  ADDITIONAL_DATASETS: {
    '015-BFS-2014Q3-052': {
      slug: '/top-treasury-offset-program/',
      seoConfig: {
        pageTitle: 'Treasury Offset Program (TOP)',
        description:
          'This dataset shows how Treasury offsets federal payments, such as tax refunds, to ' +
          'pay off delinquent debts such as unpaid child support.',
        keywords: 'Debt, Revenue',
      },
      topics: ['debt', 'revenue'],
      relatedDatasets: ['015-BFS-2020Q4-xx', '015-BFS-2014Q1-03', '015-BFS-2014Q1-13', '015-BFS-2017Q2-003'],
      currentDateButton: 'byMonth',
    },
  },
  ADDITIONAL_ENDPOINTS: {
    '160': {
      endpoint: 'v2/accounting/od/balance_sheets',
      downloadName: 'USFR_BalSheet',
      // 'Pivot View' in UI; 'Pivot View (Field)' and 'Pivot View (Name)' on form
      dataDisplays: [
        {
          title: 'By Assets',
          dimensionField: 'line_item_desc',
          filters: [
            {
              key: 'account_desc',
              value: 'Assets',
            },
          ],
        },
        {
          title: 'By Liabilities',
          dimensionField: 'line_item_desc',
          filters: [
            {
              key: 'account_desc',
              value: 'Liabilities',
            },
          ],
        },
        {
          title: 'By Net Position',
          dimensionField: 'line_item_desc',
          filters: [
            {
              key: 'account_desc',
              value: 'Net position',
            },
          ],
        },
      ],
      // 'Pivot Value' in UI, 'Pivot Value (Field)' on form
      valueFieldOptions: ['position_bil_amt'],
    },
    '299': {
      endpoint: 'v1/debt/treasury_offset_program',
      dateField: 'record_date',
      downloadName: 'treasury_offset_program',
      alwaysSortWith: ['-record_date', 'src_line_nbr'],
      selectColumns: [],
    },
    // TRRE Clean
    '318': {
      endpoint: 'v1/accounting/od/rates_of_exchange_clean_values',
      dateField: 'record_date',
      downloadName: 'RprtRateXchgCln',
      alwaysSortWith: ['-record_date', 'country_currency_desc'],
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
