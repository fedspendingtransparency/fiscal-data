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
