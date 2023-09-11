module.exports = {
  ENV_ID: 'uat',
  BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.uat.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.uat.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['experimental-page', 'react-table-poc'],
  ADDITIONAL_DATASETS: {},
  ADDITIONAL_ENDPOINTS: {
    '27': {
      endpoint: 'v1/debt/mspd/mspd_table_1',
      dateField: 'record_date',
      downloadName: 'MSPD_SumSecty',
      dataDisplays: [
        {
          title: 'By Marketable',
          dimensionField: 'security_class_desc',
          filters: [
            {
              key: 'security_type_desc',
              value: 'Marketable',
            },
          ],
        },
        {
          title: 'By Nonmarketable',
          dimensionField: 'security_class_desc',
          filters: [
            {
              key: 'security_type_desc',
              value: 'Nonmarketable',
            },
          ],
        },
      ],
      valueFieldOptions: [
        'debt_held_public_mil_amt',
        'intragov_hold_mil_amt',
        'total_mil_amt',
      ],
    },
    '28': {
      endpoint: 'v1/debt/mspd/mspd_table_3',
      dateField: 'record_date',
      downloadName: 'MSPD_DetailSecty',
      dataDisplays: [
        {
          title: 'By Marketable',
          dimensionField: 'security_class1_desc',
          filters: [
            {
              key: 'security_type_desc',
              value: 'Marketable',
            },
          ],
        },
        {
          title: 'By Nonmarketable',
          dimensionField: 'security_class2_desc',
          filters: [
            {
              key: 'security_type_desc',
              value: 'Nonmarketable',
            },
          ],
        },
      ],
      valueFieldOptions: [
        'issued_amt',
        'inflation_adj_amt',
        'redeemed_amt',
        'outstanding_amt',
        'prior_month_outstanding_amt',
        'current_month_issued_amt',
        'current_month_redeemed_amt',
        'current_month_outstanding_amt',
      ],
    },
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

    // treasury bulletin
    '206': {
      endpoint: 'v1/accounting/tb/pdo1_offerings_regular_weekly_treasury_bills',
      dateField: 'record_date',
      downloadName: 'TB_PDO1OfferingsRegularWeeklyTreasuryBills',
    },
    '207': {
      endpoint:
        'v1/accounting/tb/pdo2_offerings_marketable_securities_other_regular_weekly_treasury_bills',
      downloadName:
        'TB_PDO2OfferingsMarketableSecuritiesOtherRegularWeeklyTreasuryBills',
      dateField: 'record_date',
    },
    '208': {
      endpoint:
        'v1/accounting/tb/ofs1_distribution_federal_securities_class_investors_type_issues',
      dateField: 'record_date',
      downloadName:
        'TB_OFS1DistributionFederalSecuritiesClassInvestorsTypeIssues',
      // 'Pivot View' in UI; 'Pivot View (Field)' and 'Pivot View (Name)' on form
      dataDisplays: [
        {
          title: 'Securities Classification',
          dimensionField: 'securities_classification',
        },
        {
          title: 'Investors Classification',
          dimensionField: 'investors_classification',
        },
        {
          title: 'Issues Type',
          dimensionField: 'issues_type',
        },
      ],
      // 'Pivot Value' in UI, 'Pivot Value (Field)' on form
      valueFieldOptions: ['securities_mil_amt'],
    },
  },
};
