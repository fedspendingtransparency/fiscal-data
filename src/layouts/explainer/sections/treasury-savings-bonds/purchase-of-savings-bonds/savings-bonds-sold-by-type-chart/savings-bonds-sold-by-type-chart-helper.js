export const chartCopy = {
  title: 'Savings Bonds Sold by Type Over Time, FY 1935 – FTYD YYYY',
  altText:
    'A chart demonstrating the sales of different types of savings bonds based on the years they were ' +
    'available. A toggle is available that when selected, adjusts the values shown in the chart for inflation. ',
  inflationToolTip:
    'Adjusting for inflation provides a more accurate comparison between bond sales during different time periods. It shows the real amount of' +
    'bond sales using the current value of a dollar.',
};

export const colorMap = {
  ad: '#B04ABD',
  e: '#DDAA01',
  ee: '#6E338E',
  f: '#5E9F69',
  g: '#E17141',
  h: '#4F9E99',
  hh: '#A6B557',
  i: '#CD425B',
  j: '#E0699F',
  k: '#496FD8',
  sn: '#1B1B1B',
};

export const lines = ['ad', 'e', 'ee', 'f', 'g', 'h', 'hh', 'i', 'j', 'k', 'sn'];

export const mockData = [
  { year: 1935, ad: 0, e: 0, ee: 1, f: 1, g: 5, h: 1, hh: 1, i: 0, j: 2, k: 0, sn: 0 },
  { year: 1955, ad: 3, e: 12, ee: 1, f: 3, g: 7, h: 2, hh: 3, i: 0, j: 3, k: 1, sn: 0 },
  { year: 1975, ad: 0, e: 4, ee: 10, f: 2, g: 4, h: 2, hh: 3, i: 8, j: 2, k: 2, sn: 0 },
  { year: 1995, ad: 0, e: 1, ee: 18, f: 4, g: 3, h: 3, hh: 2, i: 2, j: 6, k: 1, sn: 1 },
  { year: 2015, ad: 0, e: 0.5, ee: 5, f: 2, g: 3, h: 1, hh: 1, i: 22, j: 4, k: 0.5, sn: 0 },
  { year: 2023, ad: 0, e: 0, ee: 3, f: 1, g: 2, h: 1, hh: 0, i: 20, j: 2, k: 0.25, sn: 0 },
];
