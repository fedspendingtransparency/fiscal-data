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
    '015-BFS-2014Q3-053': {
      slug: '/unemployment-trust-funds-report-selection/',
      seoConfig: {
        pageTitle: 'Unemployment Trust Funds Report Selection',
        description:
          'Unemployment Trust Fund Report Selection offers numerous reports by month, year, state, federal, ' +
          'and report type. The reports represent data supporting the Account Statement, Transaction Statement, ' +
          'and the Federal Activity Statement reports. The Unemployment Trust Fund is made up of 59 U.S. Treasury ' +
          'accounts, including an account for each state and some territories.',
        keywords: 'Debt, Financial Summaries',
      },
      topics: ['debt', 'financial-summaries'],
      relatedDatasets: ['015-BFS-2014Q3-093'],
      currentDateButton: 'byFullMonth',
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
      alwaysSortWith: ['-sort_order_primary', '-sort_order_secondary', 'maturity_date'],
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
        downloadLabel: 'Account',
        label: 'Choose an Account',
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
      alwaysSortWith: ['-sort_order_primary', '-sort_order_secondary', 'security_nbr'],
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
        downloadLabel: 'Account',
        label: 'Choose an Account',
        disableDateRangeFilter: true,
        dataDefaultHeader: 'This table requires additional filters.',
        dataDefaultMessage: 'Select an account in the filter section above to display the data.',
        dataUnmatchedHeader: 'There is no data to display based on the current filters selected.',
        dataUnmatchedMessage: 'Select a different account and/or date range in order to preview the data.',
        dataSearchLabel: 'Search account descriptions',
      },
    },
    '305': {
      endpoint: 'v1/accounting/od/utf_account_statement',
      dateField: 'eff_date',
      downloadName: 'UTF_Account_Statement ',
      alwaysSortWith: ['acct_desc', '-eff_date', 'memo_nbr'],
      apiFilter: {
        field: 'acct_desc',
        downloadLabel: 'Account',
        label: 'Choose a Federal or State Account',
        dataUnmatchedHeader: 'There is no data to display based on the current filters selected.',
        dataUnmatchedMessage: 'Select a different account description and/or date range in order to preview the data.',
        dataDefaultHeader: 'This table requires additional filters.',
        dataDefaultMessage: 'Select an account in the filter section above to display the data.',
        dataSearchLabel: 'Search account descriptions',
        fieldFilter: {
          field: 'report_type',
          value: ['Federal', 'State'],
        },
      },
      selectColumns: [
        'acct_statement',
        'eff_date',
        'shares_per_par',
        'trans_cd',
        'trans_desc_cd',
        'memo_nbr',
        'location_cd',
        'acct_nbr',
        'acct_desc',
        'report_type',
      ],
    },
    '306': {
      endpoint: 'v1/accounting/od/utf_transaction_statement',
      dateField: 'eff_date',
      downloadName: 'UTF_Transaction_Statement ',
      alwaysSortWith: ['acct_desc', '-eff_date', 'memo_nbr'],
      apiFilter: {
        field: 'acct_desc',
        downloadLabel: 'Account',
        label: 'Choose a Federal or State Account',
        dataUnmatchedHeader: 'There is no data to display based on the current filters selected.',
        dataUnmatchedMessage: 'Select a different account description and/or date range in order to preview the data.',
        dataDefaultHeader: 'This table requires additional filters.',
        dataDefaultMessage: 'Select an account in the filter section above to display the data.',
        dataSearchLabel: 'Search account descriptions',
        fieldFilter: {
          field: 'report_type',
          value: ['Federal', 'State'],
        },
      },
      selectColumns: [
        'trans_statement',
        'eff_date',
        'shares_per_par',
        'trans_desc_cd',
        'memo_nbr',
        'location_cd',
        'acct_nbr',
        'acct_desc',
        'report_type',
      ],
    },
    '307': {
      endpoint: 'v1/accounting/od/utf_federal_activity_statement',
      dateField: 'eff_date',
      downloadName: 'UTF_Federal_Activity_Statement ',
      alwaysSortWith: ['acct_desc', '-eff_date', 'memo_nbr'],
      apiFilter: {
        field: 'acct_desc',
        downloadLabel: 'Account',
        label: 'Choose a State Account',
        dataUnmatchedHeader: 'There is no data to display based on the current filters selected.',
        dataUnmatchedMessage: 'Select a different account description and/or date range in order to preview the data.',
        dataDefaultHeader: 'This table requires additional filters.',
        dataDefaultMessage: 'Select an account in the filter section above to display the data.',
        dataSearchLabel: 'Search account descriptions',
      },
      selectColumns: ['fed_act_statement', 'eff_date', 'shares_per_par', 'trans_desc_cd', 'memo_nbr', 'location_cd', 'acct_nbr', 'acct_desc'],
    },
  },
};
