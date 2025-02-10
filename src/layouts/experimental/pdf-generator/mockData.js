export const mockData = [
  {
    effectiveDate: '01/01/2025',
    sharesPar: '1,541,751.13',
    transCode: '1-10 STATE DEPOSITS',
    memoNumber: 3382101,
    location: 'CA',
    accountNumber: 'CA-505',
  },
  {
    effectiveDate: '01/01/2025',
    sharesPar: '1,541,751.13',
    transCode: '1-10 STATE DEPOSITS',
    memoNumber: 3382101,
    location: '',
    accountNumber: 'CA-505',
  },
  {
    effectiveDate: '01/03/2025',
    sharesPar: '732,100.56',
    transCode: '34-10 LOAN REPAYMENT FROM STATE TO FUA',
    memoNumber: 3382107,
    location: 'CA',
    accountNumber: 'CA-505',
  },
  {
    effectiveDate: '01/10/2025',
    sharesPar: '-2,875,442.00',
    transCode: '31-50 GT TO STATE UI ACCOUNT',
    memoNumber: 3382108,
    location: '',
    accountNumber: 'CA-505',
  },
  {
    effectiveDate: '01/10/2025',
    sharesPar: '-2,875,442.00',
    transCode: '31-50 GT TO STATE UI ACCOUNT',
    memoNumber: 3382108,
    location: 'CA',
    accountNumber: 'CA-505',
  },
  {
    effectiveDate: '01/14/2025',
    sharesPar: '485,190.99',
    transCode: 'CWC OUT',
    memoNumber: 3382110,
    location: 'CA',
    accountNumber: 'CA-505',
  },
  {
    effectiveDate: '01/15/2025',
    sharesPar: '3,167,250.00',
    transCode: 'CWC IN',
    memoNumber: 3382112,
    location: 'CA',
    accountNumber: 'CA-505',
  },
  {
    effectiveDate: '01/20/2025',
    sharesPar: '1,250,000.00',
    transCode: 'LOAN REPAYMENT',
    memoNumber: 3382113,
    location: 'CA',
    accountNumber: 'CA-505',
  },
  {
    effectiveDate: '01/20/2025',
    sharesPar: '1,250,000.00',
    transCode: 'LOAN REPAYMENT',
    memoNumber: 3382113,
    location: '',
    accountNumber: 'CA-505',
  },
];
export const mockData2 = [
  {
    transactionDescription: '11-10 STATE DEPOSITS',
    sharesPar: '$1,541,751.13',
  },
  {
    transactionDescription: '11-10 LOAN REPAYMENT',
    sharesPar: '$751.13',
  },
  {
    transactionDescription: '11-10 LOAN REPAYMENT FROM STATE TO FUA',
    sharesPar: '$541,751.13',
  },
  {
    transactionDescription: '11-10 CWC IN',
    sharesPar: '$54,751.13',
  },
];

export const mockDataColConfig = {
  effectiveDate: { width: 60, prettyName: 'Effective Date' },
  sharesPar: { width: 50, prettyName: 'Shares / Par' },
  transCode: { width: 190, prettyName: 'Transaction Code' },
  memoNumber: { width: 60, prettyName: 'Memo Number' },
  location: { width: 50, prettyName: 'Location' },
  accountNumber: { width: 70, prettyName: 'Account Number' },
  transactionDescription: { width: 130, prettyName: 'Transaction Description' },
};
export const mockData2ColConfig = {
  sharesPar: { width: 20, prettyName: 'Shares / Par', style: { textAlign: 'right' } },
  transactionDescription: { width: 180, prettyName: 'Transaction Description' },
};
