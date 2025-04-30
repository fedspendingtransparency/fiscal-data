export const reportsConfig = {
  utf: {
    305: {
      documentTitle: 'Account Statement Report',
      downloadName: 'UTF_Account_Statement',
      sort: ['-eff_date', 'memo_nbr'],
      summaryEndpoint: 'v1/accounting/od/utf_account_balances',
      summarySort: ['-eff_date'],
      summaryDataKey: 'acct_statement',
      customFormatting: [
        {
          type: 'NUMBER',
          fields: ['shares_per_par'],
          currency: true,
        },
      ],
      reportInfo: [
        { name: 'Account', filter: 'account', secondaryField: 'acct_statement' },
        { name: 'Report Date', filter: 'date' },
        { name: 'Final Report', style: 'final' },
      ],
      reportSummary: [
        { name: 'Beginning Balance', field: 'shares_per_par' },
        { name: 'Ending Balance', field: 'shares_per_par' },
      ],

      tables: [
        {
          width: '100%',
          fields: [
            { name: 'eff_date', width: 70 },
            { name: 'shares_per_par', width: 70 },
            { name: 'trans_cd', width: 53 },
            { name: 'trans_desc_cd', width: 180 },
            { name: 'memo_nbr', width: 70 },
            { name: 'location_cd', width: 50 },
            { name: 'acct_nbr', width: 70 },
          ],
        },
      ],
    },
    306: {
      documentTitle: 'Transaction Statement',
      downloadName: 'UTF_Transaction_Statement',
      summaryTableEndpoint: 'v1/accounting/od/utf_transaction_subtotals',
      summaryTableKey: 'trans_statement',
      sort: ['trans_desc_cd', '-eff_date', 'memo_nbr'],
      summaryTableSort: ['trans_desc_cd', '-eff_date'],
      customFormatting: [
        {
          type: 'NUMBER',
          fields: ['shares_per_par'],
          currency: true,
        },
      ],
      reportInfo: [
        { name: 'Account', filter: 'account', secondaryField: 'trans_statement' },
        { name: 'Report Date', filter: 'date' },
        { name: 'Final Report', style: 'final' },
      ],
      tables: [
        {
          type: 'summary',
          width: '50%',
          fields: [
            { name: 'trans_desc_cd', width: 180 },
            { name: 'shares_per_par', width: 70, style: { textAlign: 'right' } },
          ],
        },
        {
          width: '100%',
          fields: [
            { name: 'eff_date', width: 70 },
            { name: 'shares_per_par', width: 70 },
            { name: 'trans_desc_cd', width: 180 },
            { name: 'memo_nbr', width: 70 },
            { name: 'location_cd', width: 50 },
            { name: 'acct_nbr', width: 70 },
          ],
        },
      ],
    },
    307: {
      documentTitle: 'Federal Activity Statement',
      downloadName: 'UTF_Federal_Activity_Statement',
      sort: ['trans_desc_cd', '-eff_date', 'memo_nbr'],
      summaryEndpoint: 'v1/accounting/od/utf_account_balances',
      summaryDataKey: 'acct_statement',
      summarySort: ['eff_date'],
      summaryTableEndpoint: 'v1/accounting/od/utf_transaction_subtotals',
      summaryTableKey: 'trans_statement',
      summaryTableSort: ['trans_desc_cd', '-eff_date'],
      reportDataKey: 'fed_act_statement',
      customFormatting: [
        {
          type: 'NUMBER',
          fields: ['shares_per_par'],
          currency: true,
        },
      ],
      reportInfo: [
        { name: 'Account', filter: 'account', secondaryField: 'fed_act_statement' },
        { name: 'Report Date', filter: 'date' },
        { name: 'Final Report', style: 'final' },
      ],
      reportSummary: [{ name: 'Ending Balance', field: 'shares_per_par', style: { textAlign: 'right' } }],
      tables: [
        {
          type: 'summary',
          width: '50%',
          fields: [
            { name: 'trans_desc_cd', width: 180 },
            { name: 'shares_per_par', width: 70 },
          ],
        },
        {
          width: '100%',
          fields: [
            { name: 'eff_date', width: 70 },
            { name: 'shares_per_par', width: 70 },
            { name: 'trans_cd', width: 53 },
            { name: 'trans_desc_cd', width: 180 },
            { name: 'memo_nbr', width: 70 },
            { name: 'location_cd', width: 50 },
            { name: 'acct_nbr', width: 70 },
          ],
        },
      ],
    },
  },
};

export const reportsBannerCopy = {
  utf: {
    additionalFiltersHeader: 'This table requires additional filters.',
    additionalFiltersBody: 'Select an account in the filter section above to display the reports.',
    noDataMatchHeader: 'There is no data to display based on the current filters selected.',
    noDataMatchBody: 'Select a different account description and/or report date in order to preview the data.',
  },
};
