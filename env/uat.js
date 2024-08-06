module.exports = {
  ENV_ID: 'uat',
  BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  API_BASE_URL: 'https://api.uat.fiscaldata.treasury.gov',
  DATA_DOWNLOAD_BASE_URL: 'https://uat.fiscaldata.treasury.gov',
  WEB_SOCKET_BASE_URL: 'wss://downloads.uat.fiscaldata.treasury.gov/main',
  EXPERIMENTAL_WHITELIST: ['experimental-page', 'afg-overview', 'publishedReportsSection'],
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
    '015-BFS-2024Q2-001': {
      slug: '/treasury-securities-buybacks/',
      seoConfig: {
        pageTitle: 'Treasury Securities Buybacks',
        description:
          'The Treasury Securities Buybacks dataset contains data related to the U.S. Treasury\'s buyback operations.',
      },
      topics: ['debt', 'auctions'],
      relatedDatasets: ['015-BFS-2014Q3-045', '015-BFS-2014Q3-050', '015-BFS-2014Q3-049', '015-BFS-2014Q1-14', '015-BFS-2014Q3-048'],
      currentDateButton: 'byDay',
      "detailView": {
        "apiId": 317,
        "field": "operation_date",
        "label": "Operation Date",
        "dateRangeLockCopy": "To filter data by date range, select a Operation Date from the table below.",
        "summaryTableFields": [
          "operation_date",
          "operation_start_time_est",
          "operation_close_time_est",
          "settlement_date"
        ],
        "selectColumns": [
          "cusip_nbr",
          "coupon_rate_pct",
          "maturity_date",
          "par_amt_accepted",
          "weighted_avg_accepted_price"
        ],
      }
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
    },
    // Buybacks
    '316': {
      endpoint: 'v1/accounting/od/buybacks_operations',
      dateField: 'operation_date',
      downloadName: 'Buybacks_Operations',
      alwaysSortWith: ['-operation_date'],
      selectColumn: ['operation_date, operation_start_time_est, operation_close_time_est, settlement_date, tentative_ann_pdf, tentative_ann_xml, final_ann_pdf, final_ann_xml, results_pdf, results_xml, special_ann_pdf'],
    },
    // Buybacks
    '317': {
      endpoint: 'v1/accounting/od/buybacks_security_details',
      dateField: 'operation_date',
      downloadName: 'Buybacks_Security_Details',
      alwaysSortWith: ['-operation_date,maturity_date'],
      selectColumn: ['cusip_nbr, coupon_rate_pct, maturity_date, par_amt_accepted, weighted_avg_accepted_price'],
    },
  },
};
