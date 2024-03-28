export const mockDatasetOne = [
  { name: 'Marketable Securities', value: 80 },
  { name: 'Non-Marketable Securities', value: 20 },
];

export const mockDatasetTwo = [
  { name: 'Bonds 1', value: 20 },
  { name: 'Bonds 2', value: 30 },
];

export const expectedResultOne = [
  { name: 'Marketable Securities', value: 80, percent: 80.00 },
  { name: 'Non-Marketable Securities', value: 20, percent: 20.00 },
];

export const expectedResultTwo = [
  { name: 'Bonds 1', value: 20, percent: 40.00 },
  { name: 'Bonds 2', value: 30, percent: 60.00 },
]
