module.exports = {
  ENV_ID: 'uat',
  BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.uat.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.uat.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['chartingConfigurationTool', 'experimental-page'],
  ADDITIONAL_DATASETS: {},
  ADDITIONAL_ENDPOINTS: {
    '27': {
      'endpoint': 'v1/debt/mspd/mspd_table_1',
      'dateField': 'record_date',
      'downloadName': 'MSPD_SumSecty',
      'dataDisplays': [
        {
          'title': 'By Marketable',
          'dimensionField': 'security_class_desc',
          'filters': [
            {
              'key': 'security_type_desc',
              'value': 'Marketable'
            }
          ]
        },
        {
          'title': 'By Nonmarketable',
          'dimensionField': 'security_class_desc',
          'filters': [
            {
              'key': 'security_type_desc',
              'value': 'Nonmarketable'
            }
          ]
        }
      ],
      "valueFieldOptions": [
        "debt_held_public_mil_amt",
        "intragov_hold_mil_amt",
        "total_mil_amt" ]
    },
    '28': {
      'endpoint': 'v1/debt/mspd/mspd_table_3',
      'dateField': 'record_date',
      'downloadName': 'MSPD_DetailSecty',
      'dataDisplays': [
        {
          'title': 'By Marketable',
          'dimensionField': 'security_class1_desc',
          'filters': [
            {
              'key': 'security_type_desc',
              'value': 'Marketable'
            }
          ]
        },
        {
          'title': 'By Nonmarketable',
          'dimensionField': 'security_class2_desc',
          'filters': [
            {
              'key': 'security_type_desc',
              'value': 'Nonmarketable'
            }
          ]
        }
      ],
      "valueFieldOptions": [
        "issued_amt",
        "inflation_adj_amt",
        "redeemed_amt",
        "outstanding_amt",
        "prior_month_outstanding_amt",
        "current_month_issued_amt",
        "current_month_redeemed_amt",
        "current_month_outstanding_amt"
      ]
    },
    '160': {
      'endpoint': 'v2/accounting/od/balance_sheets',
      'downloadName': 'USFR_BalSheet',
      // 'Pivot View' in UI; 'Pivot View (Field)' and 'Pivot View (Name)' on form
      'dataDisplays': [
        {
          'title': 'By Assets',
          'dimensionField': 'line_item_desc',
          'filters': [
            {
              'key': 'account_desc',
              'value': 'Assets'
            }
          ]
        },
        {
          'title': 'By Liabilities',
          'dimensionField': 'line_item_desc',
          'filters': [
            {
              'key': 'account_desc',
              'value': 'Liabilities'
            }
          ]
        },
        {
          'title': 'By Net Position',
          'dimensionField': 'line_item_desc',
          'filters': [
            {
              'key': 'account_desc',
              'value': 'Net position'
            }
          ]
        }
      ],
      // 'Pivot Value' in UI, 'Pivot Value (Field)' on form
      'valueFieldOptions': [
        'position_bil_amt'
      ]
    },

    // DTS 
    "219": {
      "endpoint": "v1/accounting/dts/operating_cash_balance",
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
    '220': {
      'endpoint': 'v1/accounting/dts/deposits_withdrawals_operating_cash',
      'dateField': 'record_date',
      'downloadName': 'DTS_OpCashDpstWdrl',
      'dataDisplays': [
        { 
          "title": "By Type of Account",
          "dimensionField": "account_type" 
        },
        { 
          "title": "By Transaction Type",
          "dimensionField": "transaction_type" },
      ],
      'valueFieldOptions': [
        'transaction_today_amt',
        'transaction_mtd_amt',
        'transaction_fytd_amt'
      ]
    },
    '221': {
      'endpoint': 'v1/accounting/dts/public_debt_transactions',
      'dateField': 'record_date',
      'downloadName': 'DTS_PubDebtTrans',
      'dataDisplays': [
        { 
          "title": "By Transaction Type",
          "dimensionField": "transaction_type" 
        }
      ],
      'valueFieldOptions': [
        'transaction_today_amt',
        'transaction_mtd_amt',
        'transaction_fytd_amt'
      ]
    },
    '222': {
      'endpoint': 'v1/accounting/dts/adjustment_public_debt_transactions_cash_basis',
      'dateField': 'record_date',
      'downloadName': 'DTS_PubDebtCashAdj',
      'dataDisplays': [
        { 
          "title": "By Transaction Type",
          "dimensionField": "transaction_type" 
        },
        { 
          "title": "By Adjustment Type",
          "dimensionField": "adj_type"
        },
      ],
      'valueFieldOptions': [
        'adj_today_amt',
        'adj_mtd_amt',
        'adj_fytd_amt'
      ]
    },
    '223': {
      'endpoint': 'v1/accounting/dts/debt_subject_to_limit',
      'dateField': 'record_date',
      'downloadName': 'DTS_DebtSubjLim',
      'dataDisplays': [
        {
          "title": "By Debt Category",
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
    '224': {
      'endpoint': 'v1/accounting/dts/federal_tax_deposits',
      'dateField': 'record_date',
      'downloadName': 'DTS_FedTaxDpst',
      'dataDisplays': [
        { 
          "title": "By Federal Tax Deposit Type",
          "dimensionField": "tax_deposit_type"
         },
      ],
      'valueFieldOptions': [
        'tax_deposit_today_amt',
        'tax_deposit_mtd_amt',
        'tax_deposit_fytd_amt'
      ]
    },
    '225': {
      'endpoint': 'v1/accounting/dts/short_term_cash_investments',
      'dateField': 'record_date',
      'downloadName': 'DTS_StCashInvest',
      'dataDisplays': [
        { 
          "title": "By Transaction Type",
          "dimensionField": "transaction_type" 
        },
      ],
      'valueFieldOptions': [
        'depositary_type_a_amt',
        'depositary_type_b_amt',
        'depositary_type_c_amt',
        'total_amt'
      ]
    },
    '226': {
      'endpoint': 'v1/accounting/dts/income_tax_refunds_issued',
      'dateField': 'record_date',
      'downloadName': 'DTS_IncmTaxRfnd',
      'dataDisplays': [
        { 
          "title": "By Federal Tax Refund Type",
          "dimensionField": "tax_refund_type"
        },
        { 
          "title": "By Federal Tax Refund Type Description",
          "dimensionField": "tax_refund_type_desc"
        }
      ],
      'valueFieldOptions': [
        'tax_refund_today_amt',
        'tax_refund_mtd_amt',
        'tax_refund_fytd_amt'
      ]
    },
    '227': {
      'endpoint': 'v1/accounting/dts/inter_agency_tax_transfers',
      'dateField': 'record_date',
      'downloadName': 'DTS_InterAgencyTaxTransfers',
      'dataDisplays': [
        { 
          "title": "By Classification",
          "dimensionField": "classification" 
        }
      ],
      'valueFieldOptions': [
        'today_amt',
        'mtd_amt',
        'fytd_amt'
      ]
    },
  }
};

