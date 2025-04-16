import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import React from 'react';
import { analyticsEventHandler } from '../../../../explainer-helpers/explainer-helpers';

export const chartCopy = {
  altText:
    'A chart demonstrating the sales of different types of savings bonds based on the years they were ' +
    'available. The toggle adjusts the values shown in the chart for inflation.  ',
  inflationToolTip:
    'Adjusting for inflation provides a more accurate comparison between bond sales during different time periods. It shows the real amount of ' +
    'bond sales using the current value of a dollar.',
  footer: (
    <p>
      Visit the{' '}
      <CustomLink
        url="/datasets/electronic-securities-transactions/sales"
        id="Electronic Securities Transactions"
        onClick={() => analyticsEventHandler('Electronic Securities Transactions', 'Savings Bonds Citation Click')}
      >
        Electronic Securities Transactions
      </CustomLink>{' '}
      dataset to explore and download this data. Inflation data is from the{' '}
      <CustomLink
        url="https://data.bls.gov/cgi-bin/surveymost?bls"
        id="Bureau of Labor Statistics"
        onClick={() => analyticsEventHandler('Bureau of Labor Statistics', 'Savings Bonds Citation Click')}
      >
        Bureau of Labor Statistics
      </CustomLink>
      .
    </p>
  ),
};

export const fyEndpoint = 'v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings Bond&sort=-record_date&page[size]=1';

export const savingsBondsMap = {
  AD: {
    color: '#B04ABD',
    label: 'A - D',
    hidden: false,
    description:
      'Issued from 1935–1941, these early bonds, or “Baby Bonds” were developed to be a widely accessible type of security ' +
      'to help fund government efforts to alleviate unemployment. They earned the name “Baby Bonds” due to the low starting ' +
      'price of only $25.',
  },
  E: {
    color: '#DDAA01',
    label: 'E',
    hidden: false,
    description:
      'Issued from 1941–1980, E bonds were created in response to World War II and were known as “Defense Bonds” and then ' +
      '“War Bonds”. E Bonds were also the “world’s most widely held security”. They were offered in denominations from $25 ' +
      'to $10,000, with special “memorial” denominations of $200 for President Roosevelt (1945) and $75 for President Kennedy (1964).',
  },
  EE: {
    color: '#6E338E',
    label: 'EE',
    hidden: false,
    description:
      'First issued in 1980 and still available today, the EE bond was modeled after the E bond; however, ' +
      'the EE bond sells at 50% of the face value while E bonds were offered at 75% of face value. ' +
      'EE bonds sold between 2001 and 2011 were designated as “Patriot Bonds” as a way for Americans to express support for anti-terrorism efforts.',
  },
  F: {
    color: '#5E9F69',
    label: 'F',
    hidden: false,
    description:
      'Issued from 1941–1952, F bonds were developed for and targeted toward all investors except commercial banks. These ' +
      'bonds earned interest that was paid when the bond was cashed and could be purchased at 74% of face value. F ' +
      '' +
      'bonds were replaced by J bonds.',
  },
  G: {
    color: '#E17141',
    label: 'G',
    hidden: false,
    description:
      'Issued from 1941–1952, G bonds were developed for and targeted toward all investors except commercial banks. These ' +
      'bonds were considered “current-income”, which meant that they earned interest that was paid every six months, ' +
      'rather than in one lump sum when the bond was redeemed. G bonds were replaced by K bonds.',
  },
  H: {
    color: '#4F9E99',
    label: 'H',
    hidden: false,
    description:
      'Issued from 1952–1979, H bonds were designed to be companion savings bonds to E bonds. They earned the same ' +
      'interest rate but were “current-income” bonds that earned interest that was paid every six months, rather ' +
      'than in one lump sum when the bond was redeemed. H bonds were replaced by HH bonds.',
  },
  HH: {
    color: '#A6B557',
    label: 'HH',
    hidden: false,
    description: 'Sold from 1980–2004, HH bonds replaced H bonds but with different interest rates. HH bonds earn interest for up to 20 years.',
  },
  I: {
    color: '#CD425B',
    label: 'I',
    hidden: false,
    description:
      'Issued initially in 1998 and still available today, I bonds earn a fixed rate of interest and a variable rate ' +
      'based on inflation. From 2006–2007, a special designation of I bonds known as “Gulf Coast Recovery Bonds” were ' +
      'issued to encourage support for recovery efforts in the region damaged by hurricanes.',
  },
  J: {
    color: '#E0699F',
    label: 'J',
    hidden: false,
    description:
      'Issued from 1952–1967, J bonds replaced F bonds. They offered a higher interest rate, had an increased purchase ' +
      'limit of $200,000, and sold for 72% of the face value (versus the I bonds’ 74%).',
  },
  K: {
    color: '#496FD8',
    label: 'K',
    hidden: false,
    description: 'Issued from 1952–1957, K bonds replaced G bonds with a higher interest rate of 2.76% (versus G bonds’ 2.53%).',
  },
};

export const savingsBonds = ['AD', 'E', 'EE', 'F', 'G', 'H', 'HH', 'I', 'J', 'K'];

export const mockData = [
  { year: 1935, AD: 0, E: 0, F: 1000000000, G: 5000000000, H: 1000000000, HH: 1000000000, I: 0, J: 2000000000, K: 0 },
  {
    year: 1955,
    AD: 3000000000,
    E: 12000000000,
    F: 3000000000,
    G: 7000000000,
    H: 2000000000,
    HH: 3000000000,
    I: 5000000000,
    J: 3000000000,
    K: 1000000000,
  },
  {
    year: 1975,
    E: 4000000000,
    F: 2000000000,
    G: 4000000000,
    H: 2000000000,
    HH: 3000000000,
    I: 8000000000,
    J: 2000000000,
    K: 2000000000,
  },
  {
    year: 1995,
    E: 1000000000,
    EE: 18000000000,
    F: 4000000000,
    G: 3000000000,
    H: 3000000000,
    HH: 2000000000,
    I: 2000000000,
    J: 6000000000,
    K: 1,
  },
  { year: 2015, EE: 5000000000, F: 2000000000, H: 1000000000, HH: 1000000000, I: 22000000000, J: 4000000000, K: 500000000 },
  { year: 2023, EE: 3000000000, F: 1000000000, H: 1000000000, HH: 0, I: 2000000000, J: 2000000000, K: 250000000 },
];

export const mockInflationData = [
  { year: 1936, AD: 0, E: 0, F: 2000000000, G: 4000000000, H: 2000000000, HH: 2000000000, I: 0, J: 3000000000, K: 0 },
  {
    year: 1956,
    AD: 2300000000,
    E: 13000000000,
    F: 9000000000,
    G: 6000000000,
    H: 3000000000,
    HH: 2000000000,
    I: 4000000000,
    J: 5000000000,
    K: 2000000000,
  },
  {
    year: 1976,
    E: 7000000000,
    F: 3000000000,
    G: 5000000000,
    H: 2000000000,
    HH: 9000000000,
    I: 7000000000,
    J: 2000000000,
    K: 3000000000,
  },
  {
    year: 1997,
    E: 4000000000,
    EE: 28000000000,
    F: 5000000000,
    G: 4000000000,
    H: 4000000000,
    HH: 1000000000,
    I: 3000000000,
    J: 5000000000,
    K: 1,
  },
  { year: 2016, EE: 7000000000, F: 3000000000, H: 2000000000, HH: 2000000000, I: 12000000000, J: 5000000000, K: 600000000 },
  { year: 2022, EE: 3000000000, F: 1000000000, H: 1000000000, HH: 0, I: 2000000000, J: 2000000000, K: 250000000 },
];

export const sortByType = (data, yearField, descField, amtField) => {
  const finalData = [];
  const years = [];
  const iterableData = Array.isArray(data) ? data : [];
  iterableData.forEach(entry => {
    const fy = entry[yearField];
    const securityClass = entry[descField] === 'A...D' ? 'AD' : entry[descField];
    const netSalesAmt = Number(entry[amtField]);
    let newEntry = {};
    if (!years.includes(fy)) {
      years.push(fy);
      newEntry['year'] = fy;
      newEntry[securityClass] = netSalesAmt;
      finalData.push(newEntry);
    } else {
      const entryIndex = finalData.findIndex(val => val.year === fy);
      newEntry = finalData[entryIndex];
      newEntry[securityClass] = newEntry[securityClass] ? netSalesAmt + Number(newEntry[securityClass]) : netSalesAmt;
      finalData[entryIndex] = newEntry;
    }
  });
  return finalData;
};

export const getXAxisValues = (min, max) => {
  let gap;
  const range = max - min;
  if (max % 5 === 0) {
    gap = range / 5;
  } else {
    const remainder = Math.abs(5 - (range % 5));
    gap = (range + remainder) / 5;
  }
  return [min, min + gap, min + gap * 2, min + gap * 3, min + gap * 4, max];
};

export const yAxisFormatter = value => {
  const trimmed = Math.abs(value).toFixed();
  const inTrillions = trimmed.length > 12;
  const inBillions = trimmed.length > 9;
  const inMillions = trimmed.length > 6;
  const negative = value < 0;
  let divisor;
  if (inTrillions) {
    divisor = 1000000000000;
  } else if (inBillions) {
    divisor = 1000000000;
  } else if (inMillions) {
    divisor = 1000000;
  } else {
    divisor = 1000;
  }

  let appendix;
  let digits = 0;
  if (inTrillions) {
    appendix = ' T';
    digits = 2;
  } else if (inBillions) {
    appendix = ' B';
    digits = 1;
  } else if (value === 0) {
    appendix = '';
  } else if (inMillions) {
    appendix = ' M';
  } else {
    appendix = ' k';
  }
  const display = Math.abs(value / divisor).toFixed(digits) + appendix;
  return negative ? `-$${display}` : `$${display}`;
};
