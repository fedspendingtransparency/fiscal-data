module.exports = {
  ENV_ID: 'uat',
  BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.uat.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.uat.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['experimental-page', 'afg-overview', 'publishedReportsSection', 'dataPreview'],
  ADDITIONAL_DATASETS: {},
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
    '139': {
      endpoint: 'v1/debt/mspd/mspd_table_3_market',
      dateField: 'record_date',
      downloadName: 'MSPD_MktSecty',
      dataDisplays: [
        {
          title: 'By Security Class',
          dimensionField: 'security_class1_desc',
          roundingDenomination: 'millions',
          filters: [
            {
              key: 'security_class2_desc',
              operator: 'in',
              value:
                'null,Total Treasury Bills,Total Treasury Bonds,Total Treasury Floating ' +
                'Rate Notes,Total Tresasury Floating Rate Notes,Treasury Floating Rate Notes,Total Treasury Inflation-Indexed ' +
                'Bonds,Total Treasury Inflation-Indexed Notes,Total Treasury Inflation-Protected ' +
                'Securities,Total Treasury TIPS,Total Treasury Notes,',
            },
            {
              key: 'security_class1_desc',
              operator: 'neq',
              value: 'Total Marketable',
            },
          ],
        },
        {
          title: 'Bonds by Maturity',
          dimensionField: 'security_class2_desc',
          roundingDenomination: 'millions',
          filters: [
            {
              key: 'security_class2_desc',
              operator: 'in',
              value: 'Total Matured Treasury Bonds,Total Unmatured Treasury Bonds',
            },
          ],
        },
        {
          title: 'Inflation-Protected Securities by Class',
          dimensionField: 'security_class2_desc',
          roundingDenomination: 'millions',
          filters: [
            {
              key: 'security_class2_desc',
              operator: 'in',
              value:
                'Total Treasury Inflation-Indexed Bonds,Total Treasury Inflation-Indexed ' +
                'Notes,Total Treasury Inflation-Protected Securities,Total Treasury TIPS',
            },
          ],
        },
        {
          title: 'Notes by Maturity',
          dimensionField: 'security_class2_desc',
          roundingDenomination: 'millions',
          filters: [
            {
              key: 'security_class2_desc',
              operator: 'in',
              value: 'Total Matured Treasury Notes,Total Unmatured Treasury Notes',
            },
          ],
        },
      ],
      valueFieldOptions: ['issued_amt', 'outstanding_amt', 'redeemed_amt'],
      selectColumns: [
        'record_date',
        'security_type_desc',
        'security_class1_desc',
        'security_class2_desc',
        'series_cd',
        'interest_rate_pct',
        'yield_pct',
        'issue_date',
        'maturity_date',
        'interest_pay_date_1',
        'interest_pay_date_2',
        'interest_pay_date_3',
        'interest_pay_date_4',
        'issued_amt',
        'inflation_adj_amt',
        'redeemed_amt',
        'outstanding_amt',
      ],
    },
  },
};
