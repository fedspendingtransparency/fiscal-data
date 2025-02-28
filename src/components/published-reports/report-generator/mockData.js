export const mockData = [
  {
    eff_date: '01/01/2025',
    shares_per_par: '1,541,751.13',
    trans_cd: '1-10 STATE DEPOSITS',
    memo_nbr: 3382101,
    location_cd: 'CA',
    acct_nbr: 'CA-505',
  },
  {
    eff_date: '01/01/2025',
    shares_per_par: '1,541,751.13',
    trans_cd: '1-10 STATE DEPOSITS',
    memo_nbr: 3382101,
    location_cd: '',
    acct_nbr: 'CA-505',
  },
  {
    eff_date: '01/03/2025',
    shares_per_par: '732,100.56',
    trans_cd: '34-10 LOAN REPAYMENT FROM STATE TO FUA',
    memo_nbr: 3382107,
    location_cd: 'CA',
    acct_nbr: 'CA-505',
  },
  {
    eff_date: '01/10/2025',
    shares_per_par: '-2,875,442.00',
    trans_cd: '31-50 GT TO STATE UI ACCOUNT',
    memo_nbr: 3382108,
    location_cd: '',
    acct_nbr: 'CA-505',
  },
  {
    eff_date: '01/10/2025',
    shares_per_par: '-2,875,442.00',
    trans_cd: '31-50 GT TO STATE UI ACCOUNT',
    memo_nbr: 3382108,
    location_cd: 'CA',
    acct_nbr: 'CA-505',
  },
  {
    eff_date: '01/14/2025',
    shares_per_par: '485,190.99',
    trans_cd: 'CWC OUT',
    memo_nbr: 3382110,
    location_cd: 'CA',
    acct_nbr: 'CA-505',
  },
  {
    eff_date: '01/15/2025',
    shares_per_par: '3,167,250.00',
    trans_cd: 'CWC IN',
    memo_nbr: 3382112,
    location_cd: 'CA',
    acct_nbr: 'CA-505',
  },
  {
    eff_date: '01/20/2025',
    shares_per_par: '1,250,000.00',
    trans_cd: 'LOAN REPAYMENT',
    memo_nbr: 3382113,
    location_cd: 'CA',
    acct_nbr: 'CA-505',
  },
  {
    eff_date: '01/20/2025',
    shares_per_par: '1,250,000.00',
    trans_cd: 'LOAN REPAYMENT',
    memo_nbr: 3382113,
    location_cd: '',
    acct_nbr: 'CA-505',
  },
];
export const mockData2 = [
  {
    trans_desc_cd: '11-10 STATE DEPOSITS',
    shares_per_par: '$1,541,751.13',
  },
  {
    trans_desc_cd: '11-10 LOAN REPAYMENT',
    shares_per_par: '$751.13',
  },
  {
    trans_desc_cd: '11-10 LOAN REPAYMENT FROM STATE TO FUA',
    shares_per_par: '$541,751.13',
  },
  {
    trans_desc_cd: '11-10 CWC IN',
    shares_per_par: '$54,751.13',
  },
];

export const mockDataColConfig = {
  eff_date: { width: 60, prettyName: 'Effective Date' },
  shares_per_par: { width: 50, prettyName: 'Shares / Par' },
  trans_cd: { width: 190, prettyName: 'Transaction Code' },
  memo_nbr: { width: 60, prettyName: 'Memo Number' },
  location_cd: { width: 50, prettyName: 'Location' },
  acct_nbr: { width: 70, prettyName: 'Account Number' },
  trans_desc_cd: { width: 130, prettyName: 'Transaction Description' },
};
export const mockData2ColConfig = {
  shares_per_par: { width: 20, prettyName: 'Shares / Par', style: { textAlign: 'right' } },
  trans_desc_cd: { width: 180, prettyName: 'Transaction Description' },
};

export const accountStatementReportConfig = {
  documentTitle: 'Account Statement Report',
  tables: [
    {
      fields: ['eff_date', 'shares_per_par', 'trans_cd', 'trans_desc_cd', 'memo_nbr', 'location_cd', 'acct_nbr'],
    },
  ],
};

export const config = {
  fields: [
    {
      columnName: 'acct_statement',
      dataType: 'STRING',
      definition: 'The account number assigned to the State selected for Choose an Account.',
      isRequired: 1,
      prettyName: 'Account Statement',
      tableName: 'Account Statement',
    },
    {
      columnName: 'eff_date',
      dataType: 'DATE',
      definition: 'The effective date of the actual activity populated on the line.',
      isRequired: 1,
      prettyName: 'Effective Date',
    },
    {
      columnName: 'shares_per_par',
      dataType: 'NUMBER',
      definition: 'The debit or credit amount associated with the transaction.',
      isRequired: 1,
      prettyName: 'Shares / Par',
    },
    {
      columnName: 'trans_cd',
      dataType: 'STRING',
      definition: 'The code associated with the transaction description.',
      isRequired: 1,
      prettyName: 'Trans Code',
    },
    {
      columnName: 'trans_desc_cd',
      dataType: 'STRING',
      definition: 'The description of the transaction code.',
      isRequired: 1,
      prettyName: 'Transaction Description Code',
    },
    {
      columnName: 'memo_nbr',
      dataType: 'STRING',
      definition: 'The memo number for a specific transaction.',
      isRequired: 1,
      prettyName: 'Memo Number',
    },
    {
      columnName: 'location_cd',
      dataType: 'STRING',
      definition: 'The 2 digit state code representing the location of the transaction.',
      isRequired: 1,
      prettyName: 'Location',
    },
    {
      columnName: 'acct_nbr',
      dataType: 'STRING',
      definition: 'Represents the state code or federal value selected for a specific account statement.',
      isRequired: 1,
      prettyName: 'Account Number',
    },
    {
      columnName: 'acct_desc',
      dataType: 'STRING',
      definition: 'The description of the state code or federal value selected for a specific account statement.',
      isRequired: 1,
      prettyName: 'Account Description',
    },
    {
      columnName: 'report_type',
      dataType: 'STRING',
      definition: 'Represents whether the transaction is associated with a state or federal account statement.',
      isRequired: 1,
      prettyName: 'Report Type',
    },
    {
      columnName: 'record_fiscal_year',
      dataType: 'YEAR',
      definition: 'The fiscal year associated with record_date. The f… fiscal year runs from October 1 to September 30.',
      isRequired: 1,
      prettyName: 'Fiscal Year',
    },
    {
      columnName: 'record_fiscal_quarter',
      dataType: 'QUARTER',
      definition: 'The fiscal quarter associated with record_date. Fo…arch, Q3 - April to June, Q4 - July to September.',
      isRequired: 1,
      prettyName: 'Fiscal Quarter Number',
    },
    {
      columnName: 'record_calendar_year',
      dataType: 'YEAR',
      definition: 'The calendar year associated with record_date.',
      isRequired: 1,
      prettyName: 'Calendar Year',
    },
    {
      columnName: 'record_calendar_quarter',
      dataType: 'QUARTER',
      definition: 'The calendar quarter associated with record_date.',
      isRequired: 1,
      prettyName: 'Calendar Quarter Number',
    },
    {
      columnName: 'record_calendar_month',
      dataType: 'MONTH',
      definition: 'The calendar month associated with record_date.',
      isRequired: 1,
      prettyName: 'Calendar Month Number',
    },
    {
      columnName: 'record_calendar_day',
      dataType: 'DAY',
      definition: 'The calendar day associated with record_date.',
      isRequired: 1,
      prettyName: 'Calendar Day Number',
    },
  ],
};
