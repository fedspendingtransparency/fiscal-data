export const reportsConfig = {
  utf: {
    305: {
      documentTitle: 'Account Statement Report',
      downloadName: 'UTF_Account_Statement',
      reportInfo: [{ name: 'Account' }, { name: 'Report Date' }, { name: 'Final Report', style: 'final' }],
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
      reportInfo: [{ name: 'Account' }, { name: 'Report Date' }, { name: 'Final Report', style: 'final' }],
      tables: [
        {
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
      reportInfo: [{ name: 'Account' }, { name: 'Report Date' }, { name: 'Final Report', style: 'final' }],
      reportSummary: [{ name: 'Ending Balance' }],
      tables: [
        {
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
