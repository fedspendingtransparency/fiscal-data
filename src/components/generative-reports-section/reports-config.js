export const reportsConfig = {
  utf: {
    305: {
      documentTitle: 'Account Statement Report',
      downloadName: 'UTF_Account_Statement',
      sort: ['eff_date', 'memo_nbr'],
      reportInfo: [
        { name: 'Account', filter: 'account', secondaryField: 'acct_statement' },
        { name: 'Report Date', filter: 'date' },
        { name: 'Final Report', style: 'final' },
      ],
      reportSummary: [{ name: 'Beginning Balance' }, { name: 'Ending Balance' }],
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
      sort: ['trans_desc_cd', 'eff_date', 'memo_nbr'],
      reportInfo: [
        { name: 'Account', filter: 'account', secondaryField: 'trans_statement' },
        { name: 'Report Date', filter: 'date' },
        { name: 'Final Report', style: 'final' },
      ],
      tables: [
        // Will be added in a followup ticket
        // {
        //   width: '50%',
        //   fields: [
        //     { name: 'trans_desc_cd', width: 180 },
        //     { name: 'shares_per_par', width: 70 },
        //   ],
        // },
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
      sort: ['trans_desc_cd', 'eff_date', 'memo_nbr'],
      reportInfo: [
        { name: 'Account', filter: 'account', secondaryField: 'fed_act_statement' },
        { name: 'Report Date', filter: 'date' },
        { name: 'Final Report', style: 'final' },
      ],
      reportSummary: [{ name: 'Ending Balance' }],
      tables: [
        // Will be added in a followup ticket
        // {
        //   width: '50%',
        //   fields: [
        //     { name: 'trans_desc_cd', width: 180 },
        //     { name: 'shares_per_par', width: 70 },
        //   ],
        // },
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
