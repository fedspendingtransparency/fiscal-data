import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import React from 'react';

export const chartCopy = {
  title: 'Correlation Between Inflation and I Bond Sales, 2003 – FYTD 2023',
  altText: 'Inflation and I bond sales shown over time. ',
  footer: (
    <>
      Visit the <CustomLink url="datasets/electronic-securities-transactions/">Electronic Securities Transactions</CustomLink> dataset to explore and
      download this data. Inflation data is from the{' '}
      <CustomLink url="https://data.bls.gov/cgi-bin/surveymost?bls">Bureau of Labor Statistics</CustomLink>.
    </>
  ),
};
