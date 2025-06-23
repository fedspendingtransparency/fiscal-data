export const datasetPageSampleConfig = {
  datasetId: '015-BFS-2014Q1-11',
  name: 'Monthly Statement of the Public Debt',
  searchScore: 10,
  relatedTopics: ['topic1', 'topic2'],
  apis: [
    {
      apiId: '3',
      endpoint: 'debt/mspd/mspd_table_1',
      dateField: 'reporting_date',
      tableName: 'Table 1',
      earliestDate: '2020-01-01',
      lastUpdated: '2020-07-17',
      latestDate: '2020-07-17',
      dataDisplays: [
        {
          title: 'Complete Table',
        },
      ],
      fields: [
        {
          columnName: 'reporting_date',
          definition: 'Reporting date for the data',
          tableName: 'Summary of Treasury Securities Outstanding',
          prettyName: 'Calendar Date',
          dataType: 'DATE',
          isRequired: 'yes',
        },
        {
          columnName: 'debt_out_amt',
          definition:
            'Amount outstanding represents the total par (principal amount) of ' +
            'marketable and non-marketable securities outstanding. The marketable securities ' +
            'include the discount and premium for treasury bills, notes, bonds, FRNs, and TIPS, ' +
            'all of which can be bought and sold in the secondary market at prevailing market ' +
            'prices.',
          tableName: 'Summary of Treasury Securities Outstanding',
          prettyName: null,
          dataType: null,
          isRequired: 'yes',
        },
        {
          columnName: 'security_holder',
          definition:
            'Tier two of a three-tier hierarchy for categorizing Treasury ' +
            'securities. Indicates whether the security is held by the public or ' +
            'part of intragovernmental ' +
            'holdings. ',
          tableName: 'Summary of Treasury Securities Outstanding',
          prettyName: null,
          dataType: null,
          isRequired: 'yes',
        },
      ],
    },
    {
      apiId: '5',
      endpoint: 'debt/mspd/mspd_table_2',
      dateField: 'reporting_date',
      tableName: 'Table 2',
      earliestDate: '2010-01-01',
      lastUpdated: '2020-07-17',
      latestDate: '2020-07-17',
      dataDisplays: [
        {
          title: 'Complete Table',
        },
      ],
      fields: [
        {
          columnName: 'reporting_date',
          definition: 'Reporting date for the data',
          tableName: 'Statutory Debt Limit',
          prettyName: 'Calendar Date',
          dataType: 'DATE',
          isRequired: 'yes',
        },
        {
          columnName: 'report_table_nbr',
          definition: 'Indicates the corresponding table number in the Monthly Statement of the Public Debt report',
          tableName: 'Statutory Debt Limit',
          prettyName: null,
          dataType: null,
          isRequired: null,
        },
        {
          columnName: 'security_holder',
          definition: 'Indicates whether the federal debt is held by the public or intragovernmental holdings',
          tableName: 'Statutory Debt Limit',
          prettyName: null,
          dataType: null,
          isRequired: null,
        },
      ],
    },
    {
      apiId: '3',
      endpoint: 'debt/mspd/mspd_table_3',
      dateField: 'reporting_date',
      earliestDate: '2000-01-01',
      latestDate: '2020-07-17',
      lastUpdated: '2020-07-17',
      tableName: 'Table 3 with a longer name to show off truncation',
      dataDisplays: [
        {
          title: 'Complete Table',
        },
      ],
    },
  ],
  slug: '/monthy-statement-of-the-public-debt-MSPD/',
  dictionary: false,
  techSpecs: {
    earliestDate: '01/01/2002',
    latestDate: '03/17/2020',
    lastUpdated: '03/17/2020',
    updateFrequency: 'Updated Monthly',
    fileFormat: 'JSON, CSV, XML',
  },
  dataStartYear: 2002,
  tagLine:
    'High level overview of Treasury securities and the statutory debt limit, detailed ' +
    'data on outstanding securities, and holdings of treasury securities in stripped form.',
  summaryText:
    'The Monthly Statement of the Public Debt is a report dating back to 1869 that ' +
    'details the Treasury’s outstanding debts and the debt limit. Debt is categorized by its ' +
    'marketability (whether it can be sold in secondary markets) as well as if the debt is held ' +
    'by the public or intragovernmental organizations. Beyond the first page, there are ' +
    'detailed accounts of debt by type as well as accounts of debt that is no longer ' +
    'outstanding. All amounts are reported in the millions of dollars. Reports are published ' +
    'on the fourth business day of each month, detailing the debt as of the end of the ' +
    'previous month.',
  publisher: 'Fiscal Accounting',
  publishedReports: [
    {
      report_date: '2021-01-01',
      path: '/test/test.pdf',
      report_group_id: '1',
      report_group_desc: 'desc',
      report_group_sort_order_nbr: '1',
    },
  ],
};
