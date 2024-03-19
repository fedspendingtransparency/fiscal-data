import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import React from 'react';
import { getShortForm } from '../../../../../../utils/rounding-utils';
import { yAxisFormatter } from '../savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart-helper';

export const chartCopy = {
  title: 'Correlation Between Inflation and I Bond Sales, FY 2003 – FYTD 2023',
  altText: 'Inflation and I bond sales shown over time. ',
  footer: (
    <p>
      Visit the <CustomLink url="/datasets/electronic-securities-transactions/">Electronic Securities Transactions</CustomLink> dataset to explore and
      download this data. Inflation data is from the{' '}
      <CustomLink url="https://data.bls.gov/cgi-bin/surveymost?bls">Bureau of Labor Statistics</CustomLink>.
    </p>
  ),
};

export const IBondMockData = [
  { year: 2003, sales: 0, inflation: 0 },
  { year: 2005, sales: 2500000000, inflation: 1 },
  { year: 2008, sales: 3000000000, inflation: 2 },
  { year: 2010, sales: 5000000000, inflation: 1 },
  { year: 2013, sales: 4000000000, inflation: 3 },
  { year: 2018, sales: 9000000000, inflation: 2 },
  { year: 2021, sales: 15000000000, inflation: 7.5 },
  { year: 2023, sales: 17000000000, inflation: 7 },
];

export const CustomTooltip = ({ payload = [], setYear, setInflation, setSales }) => {
  if (payload.length > 0) {
    setYear(payload[0]?.payload.year);
    const inflation = payload.find(x => x.dataKey === 'inflation');
    setInflation(inflation.payload.inflation);
    const sales = payload.find(x => x.dataKey === 'sales');
    setSales(sales.payload.sales);
  }
  return <></>;
};
