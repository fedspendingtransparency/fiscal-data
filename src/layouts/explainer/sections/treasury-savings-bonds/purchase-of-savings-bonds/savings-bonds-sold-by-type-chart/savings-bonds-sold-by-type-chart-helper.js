export const chartCopy = {
  title: 'Savings Bonds Sold by Type Over Time, FY 1935 – FTYD YYYY',
  altText:
    'A chart demonstrating the sales of different types of savings bonds based on the years they were ' +
    'available. A toggle is available that when selected, adjusts the values shown in the chart for inflation. ',
  inflationToolTip:
    'Adjusting for inflation provides a more accurate comparison between bond sales during different time periods. It shows the real amount of' +
    'bond sales using the current value of a dollar.',
};

export const lineMap = {
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

export const lines = ['ad', 'e', 'ee', 'f', 'g', 'h', 'hh', 'i', 'j', 'k', 'sn'];

export const mockData = [
  { year: 1935, ad: 0, e: 0, f: 1, g: 5, h: 1, hh: 1, i: 0, j: 2, k: 0 },
  { year: 1955, ad: 3, e: 12, f: 3, g: 7, h: 2, hh: 3, i: 0, j: 3, k: 1 },
  { year: 1975, e: 4, f: 2, g: 4, h: 2, hh: 3, i: 8, j: 2, k: 2, sn: 0.5 },
  { year: 1995, e: 1, ee: 18, f: 4, g: 3, h: 3, hh: 2, i: 2, j: 6, k: 1, sn: 1 },
  { year: 2015, ee: 5, f: 2, h: 1, hh: 1, i: 22, j: 4, k: 0.5, sn: 0.125 },
  { year: 2023, ee: 3, f: 1, h: 1, hh: 0, i: 20, j: 2, k: 0.25 },
];
