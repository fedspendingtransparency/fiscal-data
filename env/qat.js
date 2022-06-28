module.exports = {
  ENV_ID: 'preprod',
  API_BASE_URL: 'https://api.dev.fiscaldata.treasury.gov',
  AUTHENTICATE_API: true,
  DATA_DOWNLOAD_BASE_URL: 'https://dev.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.dev.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['chartingConfigurationTool', 'experimental-page'],
  ADDITIONAL_DATASETS: {
    "015-BFS-2014Q3-038": {
      "seoConfig": {
        "pageTitle": "Federal Borrowings Program: Summary General Ledger Balances Report | U.S. Treasury Fiscal Data",
        "description": "A monthly summary report containing outstanding principal debt and related interest balances for all borrowing accounts.",
        "keywords": "Debt, Financial Summaries, Interest and Exchange Rates, Revenue, Savings Bonds, Spending"
      },
      "topics": ["Debt", "Financial Summaries", "Interest and Exchange Rates", "Revenue", "Savings Bonds", "Spending"],
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
  USE_MOCK_RELEASE_CALENDAR_DATA_ON_API_FAIL: true,
  ADDITIONAL_ENDPOINTS: {
    '137': {
      'endpoint': 'v1/accounting/od/rates_of_exchange',
      'dateField': 'record_date',
      'downloadName': 'RprtRateXchg',
      'dataDisplays': [
        {
          'title': 'Country - Currency Description',
          'dimensionField': 'country_currency_desc',
          'lastRowSnapshot': true
        }
      ],
      'valueFieldOptions': [
        'exchange_rate'
      ],
      'alwaysSortWith': ['-record_date', 'country_currency_desc', '-effective_date']
    },
    '158': {
      'endpoint': 'v2/accounting/od/statement_net_cost',
      'dateField': 'record_date',
      'downloadName': 'USFR_StmtNetCost',
      'dataDisplays': [
        {
          'title': 'CFO Act Agencies',
          'dimensionField': 'agency_nm',
          'filters': [
            {
              'key': 'restmt_flag',
              'operator': 'eq',
              'value': 'N'
            },
            {
              'key': 'agency_nm',
              'operator': 'in',
              'value': 'Agency for International Development,' +
                'U.S. Agency for International Development,' +
                'Department of Agriculture,Department of Commerce,' +
                'Department of Defense,Department of Education,Department of Energy,' +
                'Department of Health & Human Services,Department of Health and Human Services,' +
                'Department of Homeland Security,Department of Housing & Urban Development,' +
                'Department of Housing and Urban Development,Department of the Interior,' +
                'Department of Justice,Department of Labor,' +
                'Department of State,Department of Transportation,' +
                'Department of the Treasury,Department of Veteran Affairs,' +
                'Department of Veterans Affairs,Environmental Protection Agency,' +
                'General Services Administration,National Aeronautics & Space Administration,' +
                'National Aeronautics and Space Administration,National Science Foundation,' +
                'Nuclear Regulatory Commission,Office of Personnel Management,' +
                'Small Business Administration,Social Security Administration'
            }
          ],
          'uniquePivotValues': [
            {
              'columnName': 'earned_revenue_bil_amt',
              'prettyName': 'Earned Revenue (in Billions)'
            },{
              'columnName': 'gross_cost_bil_amt',
              'prettyName': 'Gross Cost (in Billions)'
            },{
              'columnName': 'net_cost_bil_amt',
              'prettyName': 'Net Cost (in Billions)'
            }
          ]
        },
        {
          'title': 'Non-CFO Act Entities',
          'dimensionField': 'agency_nm',
          'filters': [
            {
              'key': 'restmt_flag',
              'operator': 'eq',
              'value': 'N'
            },
            {
              'key': 'agency_nm',
              'operator': 'nin',
              'value': 'Agency for International Development,' +
                'U.S. Agency for International Development,' +
                'Department of Agriculture,Department of Commerce,' +
                'Department of Defense,Department of Education,' +
                'Department of Energy,Department of Health & Human Services,' +
                'Department of Health and Human Services,Department of Homeland Security,' +
                'Department of Housing & Urban Development,' +
                'Department of Housing and Urban Development,Department of the Interior,' +
                'Department of Justice,Department of Labor,Department of State,' +
                'Department of Transportation,Department of the Treasury,' +
                'Department of Veteran Affairs,Department of Veterans Affairs,' +
                'Environmental Protection Agency,General Services Administration,' +
                'National Aeronautics & Space Administration,' +
                'National Aeronautics and Space Administration,National Science Foundation,' +
                'Nuclear Regulatory Commission,Office of Personnel Management,' +
                'Small Business Administration,Social Security Administration,Total,' +
                'Interest on debt held by the public,' +
                'Interest on Treasury securities held by the public,' +
                'Interest on Treasury Securities held by the public,' +
                'Interest on Treasury Securities Held by the Public'
            }
          ],
          'uniquePivotValues': [
            {
              'columnName': 'earned_revenue_bil_amt',
              'prettyName': 'Earned Revenue (in Billions)'
            },{
              'columnName': 'gross_cost_bil_amt',
              'prettyName': 'Gross Cost (in Billions)'
            },{
              'columnName': 'net_cost_bil_amt',
              'prettyName': 'Net Cost (in Billions)'
            }
          ]
        },
        {
          'title': 'Interest',
          'dimensionField': 'agency_nm',
          'filters': [
            {
              'key': 'restmt_flag',
              'operator': 'eq',
              'value': 'N'
            },
            {
              'key': 'agency_nm',
              'operator': 'in',
              'value': 'Interest on debt held by the public,' +
                'Interest on Treasury securities held by the public,' +
                'Interest on Treasury Securities held by the public,' +
                'Interest on Treasury Securities Held by the Public'
            }
          ]
        }
      ],
      'valueFieldOptions': [
        'gross_cost_bil_amt',
        'net_cost_bil_amt'
      ]
    },
    '168': {
      'endpoint': 'v1/accounting/od/net_position',
      'dateField': 'record_date',
      'downloadName': 'USFR_StmtOpsChgNetPos',
      'dataDisplays': [
        {
          'title': 'Net Operating (Cost)/Revenue Line Items',
          'dimensionField': 'line_item_desc',
          'filters': [
            {
              'key': 'restmt_flag',
              'operator': 'eq',
              'value': 'N'
            },
            {
              'key': 'line_item_desc',
              'operator': 'in',
              'value': 'Total revenue,Total net cost,Intragovernmental transfers,' +
                'Intra-governmental transfers,Unmatched transactions and balances'
            }
          ]
        },
        {
          'title': 'Revenue Line Items',
          'dimensionField': 'line_item_desc',
          'filters': [
            {
              'key': 'restmt_flag',
              'operator': 'eq',
              'value': 'N'
            },
            {
              'key': 'account_desc',
              'operator': 'eq',
              'value': 'Revenue'
            },
            {
              'key': 'line_item_desc',
              'operator': 'neq',
              'value': 'Total revenue'
            }
          ]
        },
        {
          'title': 'Net Cost Line Items',
          'dimensionField': 'line_item_desc',
          'filters': [
            {
              'key': 'restmt_flag',
              'operator': 'eq',
              'value': 'N'
            },
            {
              'key': 'account_desc',
              'operator': 'eq',
              'value': 'Net Cost'
            },
            {
              'key': 'line_item_desc',
              'operator': 'neq',
              'value': 'Total net cost'
            }
          ]
        }
      ],
      'valueFieldOptions': [
        'non_dedicated_funds_bil_amt',
        'dedicated_funds_bil_amt',
        'eliminations_bil_amt',
        'consolidated_bil_amt'
      ]
    }
  }
};
