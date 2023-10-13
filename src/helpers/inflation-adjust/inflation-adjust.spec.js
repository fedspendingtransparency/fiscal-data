import { adjustDataForInflation } from './inflation-adjust';

describe('inflation adjustment functionality', () => {
  const mockDataset = [
    {
      dollarValue: '120',
      dateValue: '2000-12-01',
    },
    {
      dollarValue: '150',
      dateValue: '2010-12-01',
    },
    {
      dollarValue: '180',
      dateValue: '2020-12-01',
    },
  ];

  const mockCpiDataset = {
    '2000': '5',
    '2010': '10',
    '2020': '15',
  };

  const mockAdjustedData = [
    {
      dollarValue: 360,
      dateValue: '2000-12-01',
    },
    {
      dollarValue: 225,
      dateValue: '2010-12-01',
    },
    {
      dollarValue: 180,
      dateValue: '2020-12-01',
    },
  ];

  it('correctly adjusts for inflation', () => {
    const adjustedData = adjustDataForInflation(mockDataset, 'dollarValue', 'dateValue', mockCpiDataset);

    expect(adjustedData).not.toEqual(mockDataset);
    expect(adjustedData).toEqual(mockAdjustedData);
  });
});
