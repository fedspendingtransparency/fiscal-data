export const mockMeta = {
  count: 2,
  labels: {
    record_date: 'Record Date',
    debt_held_public_amt: 'Debt Held by the Public',
    intragov_hold_amt: 'Intragovernmental Holdings',
    tot_pub_debt_out_amt: 'Total Public Debt Outstanding',
    src_line_nbr: 'Source Line Number',
    record_fiscal_year: 'Fiscal Year',
    record_fiscal_quarter: 'Fiscal Quarter Number',
    record_calendar_year: 'Calendar Year',
    record_calendar_quarter: 'Calendar Quarter Number',
    record_calendar_month: 'Calendar Month Number',
    record_calendar_day: 'Calendar Day Number',
    mock_small_fraction: 'Mock Small Fraction',
    mock_percent_string: 'Mock Percent String',
    mock_percent: 'Mock Percent',
    negative_currency: 'Negative Currency',
    daily_index: 'Daily Index',
    daily_int_accrual_rate: 'Daily Accrual Rate',
    spread: 'Spread',
    additional_date: 'Additional Date',
  },
  dataTypes: {
    record_date: 'DATE',
    debt_held_public_amt: 'CURRENCY',
    intragov_hold_amt: 'CURRENCY3',
    tot_pub_debt_out_amt: 'CURRENCY',
    src_line_nbr: 'NUMBER',
    record_fiscal_year: 'YEAR',
    record_fiscal_quarter: 'QUARTER',
    record_calendar_year: 'YEAR',
    record_calendar_quarter: 'QUARTER',
    record_calendar_month: 'MONTH',
    record_calendar_day: 'DAY',
    mock_small_fraction: 'SMALL_FRACTION',
    mock_percent_string: 'STRING',
    mock_percent: 'PERCENTAGE',
    negative_currency: 'CURRENCY3',
    daily_index: 'NUMBER',
    daily_int_accrual_rate: 'NUMBER',
    spread: 'NUMBER',
    additional_date: 'STRING',
  },
  dataFormats: {
    record_date: 'YYYY-MM-DD',
    debt_held_public_amt: '$10.20',
    intragov_hold_amt: '$10.20',
    tot_pub_debt_out_amt: '$10.20',
    src_line_nbr: '10.2',
    record_fiscal_year: 'YYYY',
    record_fiscal_quarter: 'Q',
    record_calendar_year: 'YYYY',
    record_calendar_quarter: 'Q',
    record_calendar_month: 'MM',
    record_calendar_day: 'DD',
  },
  'total-count': 2,
  'total-pages': 1,
};

export const mockColumnConfig = [
  {
    property: 'record_date',
    name: 'Record Date',
  },
  {
    property: 'debt_held_public_amt',
    name: 'Debt Held by the Public',
  },
  {
    property: 'intragov_hold_amt',
    name: 'Intragovernmental Holdings',
  },
  {
    property: 'tot_pub_debt_out_amt',
    name: 'Total Public Debt Outstanding',
  },
  {
    property: 'src_line_nbr',
    name: 'Source Line Number',
  },
  {
    property: 'record_fiscal_year',
    name: 'Fiscal Year',
  },
  {
    property: 'record_fiscal_quarter',
    name: 'Fiscal Quarter Number',
  },
  {
    property: 'record_calendar_year',
    name: 'Calendar Year',
  },
  {
    property: 'record_calendar_quarter',
    name: 'Calendar Quarter Number',
  },
  {
    property: 'record_calendar_month',
    name: 'Calendar Month Number',
  },
  {
    property: 'record_calendar_day',
    name: 'Calendar Day Number',
  },
  {
    property: 'mock_small_fraction',
    name: 'Mock Small Fraction',
  },
  {
    property: 'mock_percent_string',
    name: 'Mock Percent String',
  },
  {
    property: 'mock_percent',
    name: 'Mock Percent',
  },
  {
    property: 'negative_currency',
    name: 'Negative Currency',
  },
  {
    property: 'daily_index',
    name: 'Daily Index',
  },
  {
    property: 'daily_int_accrual_rate',
    name: 'Daily Accrual Rate',
  },
  {
    property: 'spread',
    name: 'Spread',
  },
  {
    property: 'additional_date',
    name: 'Additional Date',
  },
];

export const mockDetailViewColumnConfig = [
  {
    property: 'record_date',
    name: 'Record Date',
  },
  {
    property: 'ref_cpi',
    name: 'Reference CPI',
  },
  {
    property: 'index_ratio',
    name: 'Index Ratio',
  },
];

export const mockTableData1Row = {
  record_date: '2023-07-12',
  debt_held_public_amt: '25633821130387.02',
  intragov_hold_amt: '6884574686385.15',
  tot_pub_debt_out_amt: '32518395816772.17',
  src_line_nbr: '1',
  record_fiscal_year: '2023',
  record_fiscal_quarter: '4',
  record_calendar_year: '2023',
  record_calendar_quarter: '3',
  record_calendar_month: '07',
  record_calendar_day: '12',
  mock_percent_string: '45%',
  mock_small_fraction: '0.00067898',
  mock_percent: '4',
  negative_currency: '-134.1',
  daily_index: '0.111111111',
  daily_int_accrual_rate: '0.222222222',
  spread: '-0.1200',
};

export const mockTableData = {
  data: [
    {
      record_date: '2023-07-12',
      debt_held_public_amt: '25633821130387.02',
      intragov_hold_amt: '6884574686385.15',
      tot_pub_debt_out_amt: '32518395816772.17',
      src_line_nbr: '1',
      record_fiscal_year: '2023',
      record_fiscal_quarter: '4',
      record_calendar_year: '2023',
      record_calendar_quarter: '3',
      record_calendar_month: '07',
      record_calendar_day: '12',
      mock_percent_string: '45%',
      mock_small_fraction: '0.00067898',
      mock_percent: '4',
      negative_currency: '-134.1',
      daily_index: '0.111111111',
      daily_int_accrual_rate: '0.222222222',
      spread: '-0.1200',
      additional_date: '2024-1-1, 2023-2-2',
    },
    {
      record_date: '2023-07-11',
      debt_held_public_amt: '25633781683720.91',
      intragov_hold_amt: '6904685134353.32',
      tot_pub_debt_out_amt: '32538466818074.23',
      src_line_nbr: '1',
      record_fiscal_year: '2023',
      record_fiscal_quarter: '4',
      record_calendar_year: '2023',
      record_calendar_quarter: '3',
      record_calendar_month: '07',
      record_calendar_day: '11',
      mock_percent_string: '55%',
      mock_small_fraction: '0.00067898',
      mock_percent: '3',
    },
    {
      record_date: '2023-07-10',
      debt_held_public_amt: '25588803096223.83',
      intragov_hold_amt: '6892303235964.87',
      tot_pub_debt_out_amt: '32481106332188.70',
      src_line_nbr: '1',
      record_fiscal_year: '2023',
      record_fiscal_quarter: '4',
      record_calendar_year: '2023',
      record_calendar_quarter: '3',
      record_calendar_month: '07',
      record_calendar_day: '10',
      mock_percent_string: '65%',
      mock_small_fraction: '0.00067898',
      mock_percent: '2',
    },
    {
      record_date: '2023-07-09',
      debt_held_public_amt: '25588803096223.83',
      intragov_hold_amt: '6892303235964.87',
      tot_pub_debt_out_amt: '32481106332188.70',
      src_line_nbr: '1',
      record_fiscal_year: '2023',
      record_fiscal_quarter: '4',
      record_calendar_year: '2023',
      record_calendar_quarter: '3',
      record_calendar_month: '07',
      record_calendar_day: '10',
      mock_percent_string: '65%',
      mock_small_fraction: '0.00067898',
      mock_percent: '2',
    },
    {
      record_date: '2023-07-08',
      debt_held_public_amt: '25588803096223.83',
      intragov_hold_amt: '6892303235964.87',
      tot_pub_debt_out_amt: '32481106332188.70',
      src_line_nbr: '1',
      record_fiscal_year: '2023',
      record_fiscal_quarter: '4',
      record_calendar_year: '2023',
      record_calendar_quarter: '3',
      record_calendar_month: '07',
      record_calendar_day: '10',
      mock_percent_string: '65%',
      mock_small_fraction: '0.00067898',
      mock_percent: '2',
    },
    {
      record_date: '2023-07-07',
      debt_held_public_amt: '25588803096223.83',
      intragov_hold_amt: '6892303235964.87',
      tot_pub_debt_out_amt: '32481106332188.70',
      src_line_nbr: '1',
      record_fiscal_year: '2023',
      record_fiscal_quarter: '4',
      record_calendar_year: '2023',
      record_calendar_quarter: '3',
      record_calendar_month: '07',
      record_calendar_day: '10',
      mock_percent_string: '65%',
      mock_small_fraction: '0.00067898',
      mock_percent: '2',
    },
  ],
  meta: mockMeta,
};

const detailTestData = [
  {
    record_date: '2023-07-12',
    ref_cpi: 0.5,
    index_ratio: 2,
  },
  {
    record_date: '2023-07-11',
    ref_cpi: 0.5,
    index_ratio: 2,
  },
  {
    record_date: '2023-07-10',
    ref_cpi: 0.5,
    index_ratio: 2,
  },
];

export const mockDetailApiData = {
  data: detailTestData,
  meta: {
    labels: {
      record_date: 'Record Date',
      ref_cpi: 'Reference CPI',
      index_ratio: 'Index Ratio',
    },
    dataTypes: {
      first: 'string',
    },
  },
};

export const mockGenericTableData = {
  data: [
    [
      {
        name: 'Title',
        definition: '120 Day Delinquent Debt Referral Compliance Report',
      },
      {
        name: 'Description (Long)',
        definition:
          'The 120 Day Delinquent Debt Referral Compliance Report provides tracking and benchmarking information on federal agencies' +
          'compliance with the Digital Accountability and Transparency Act of 2014 (the DATA Act). The DATA Act requires federal agencies' +
          ' to refer to the Treasury Offset Program legally enforceable non-tax debts that are greater than 120 days delinquent for ' +
          'Administrative Offset. This dataset was designed to increase transparency and provide quick insights into federal agency ' +
          'compliance rates, as well as information on the number of eligible debts, debts referred, and debts not referred each quarter, ' +
          'beginning in Fiscal Year 2016.',
      },
      {
        name: 'Description (Short)',
        definition:
          'Tracking federal agency compliance with DATA Act requirements on referring delinquent debt and the number of eligible and referred ' +
          'debts quarterly. ',
      },
      {
        name: 'Update Frequency',
        definition: 'Updated Quarterly',
      },
      {
        name: 'Date Range',
        definition: '12/31/2015 - 06/30/2023',
      },
      {
        name: 'Topics',
        definition: 'Debt',
      },
      {
        name: 'Publisher',
        definition: 'Debt Management Services',
      },
    ],
  ],
};

export const mockGenericTableColumns = [
  {
    property: 'name',
    name: 'Name',
    order: 1,
    width: 25,
  },
  {
    property: 'definition',
    name: 'Definition',
    order: 2,
    width: 18,
  },
];

export const defaultSelectedColumnsMock = ['record_date', 'src_line_nbr', 'record_calendar_quarter'];
export const defaultColumnsTypeCheckMock = [
  'record_date',
  'intragov_hold_amt',
  'src_line_nbr',
  'mock_small_fraction',
  'mock_percent',
  'mock_percent_string',
  'negative_currency',
];

export const mockPublishedReports = [
  {
    path: '/downloads/mspd_reports/opdm092020.pdf',
    report_group_desc: 'Entire (.pdf)',
    report_date: new Date('2023-07-10'),
    filesize: '188264',
    report_group_sort_order_nbr: 0,
    report_group_id: 3,
  },
  {
    path: '/downloads/mspd_reports/opdx092020.xls',
    report_group_desc: 'Primary Dealers (.xls)',
    report_date: new Date('2020-09-30'),
    filesize: '810496',
    report_group_sort_order_nbr: 1,
    report_group_id: 3,
  },
];

export const defaultColLabels = ['Record Date', 'Source Line Number', 'Calendar Quarter Number'];
export const additionalColLabels = Object.values(mockTableData.meta.labels).filter(label => !defaultColLabels.includes(label));
export const allColLabels = defaultColLabels.concat(additionalColLabels);
