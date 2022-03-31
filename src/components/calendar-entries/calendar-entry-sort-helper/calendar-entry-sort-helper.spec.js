import { separateEntriesByDate, separateEntriesByName } from './calendar-entry-sort-helper';

describe('Date helper', () => {
  const entries = [
    {
      dataset: {
        name: 'abc',
        slug: '/abc'
      },
      date: '2021-10-13',
      time: '1200',
      released: false
    },
    {
      dataset: {
        name: 'bcd',
        slug: '/bcd'
      },
      date: '2021-10-15',
      time: '1800',
      released: false
    },
    {
      dataset: {
        name: 'cde',
        slug: '/cde'
      },
      date: '2021-11-13',
      time: '1900',
      released: false
    },
    {
      dataset: {
        name: 'az',
        slug: '/az'
      },
      date: '2021-10-13',
      time: '1500',
      released: false
    },
    {
      dataset: {
        name: 'xyz',
        slug: '/xyz'
      },
      date: '2021-12-13',
      time: '1159',
      released: false
    },
    {
      dataset: {
        name: 'ccc',
        slug: '/ccc'
      },
      date: '2021-05-08',
      time: '1900',
      released: false
    },
  ];

  const sortedByName = {
    a: [
      {
        dataset: {
          name: 'abc',
          slug: '/abc'
        },
        date: '2021-10-13',
        time: '1200',
        released: false
      },
      {
        dataset: {
          name: 'az',
          slug: '/az'
        },
        date: '2021-10-13',
        time: '1500',
        released: false
      }
    ],
    b: [
      {
        dataset: {
          name: 'bcd',
          slug: '/bcd'
        },
        date: '2021-10-15',
        time: '1800',
        released: false
      }
    ],
    c: [
      {
        dataset: {
          name: 'ccc',
          slug: '/ccc'
        },
        date: '2021-05-08',
        time: '1900',
        released: false
      },
      {
        dataset: {
          name: 'cde',
          slug: '/cde'
        },
        date: '2021-11-13',
        time: '1900',
        released: false
      }
    ],
    x: [
      {
        dataset: {
          name: 'xyz',
          slug: '/xyz'
        },
        date: '2021-12-13',
        time: '1159',
        released: false
      }
    ]
  };

  const sortedByDate = {
    'Wednesday October 13, 2021': [
      {
        dataset: {
          name: 'abc',
          slug: '/abc'
        },
        date: '2021-10-13',
        time: '1200',
        released: false
      },
      {
        dataset: {
          name: 'az',
          slug: '/az'
        },
        date: '2021-10-13',
        time: '1500',
        released: false
      }
    ],
    'Friday October 15, 2021': [
      {
        dataset: {
          name: 'bcd',
          slug: '/bcd'
        },
        date: '2021-10-15',
        time: '1800',
        released: false
      }
    ],
    'Saturday November 13, 2021': [
      {
        dataset: {
          name: 'cde',
          slug: '/cde'
        },
        date: '2021-11-13',
        time: '1900',
        released: false
      }
    ],
    'Monday December 13, 2021': [
      {
        dataset: {
          name: 'xyz',
          slug: '/xyz'
        },
        date: '2021-12-13',
        time: '1159',
        released: false
      }
    ]
  };

  it('separates the entries by name', () => {
    expect(separateEntriesByName(entries)).toMatchObject(sortedByName)
  });

  it('separates the entries by date', () => {
    expect(separateEntriesByDate(entries)).toMatchObject(sortedByDate)
  });
});
