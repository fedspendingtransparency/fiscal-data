import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import React from 'react';

export const chartCopy = {
  altText:
    'A chart demonstrating the sales of different types of savings bonds based on the years they were ' +
    'available. A toggle is available that when selected, adjusts the values shown in the chart for inflation. ',
  inflationToolTip:
    'Adjusting for inflation provides a more accurate comparison between bond sales during different time periods. It shows the real amount of ' +
    'bond sales using the current value of a dollar.',
  footer: (
    <p>
      Visit the <CustomLink url="/datasets/securities-issued-in-treasurydirect/sales">Securities Issued in TreasuryDirect</CustomLink> dataset for
      data since 2001 and the{' '}
      <CustomLink url="https://www.treasurydirect.gov/research-center/history-of-savings-bond/savings-bond-sales/">
        Historical Savings Bonds Sales by Type
      </CustomLink>{' '}
      for data before 2001 to explore this data.
    </p>
  ),
};

export const savingsBondsMap = {
  AD: { color: '#B04ABD', label: 'A - D', hidden: false },
  E: { color: '#DDAA01', label: 'E', hidden: false },
  EE: { color: '#6E338E', label: 'EE', hidden: false },
  F: { color: '#5E9F69', label: 'F', hidden: false },
  G: { color: '#E17141', label: 'G', hidden: false },
  H: { color: '#4F9E99', label: 'H', hidden: false },
  HH: { color: '#A6B557', label: 'HH', hidden: false },
  I: { color: '#CD425B', label: 'I', hidden: false },
  J: { color: '#E0699F', label: 'J', hidden: false },
  K: { color: '#496FD8', label: 'K', hidden: false },
  SN: { color: '#1B1B1B', label: 'SN', hidden: false },
};

export const savingsBonds = ['AD', 'E', 'EE', 'F', 'G', 'H', 'HH', 'I', 'J', 'K', 'SN'];

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
    SN: 500000000,
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
    SN: 1000000000,
  },
  { year: 2015, EE: 5000000000, F: 2000000000, H: 1000000000, HH: 1000000000, I: 22000000000, J: 4000000000, K: 500000000, SN: 125000000 },
  { year: 2023, EE: 3000000000, F: 1000000000, H: 1000000000, HH: 0, I: 2000000000, J: 2000000000, K: 250000000 },
];

export const sortByType = (data, yearField, descField, amtField) => {
  const finalData = [];
  const years = [];
  if (data) {
    data.forEach(entry => {
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
  }
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
