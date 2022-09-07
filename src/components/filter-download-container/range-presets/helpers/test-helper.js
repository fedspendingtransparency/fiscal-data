export const PRESETS = {
  current: {
    key: 'current',
    expectedPath: 'current_report'
  },
  years: [
    {
      years: 1,
      expectedPath: '1_year'
    },
    {
      years: 5,
      expectedPath: '5_years'
    },
    {
      years: 10,
      expectedPath: '10_years'
    },
    {
      years: 1000,
      expectedPath: '1000_years'
    }
  ],
  all: {
    key: 'all',
    expectedPath: 'all_years'
  }
};

export const TABLE_OBJ = {
  earliestDate: '2001-01-01',
  latestDate: '2021-01-06'
};

// just to simplify the output ranges for testing clarity
export const testReformatter = (range) => `${range.from.toISOString().substr(0,10)} - ${range.to.toISOString().substr(0,10)}`;
