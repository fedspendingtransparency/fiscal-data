module.exports = {
  ENV_ID: 'uat',
  BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.uat.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.uat.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['chartingConfigurationTool', 'experimental-page'],
  ADDITIONAL_DATASETS: {
    "015-BFS-2014Q3-041": {
      "seoConfig": {
        "pageTitle": "Annual Interest Rate Certification",
        "description": "Interest rates certified by the U.S. Department of the Treasury for various statutory purposes.",
        "keywords": "Interest and Exchange Rates"
      },
      "topics": [
        "interest-exchange-rates"
      ],
      "relatedDatasets": [
        "015-BFS-2014Q3-042",
        "015-BFS-2014Q3-043"
      ],
      "slug": "/treasury-certified-interest-rates-annual/",
      "currentDateButton": "byMonth"
    },
    "015-BFS-2014Q3-044": {
      "seoConfig": {
        "pageTitle": "Monthly Interest Rate Certification",
        "description": "Interest rates certified by the U.S. Department of the Treasury for various statutory purposes, including treasury loans.",
        "keywords": "Interest and Exchange Rates"
      },
      "topics": [
        "interest-exchange-rates"
      ],
      "relatedDatasets": [
        "015-BFS-2014Q3-041",
        "015-BFS-2014Q3-042",
        "015-BFS-2014Q3-043"
      ],
      "slug": "/treasury-certified-interest-rates-monthly/",
      "currentDateButton": "byMonth"
    }
  },
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
  }
};

