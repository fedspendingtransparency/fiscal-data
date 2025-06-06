export const mockDateField = 'reporting_date';

const mockYears = {
  from: 2019,
  to: 2020,
};

export const mockData = {
  data: [
    {
      reporting_date: `${mockYears.from}-01-01`,
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
    },
    {
      reporting_date: `${mockYears.to}-01-01`,
      a: 11,
      b: 12,
      c: 13,
      d: 14,
      e: 15,
    },
  ],
  meta: {
    dataTypes: {
      a: 'CURRENCY',
      b: 'not currency',
      c: 'NUMBER',
      d: 'PERCENTAGE',
      e: 'CURRENCY0',
    },
    labels: {
      a: 'A',
      b: 'B',
      c: 'C',
      d: 'D',
      e: 'E',
    },
  },
};
export const mockDataPanelLegend = {
  data: [
    {
      reporting_date: `${mockYears.from}-01-01`,
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 5,
      g: 5,
      h: 5,
      i: 5,
      j: 5,
      k: 5,
      l: 5,
      m: 5,
      n: 5,
    },
    {
      reporting_date: `${mockYears.to}-01-01`,
      a: 11,
      b: 12,
      c: 13,
      d: 14,
      e: 15,
      f: 5,
      g: 5,
      h: 5,
      i: 5,
      j: 5,
      k: 5,
      l: 5,
      m: 5,
      n: 5,
    },
  ],
  meta: {
    dataTypes: {
      a: 'CURRENCY',
      b: 'not currency',
      c: 'NUMBER',
      d: 'PERCENTAGE',
      e: 'CURRENCY0',
      f: 'NUMBER',
      g: 'NUMBER',
      h: 'NUMBER',
      i: 'NUMBER',
      j: 'NUMBER',
      k: 'NUMBER',
      l: 'NUMBER',
      m: 'NUMBER',
      n: 'NUMBER',
    },
    labels: {
      a: 'A',
      b: 'B',
      c: 'C',
      d: 'D',
      e: 'E',
      f: 'F',
      g: 'G',
      h: 'H',
      i: 'I',
      j: 'J',
      k: 'K',
      l: 'L',
      m: 'M',
      n: 'N',
    },
  },
};

export const mockDataWithBillionsOnAxis = {
  data: [
    {
      reporting_date: `${mockYears.from}-01-01`,
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
    },
    {
      reporting_date: `${mockYears.to}-01-01`,
      a: 11,
      b: 12,
      c: 13,
      d: 14,
      e: 1000000000,
    },
  ],
  meta: {
    dataTypes: {
      a: 'CURRENCY',
      b: 'not currency',
      c: 'NUMBER',
      d: 'PERCENTAGE',
      e: 'CURRENCY0',
    },
    labels: {
      a: 'A',
      b: 'B',
      c: 'C',
      d: 'D',
      e: 'E',
    },
  },
};

export const mockPivotWithRounded = { pivotView: { title: 'my selection', dimensionField: 'test', roundingDenomination: 'millions' } };

export const mockPivot = { pivotView: { title: 'my selection', dimensionField: 'test' } };

export const mockSlug = 'mock/slug/here';

export const mockTable = { tableName: 'TableOne' };
