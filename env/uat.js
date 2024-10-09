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
    '015-BFS-2024Q1-003': {
      slug: '/fbp-detailed-principal-accrued-interest/',
      seoConfig: {
        pageTitle: 'Federal Borrowings Program: Detailed Principal and Accrued Interest Report',
        description:
          "U.S. Treasury loans and interest receivable balances associated with each individual borrowing agency's expenditure Treasury Account Symbol.",
        keywords: 'Debt, Financial Summaries',
      },
      topics: ['debt', 'financial-summaries'],
      relatedDatasets: ['015-BFS-2014Q3-038', '015-BFS-2014Q3-037'],
      currentDateButton: 'byMonth',
      displayApiFilterForAllTables: true,
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
      alwaysSortWith: ['-record_date', 'src_line_nbr'],
      selectColumns: [],
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
      alwaysSortWith: ['-record_date', 'src_line_nbr'],
      selectColumns: [],
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
      alwaysSortWith: ['-record_date', 'src_line_nbr'],
      selectColumns: [],
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
      alwaysSortWith: ['-record_date', 'src_line_nbr'],
      selectColumns: [],
    },
    // FBP
    '313': {
      endpoint: 'v1/accounting/od/fbp_balances',
      dateField: 'record_date',
      downloadName: 'FBP_Balances',
      alwaysSortWith: ['sort_order_primary', 'sort_order_secondary', 'maturity_date'],
      hideColumns: [],
      selectColumns: [
        'record_date',
        'account_nbr',
        'account_desc',
        'security_nbr',
        'segment_desc',
        'loans_receivable_amt',
        'interest_receivable_amt',
        'maturity_date',
        'interest_rate_pct',
        'amortization_amt',
        'capitalized_int_receivable_amt',
      ],
      apiFilter: {
        field: 'account_nbr',
        labelField: 'account_desc',
        filterEndpoint: 'v1/accounting/od/fbp_dpai_account_summary',
        downloadLabel: 'Account',
        label: 'Choose an Account',
        displayAllTablesResults: true,
        disableDateRangeFilter: true,
        dataDefaultHeader: 'This table requires additional filters.',
        dataDefaultMessage: 'Select an account in the filter section above to display the data.',
        dataUnmatchedHeader: 'There is no data to display based on the current filters selected.',
        dataUnmatchedMessage: 'Select a different account and/or date range in order to preview the data.',
        dataSearchLabel: 'Search account descriptions',
      },
    },
    // FBP
    '314': {
      endpoint: 'v1/accounting/od/fbp_future_dated_transactions',
      dateField: 'settle_date',
      downloadName: 'FBP_FutureDatedTransactions',
      alwaysSortWith: ['sort_order_primary', 'sort_order_secondary', 'security_nbr'],
      hideColumns: [],
      selectColumns: [
        'record_date',
        'account_nbr',
        'account_desc',
        'security_nbr',
        'segment_desc',
        'loans_receivable_amt',
        'interest_receivable_amt',
        'effective_date',
        'settle_date',
        'transaction_cd',
        'memo_nbr',
        'amortization_amt',
        'capitalized_int_receivable_amt',
      ],
      apiFilter: {
        field: 'account_nbr',
        labelField: 'account_desc',
        filterEndpoint: 'v1/accounting/od/fbp_dpai_account_summary',
        downloadLabel: 'Account',
        label: 'Choose an Account',
        displayAllTablesResults: true,
        disableDateRangeFilter: true,
        dataDefaultHeader: 'This table requires additional filters.',
        dataDefaultMessage: 'Select an account in the filter section above to display the data.',
        dataUnmatchedHeader: 'There is no data to display based on the current filters selected.',
        dataUnmatchedMessage: 'Select a different account and/or date range in order to preview the data.',
        dataSearchLabel: 'Search account descriptions',
        futureDated: true,
      },
    },
    // TRRE Clean
    '318': {
      endpoint: 'v1/accounting/od/rates_of_exchange_clean_values',
      dateField: 'record_date',
      downloadName: 'RprtRateXchgCln',
      alwaysSortWith: ['-effective_date', 'country_currency_desc'],
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
