module.exports = {
  ENV_ID: 'uat',
  BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.uat.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.uat.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['experimental-page', 'afg-overview', 'direct-download'],
  ADDITIONAL_DATASETS: {
    '015-BFS-2024Q1-002': {
      slug: '/daily-government-account-series/',
      seoConfig: {
        pageTitle: 'Daily Government Account Series',
        description:
          'The Government Account Series (GAS) Daily Activity Summary dataset contains GAS securities ' +
          'activity amounts for specific federal government accounts, including trust funds. The GAS securities in ' +
          'these accounts are categorized as either Held by the Public or Intragovernmental Holdings. The daily opening ' +
          'balance, issued, and redeemed amounts are included and aggregated on a month-to-date and fiscal-year-to-date basis.',
        keywords: 'Debt, Financial Summaries',
      },
      topics: ['debt', 'financial-summaries'],
      relatedDatasets: ['015-BFS-2014Q1-13', '015-BFS-2014Q1-03', '015-BFS-2014Q1-11'],
      currentDateButton: 'byDay',
    },
    '015-BFS-2014Q3-052': {
      slug: '/top-treasury-offset-program/',
      seoConfig: {
        pageTitle: 'Treasury Offset Program (TOP) | U.S. Treasury Fiscal Data',
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
    '310': {
      endpoint: 'v1/accounting/od/gas_held_by_public_daily_activity',
      dateField: 'record_date',
      downloadName: 'GAS_HeldByThePublic_DailyActivity',
      alwaysSortWith: ['-record_date, src_line_nbr'],
      selectColumn: [],
      // 'Pivot View' in UI; 'Pivot View (Field)' and 'Pivot View (Name)' on form
      dataDisplays: [
        {
          title: 'Account Description',
          dimensionField: 'account_desc',
        },
      ],
      // 'Pivot Value' in UI, 'Pivot Value (Field)' on form
      valueFieldOptions: [
        'daily_opening_balance_amt',
        'daily_issued_amt',
        'daily_redeemed_amt',
        'mtd_opening_balance_amt',
        'mtd_issued_amt',
        'mtd_redeemed_amt',
        'fytd_opening_balance_amt',
        'fytd_issued_amt',
        'fytd_redeemed_amt',
        'daily_ending_balance_amt',
      ],
    },
    '311': {
      endpoint: 'v1/accounting/od/gas_intragov_holdings_daily_activity',
      dateField: 'record_date',
      downloadName: 'GAS_IntragovernmentalHoldings_DailyActivity',
      alwaysSortWith: ['-record_date, src_line_nbr'],
      selectColumn: [],
      // 'Pivot View' in UI; 'Pivot View (Field)' and 'Pivot View (Name)' on form
      dataDisplays: [
        {
          title: 'Account Description',
          dimensionField: 'account_desc',
        },
      ],
      // 'Pivot Value' in UI, 'Pivot Value (Field)' on form
      valueFieldOptions: [
        'daily_opening_balance_amt',
        'daily_issued_amt',
        'daily_redeemed_amt',
        'mtd_opening_balance_amt',
        'mtd_issued_amt',
        'mtd_redeemed_amt',
        'fytd_opening_balance_amt',
        'fytd_issued_amt',
        'fytd_redeemed_amt',
        'daily_ending_balance_amt',
      ],
    },
    '312': {
      endpoint: 'v1/accounting/od/gas_daily_activity_totals',
      dateField: 'record_date',
      downloadName: 'GAS_DailyActivity_Totals',
      alwaysSortWith: ['-record_date, src_line_nbr'],
      selectColumn: [],
      // 'Pivot View' in UI; 'Pivot View (Field)' and 'Pivot View (Name)' on form
      dataDisplays: [
        {
          title: 'Total Description',
          dimensionField: 'total_desc',
        },
      ],
      // 'Pivot Value' in UI, 'Pivot Value (Field)' on form
      valueFieldOptions: [
        'daily_opening_balance_amt',
        'daily_issued_amt',
        'daily_redeemed_amt',
        'mtd_opening_balance_amt',
        'mtd_issued_amt',
        'mtd_redeemed_amt',
        'fytd_opening_balance_amt',
        'fytd_issued_amt',
        'fytd_redeemed_amt',
        'daily_ending_balance_amt',
      ],
    },
    '299': {
      endpoint: 'v1/debt/treasury_offset_program',
      dateField: 'record_date',
      downloadName: 'treasury_offset_program',
      alwaysSortWith: ['record_date, src_line_nbr'],
      selectColumn: [],
      // 'Pivot View' in UI; 'Pivot View (Field)' and 'Pivot View (Name)' on form
      dataDisplays: [
        {
          title: 'By State Code',
          dimensionField: 'state_cd',
        },
        {
          title: 'By Mixed Stream',
          dimensionField: 'mixed_stream',
        },
        {
          title: 'By State or Agency',
          dimensionField: 'tate_or_agency',
        },
        {
          title: 'By Agency Name',
          dimensionField: 'agency_nm',
        },
        {
          title: ' By Agency Full Code Name',
          dimensionField: 'agency_full_cd_nm',
        },
        {
          title: 'By Agency ID',
          dimensionField: 'agency_id',
        },
        {
          title: 'By Agency',
          dimensionField: 'agency',
        },
        {
          title: 'By Agency Site',
          dimensionField: 'agency_site',
        },
        {
          title: 'By Agency Site Code',
          dimensionField: 'agency_site_cd',
        },
        {
          title: 'By Agency Site ID',
          dimensionField: 'agency_site_id',
        },
        {
          title: 'By Payment Category Description',
          dimensionField: 'payment_category',
        },
        {
          title: 'By Payment Type Code',
          dimensionField: 'payment_type_cd',
        },
        {
          title: 'By Payment Agency Name',
          dimensionField: 'payment_agency_nm',
        },
        {
          title: 'By Payment Type',
          dimensionField: 'payment_type',
        },
        {
          title: 'By Payment Source',
          dimensionField: 'payment_source',
        },
        {
          title: 'By Debt Category',
          dimensionField: 'debt_category',
        },
        {
          title: 'By Payment Agency ID',
          dimensionField: 'payment_agency_id',
        },
        {
          title: 'By Reversal Requestor',
          dimensionField: 'reversal_requestor',
        },
        {
          title: 'By Payment Source Code',
          dimensionField: 'payment_source_cd',
        },
      ],
      // 'Pivot Value' in UI, 'Pivot Value (Field)' on form
      valueFieldOptions: ['net_offset_amt', 'net_dms_fee_amt', 'offset_amt', 'reversal_amt'],
    },
  },
};
