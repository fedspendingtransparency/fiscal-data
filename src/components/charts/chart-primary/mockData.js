function dataGenerator() {
  const startYear = 2006,
    res = [];

  let i = 0;

  for (i; i < 13; i++) {
    res.push({
      reporting_date: `${startYear + i}-01-01`,
      a: 1 + i,
      b: 2 * i,
      c: 3 + 1,
    });
  }

  return res;
}

export const mockData = {
  data: dataGenerator(),
  meta: {
    dataTypes: {
      a: 'CURRENCY',
      b: 'not currency',
      c: 'NUMBER',
    },
    labels: {
      a: 'A',
      b: 'B',
      c: 'C',
    },
  },
};

export const fields = ['a', 'b', 'c'];
export const dateField = 'reporting_date';

export const mockShadingOptions = {
  shading: {
    side: 'under',
    color: 'red',
    hatchDirection: 'down',
  },
  placeInitialMarker: true,
};

export const testDateArray = [
  { reporting_date: '2025-03-15', c: 10, expected: 'Mar 15, 2025' }, // abbr + day + year case
  { reporting_date: '2025-03-16', c: 20, expected: 'Mar 16' }, // default case
  { reporting_date: '2026-01-01', c: 30, expected: '2026' }, // year only case
];

export const testCurrencyArray = [
  {
    d: 1000,
    dataType: 'CURRENCY',
    roundingDenomination: null,
    isRoundedAxis: false,
    expected: '$1 K', // adds denomination, simplifyNumber is called
  },
  {
    d: 1,
    dataType: 'CURRENCY',
    roundingDenomination: 'millions',
    isRoundedAxis: false,
    expected: '$1 Million', // adds denomination, simplifyNumber not called
  },
  {
    d: 50,
    dataType: 'CURRENCY',
    roundingDenomination: 'millions',
    isRoundedAxis: true,
    expected: '$50', // no denomination added
  },
  {
    d: 200,
    dataType: null,
    roundingDenomination: 'millions',
    isRoundedAxis: false,
    expected: '200', // no matching dateType
  },
];
