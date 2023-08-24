module.exports = {
  ENV_ID: 'qat',
  BASE_URL: 'https://qat.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['chartingConfigurationTool', 'experimental-page', 'react-table-poc'],
  ADDITIONAL_DATASETS: {},
  USE_MOCK_RELEASE_CALENDAR_DATA_ON_API_FAIL: true,
  ADDITIONAL_ENDPOINTS: {
    "129": {
      "endpoint": "v1/accounting/dts/dts_table_1",
      "dateField": "record_date",
      "downloadName": "DTS_OpCashBal",
      "dataDisplays": [
        {
          "title": "By Type of Account",
          "dimensionField": "account_type",
          "lastRowSnapshot": true,
          "filters": [
            {
              "key": "account_type",
              "operator": "eq",
              "value": "Treasury General Account (TGA) Opening Balance"
            }
          ]
        }
      ],
      "valueFieldOptions": [
        "open_today_bal",
        "open_month_bal",
        "open_fiscal_year_bal"
      ]
    },
    '130': {
      'endpoint': 'v1/accounting/dts/dts_table_2',
      'dateField': 'record_date',
      'downloadName': 'DTS_OpCashDpstWdrl',
      'dataDisplays': [
        { 'dimensionField': 'account_type' },
        { 'dimensionField': 'transaction_type' },
      ],
      'valueFieldOptions': [
        'transaction_today_amt',
        'transaction_mtd_amt',
        'transaction_fytd_amt'
      ]
    },
    '131': {
      'endpoint': 'v1/accounting/dts/dts_table_3a',
      'dateField': 'record_date',
      'downloadName': 'DTS_PubDebtTrans',
      'dataDisplays': [
        { 'dimensionField': 'transaction_type' },
      ],
      'valueFieldOptions': [
        'transaction_today_amt',
        'transaction_mtd_amt',
        'transaction_fytd_amt'
      ]
    },
    '132': {
      'endpoint': 'v1/accounting/dts/dts_table_3b',
      'dateField': 'record_date',
      'downloadName': 'DTS_PubDebtCashAdj',
      'dataDisplays': [
        { 'dimensionField': 'transaction_type' },
        { 'dimensionField': 'adj_type' },
      ],
      'valueFieldOptions': [
        'adj_today_amt',
        'adj_mtd_amt',
        'adj_fytd_amt'
      ]
    },
    '133': {
      'endpoint': 'v1/accounting/dts/dts_table_3c',
      'dateField': 'record_date',
      'downloadName': 'DTS_DebtSubjLim',
      'dataDisplays': [
        {
          'dimensionField': 'debt_catg',
          'lastRowSnapshot': true
        },
      ],
      'valueFieldOptions': [
        'close_today_bal',
        'open_today_bal',
        'open_month_bal',
        'open_fiscal_year_bal'
      ]
    },
    '134': {
      'endpoint': 'v1/accounting/dts/dts_table_4',
      'dateField': 'record_date',
      'downloadName': 'DTS_FedTaxDpst',
      'dataDisplays': [
        { 'dimensionField': 'tax_deposit_type' },
      ],
      'valueFieldOptions': [
        'tax_deposit_today_amt',
        'tax_deposit_mtd_amt',
        'tax_deposit_fytd_amt'
      ]
    },
    '135': {
      'endpoint': 'v1/accounting/dts/dts_table_5',
      'dateField': 'record_date',
      'downloadName': 'DTS_StCashInvest',
      'dataDisplays': [
        { 'dimensionField': 'transaction_type' },
      ],
      'valueFieldOptions': [
        'depositary_type_a_amt',
        'depositary_type_b_amt',
        'depositary_type_c_amt',
        'total_amt'
      ]
    },
    '136': {
      'endpoint': 'v1/accounting/dts/dts_table_6',
      'dateField': 'record_date',
      'downloadName': 'DTS_IncmTaxRfnd',
      'dataDisplays': [
        { 'dimensionField': 'tax_refund_type' },
        { 'dimensionField': 'tax_refund_type_desc' }
      ],
      'valueFieldOptions': [
        'tax_refund_today_amt',
        'tax_refund_mtd_amt',
        'tax_refund_fytd_amt'
      ]
    },
  },
  NOTIFICATION_BANNER_TEXT: 'Dataset Page Name',
  NOTIFICATION_BANNER_DISPLAY_PAGES: ['/experimental/'],
  NOTIFICATION_BANNER_DISPLAY_PATHS: [],
}
