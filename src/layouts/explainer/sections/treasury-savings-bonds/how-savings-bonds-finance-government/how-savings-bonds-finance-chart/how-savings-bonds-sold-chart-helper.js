export const chartCopy = {
  title: 'Savings Bonds Sold as a Percentage of Total Debt Held by the Public, as of {Month YYYY (as of date for visualization)} ',
  altText:
    'A pie chart showing the percentage of U.S. debt held by the public that is marketable versus non-marketable. As of ' +
    '{Month YYYY (as of date for visualization)}, non-marketable securities make up {XX} percent, and savings bonds make up {XX} ' +
    ' percent of the debt held by the public.',
};

export const mockDataOne = [
  { name: 'Marketable Securities', value: 391.2, security: false, securityType: 'Marketable' },
  { name: 'Non-Marketable Securities', value: 8.8, security: true, securityType: 'Non-Marketable' },
];
export const mockDataTwo = [
  { name: 'Bonds 1', value: 5, security: false, securityType: 'Marketable' },
  { name: 'Bonds 2', value: 30, security: false, securityType: 'Marketable' },
  { name: 'Bonds 3', value: 65, security: false, securityType: 'Marketable' },
  { name: 'Bonds 4', value: 80, security: false, securityType: 'Marketable' },
  { name: 'Bonds 5', value: 211.2, security: false, securityType: 'Marketable' },
  { name: 'Savings Bonds 1', value: 4.4, security: true, securityType: 'Non-Marketable' },
  { name: 'Savings Bonds', value: 2.4, security: true, securityType: 'Non-Marketable' },
  { name: 'Other', value: 2, security: true, securityType: 'Non-Marketable' },
];
