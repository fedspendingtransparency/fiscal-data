export const chartCopy = {
  title: 'Savings Bonds Sold by Type Over Time, FY 1935 – FTYD YYYY',
  altText:
    'A chart demonstrating the sales of different types of savings bonds based on the years they were ' +
    'available. A toggle is available that when selected, adjusts the values shown in the chart for inflation. ',
  inflationToolTip:
    'Adjusting for inflation provides a more accurate comparison between bond sales during different time periods. It shows the real amount of' +
    'bond sales using the current value of a dollar.',
};

export const savingsBondsMap = {
  ad: { color: '#B04ABD', label: 'A - D', hidden: false },
  e: { color: '#DDAA01', label: 'E', hidden: false },
  ee: { color: '#6E338E', label: 'EE', hidden: false },
  f: { color: '#5E9F69', label: 'F', hidden: false },
  g: { color: '#E17141', label: 'G', hidden: false },
  h: { color: '#4F9E99', label: 'H', hidden: false },
  hh: { color: '#A6B557', label: 'HH', hidden: false },
  i: { color: '#CD425B', label: 'I', hidden: false },
  j: { color: '#E0699F', label: 'J', hidden: false },
  k: { color: '#496FD8', label: 'K', hidden: false },
  sn: { color: '#1B1B1B', label: 'SN', hidden: false },
};

export const savingsBonds = ['ad', 'e', 'ee', 'f', 'g', 'h', 'hh', 'i', 'j', 'k', 'sn'];

export const mockData = [
  { year: 1935, ad: 0, e: 0, f: 1000000000, g: 5000000000, h: 1000000000, hh: 1000000000, i: 0, j: 2000000000, k: 0 },
  {
    year: 1955,
    ad: 3000000000,
    e: 12000000000,
    f: 3000000000,
    g: 7000000000,
    h: 2000000000,
    hh: 3000000000,
    i: 5000000000,
    j: 3000000000,
    k: 1000000000,
  },
  {
    year: 1975,
    e: 4000000000,
    f: 2000000000,
    g: 4000000000,
    h: 2000000000,
    hh: 3000000000,
    i: 8000000000,
    j: 2000000000,
    k: 2000000000,
    sn: 500000000,
  },
  {
    year: 1995,
    e: 1000000000,
    ee: 18000000000,
    f: 4000000000,
    g: 3000000000,
    h: 3000000000,
    hh: 2000000000,
    i: 2000000000,
    j: 6000000000,
    k: 1,
    sn: 1000000000,
  },
  { year: 2015, ee: 5000000000, f: 2000000000, h: 1000000000, hh: 1000000000, i: 22000000000, j: 4000000000, k: 500000000, sn: 125000000 },
  { year: 2023, ee: 3000000000, f: 1000000000, h: 1000000000, hh: 0, i: 2000000000, j: 2000000000, k: 250000000 },
];
