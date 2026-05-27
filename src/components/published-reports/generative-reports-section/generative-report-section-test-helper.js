export const mockApiConfig = [
  {
    apiId: 305,
    apiFilter: {
      field: 'acct_desc',
      fieldFilter: { value: ['Federal', 'State'] },
      optionValues: {
        Federal: ['option1', 'option2', 'option3'],
        State: ['option4', 'option5', 'option6'],
      },
      notice: 'Effective Dates on Fiscal Data may differ from the published effective dates for corresponding reports on TreasuryDirect.',
    },
    tableName: 'Table 1',
    endpoint: 'v1/table1/mockendpoint',
    dateField: 'eff_date',
    earliestDate: '12/02/2003',
    latestDate: '07/17/2024',
    alwaysSortWith: ['acct_desc', '-eff_date'],
  },
  {
    apiId: 305,
    apiFilter: {
      field: 'acct_desc',
      fieldFilter: { value: ['Federal', 'State'] },
      optionValues: {
        Federal: ['option1', 'option2', 'option3'],
        State: ['option4', 'option5', 'option6'],
      },
      notice: 'Effective Dates on Fiscal Data may differ from the published effective dates for corresponding reports on TreasuryDirect.',
    },
    tableName: 'Table 2',
    endpoint: 'v1/table2/mockendpoint',
    dateField: 'eff_date',
    earliestDate: '12/02/2003',
    latestDate: '07/17/2024',
    alwaysSortWith: ['acct_desc', '-eff_date', 'memo_nbr'],
  },
];
export const mockDataset = {
  apis: mockApiConfig,
  reportGenKey: 'utf',
  publishedReportsTip: 'Effective dates on FiscalData.gov may differ from the published effective date for…',
};
