module.exports = {
  ENV_ID: 'uat',
  BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.uat.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.uat.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: [
    'experimental-page',
    'afg-overview',
    'publishedReportsSection',
    'dataPreview',
    'chartingConfigurationTool',
    'fipReportsSection',
  ],
  LOWER_ENV_FEATURE_WHITELIST: ['reportGeneration'],
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
    '299': {
      endpoint: 'v1/debt/treasury_offset_program',
      dateField: 'record_date',
      downloadName: 'treasury_offset_program',
      alwaysSortWith: ['-record_date', 'row_index_nbr'],
      selectColumns: [],
      dataDisplays: [
        {
          title: 'Mixed Stream',
          dimensionField: 'mixed_stream',
        },
        {
          title: 'State or Agency',
          dimensionField: 'state_or_agency',
        },
        {
          title: 'Agency Full Code Name',
          dimensionField: 'agency_full_cd_nm',
        },
        {
          title: 'Agency Name',
          dimensionField: 'agency_nm',
        },
        {
          title: 'Agency',
          dimensionField: 'agency',
        },
        {
          title: 'Agency Site ID',
          dimensionField: 'agency_site_id',
        },
        {
          title: 'Payment Type',
          dimensionField: 'payment_type',
        },
        {
          title: 'Payment Source',
          dimensionField: 'payment_source',
        },
        {
          title: 'Debt Category',
          dimensionField: 'debt_category',
        },
        {
          title: 'State Code',
          dimensionField: 'state_cd',
        },
        {
          title: 'Reversal Requestor',
          dimensionField: 'reversal_requestor',
        },
        {
          title: 'Payment Category Description',
          dimensionField: 'payment_category',
        },
      ],
      valueFieldOptions: ['net_offset_cnt', 'net_offset_amt', 'net_dms_fee_amt', 'offset_amnt', 'offset_cnt', 'reversal_cnt', 'reserval_amt'],
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
    '139': {
      endpoint: 'v1/debt/mspd/mspd_table_3_market',
      dateField: 'record_date',
      downloadName: 'MSPD_MktSecty',
      dataDisplays: [
        {
          title: 'Security Class Description',
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
    '163': {
      endpoint: 'v2/debt/tror',
      downloadName: 'TROR_Full',
      dataDisplays: [
        {
          title: 'Receivable Type Description',
          dimensionField: 'receivable_type_description',
        },
        {
          title: 'Funding Type Description',
          dimensionField: 'funding_type_description',
        },
      ],
      valueFieldOptions: [
        'new_receivables_amt',
        'accruals_amt',
        'collections_total_amt',
        'adjustments_total_amt',
        'written_off_total_amt',
        'end_bal_amt',
        'ddebt_by_age_total_amt',
        'ddebt_1_120_total_amt',
        'top_referred_total_amt',
        'cs_referred_total_amt',
        'collected_ddebt_total_amt',
        'cnc_total_amt',
        'cnc_closed_out_current_fy_amt',
      ],
      additionalColumns: [
        'agency_code',
        'receivable_type_id',
        'funding_type_description',
        'funding_type_id'
      ],
    },
  },
};
