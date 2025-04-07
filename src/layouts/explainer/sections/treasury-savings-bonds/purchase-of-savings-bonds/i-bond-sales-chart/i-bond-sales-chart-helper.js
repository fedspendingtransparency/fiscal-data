import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import React from 'react';
import { analyticsEventHandler } from '../../../../explainer-helpers/explainer-helpers';

export const chartCopy = {
  altText: 'Inflation and I bond sales shown over time.',
  footer: (
    <p>
      Visit the{' '}
      <CustomLink
        url="/datasets/electronic-securities-transactions/"
        onClick={() => analyticsEventHandler('Savings Bonds - Electronics Securities Transactions', 'Savings Bonds Citation Click')}
      >
        Electronic Securities Transactions
      </CustomLink>{' '}
      dataset to explore and download this data. Inflation data is from the{' '}
      <CustomLink
        url="https://data.bls.gov/cgi-bin/surveymost?bls"
        onClick={() => analyticsEventHandler('Savings Bonds - Bureau of Labor Statistics', 'Savings Bonds Citation Click')}
      >
        Bureau of Labor Statistics
      </CustomLink>
      .
    </p>
  ),
};

export const IBondMockData = {
  data: [
    {
      record_calendar_year: 2023,
      record_fiscal_year: 2024,
      record_date: '2023-10-31',
      record_calendar_month: '10',
      net_sales_amt: 14000000000,
    },
    {
      record_calendar_year: 2020,
      record_fiscal_year: 2021,
      record_date: '2020-10-31',
      record_calendar_month: '10',
      net_sales_amt: 15000000000,
    },
    {
      record_calendar_year: 2017,
      record_fiscal_year: 2018,
      record_date: '2017-10-31',
      record_calendar_month: '10',
      net_sales_amt: 9000000000,
    },
    {
      record_calendar_year: 2011,
      record_fiscal_year: 2012,
      record_date: '2011-10-31',
      record_calendar_month: '10',
      net_sales_amt: -4000000000,
    },
    {
      record_calendar_year: 2008,
      record_fiscal_year: 2009,
      record_date: '2008-10-31',
      record_calendar_month: '10',
      net_sales_amt: -1000000000,
    },
  ],
  meta: { 'total-pages': 2 },
};

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
