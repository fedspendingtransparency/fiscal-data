export const TestData = [
    {
        first: 'Brennah',
        age: 14,
        middle: 'McRae',
        last: 'Francis',
        birthplace: 'Ft. Collins, CO'
    },
    {
        first: 'Corinne',
        age: 10,
        middle: 'Kennedy',
        last: 'Francis',
        birthplace: 'North Kansas City, MO'
    },
    {
        first: 'Avelyn',
        age: 9,
        middle: 'Reeves',
        last: 'Francis',
        birthplace: 'North Kansas City, MO'
    },
    {
        first: 'Frodo',
        age: 50,
        middle: 'unknown',
        last: 'Baggins',
        birthplace: 'Hobbiton, Shire'
    },
    {
        first: 'Samwise',
        age: 32,
        middle: 'unknown',
        last: 'Gamgee',
        birthplace: 'Hobbiton, Shire'
    },
    {
        first: 'Peregrin',
        age: 30,
        middle: 'unknown',
        last: 'Took',
        birthplace: 'Tuckborough, Buckland'
    },
    {
        first: 'Meriadoc',
        age: 30,
        middle: 'unknown',
        last: 'Brandybuck',
        birthplace: 'Brandy Hall, Buckland'
    }
];

export const TestData2 = [
  {
    first: 'Brennah',
    middle: 'McRae',
    last: 'Francis'
  },
  {
    first: 'Corinne',
    middle: 'Kennedy',
    last: 'Francis'
  }
];

export const TestDataOneRow = [
  {
    first: 'Brennah',
    middle: 'McRae',
    last: 'Francis'
  }
];

export const TestPivotDataWithVaryingColSets = [
  {
    age: 14,
    middle: 'McRae'
  },
  {
    middle: 'Kennedy',
    last: 'Francis',
    birthplace: 'North Kansas City, MO'
  },
  {
    first: 'Avelyn',
    age: 9,
    middle: 'Reeves',
    last: 'Francis'
  },
  {
    first: 'Frodo',
    age: 50,
    middle: 'unknown',
    birthplace: 'Hobbiton, Shire'
  },
  {
    last: 'Gamgee',
    birthplace: 'Hobbiton, Shire'
  }
];

export const ColumnConfig = [
    {
        property: 'first',
        name: 'First Name',
        order: 1
    },
    {
        property: 'last',
        name: 'Last',
        order: 3,
        width: 40
    },
    {
        property: 'middle',
        name: 'Middle',
        order: 2
    }
];

export const ColumnConfig2 = [
  {
    property: 'first',
    name: 'First Name',
    order: 1,
    type: 'none'
  },
  {
    property: 'last',
    name: 'Last',
    order: 3,
    width: 40,
    type: 'DATE'
  },
  {
    property: 'middle',
    name: 'Middle',
    order: 2,
    type: 'NUMBER'
  },
  {
    property: 'money',
    name: 'money',
    order: 12,
    type: 'CURRENCY'
  },
  {
    property: 'percent',
    name: 'percent',
    order: 4,
    type: 'PERCENTAGE'
  }
];

export const shortPaginatedDataResponse = {
  data: [
    {
      record_date: '2021-01-21',
      account_type: "Federal Reserve Account",
      close_today_bal: "1639728",
      open_fiscal_year_bal: "1781679"
    },
    {
      record_date: '2021-01-21',
      account_type: "Federal Reserve Account",
      close_today_bal: "1639728",
      open_fiscal_year_bal: "1781679"
    },
    {
      record_date: '2021-01-21',
      account_type: "Federal Reserve Account",
      close_today_bal: "1639728",
      open_fiscal_year_bal: "1781679"
    }
  ],
  meta: {
    'total-count': 3,
    'total-pages': 1
  }
};

export const longerPaginatedDataResponse = {
  data: [
    {
      record_date: '2021-01-21',
      account_type: "Federal Reserve Account",
      close_today_bal: "1639728",
      open_fiscal_year_bal: "1781679"
    },
    {
      record_date: '2021-01-21',
      account_type: "Federal Reserve Account",
      close_today_bal: "1639728",
      open_fiscal_year_bal: "1781679"
    },
    {
      record_date: '2021-01-21',
      account_type: "Federal Reserve Account",
      close_today_bal: "1639728",
      open_fiscal_year_bal: "1781679"
    },
    {
      record_date: '2021-01-21',
      account_type: "Federal Reserve Account",
      close_today_bal: "1639728",
      open_fiscal_year_bal: "1781679"
    },
    {
      record_date: '2021-01-21',
      account_type: "Federal Reserve Account",
      close_today_bal: "1639728",
      open_fiscal_year_bal: "1781679"
    }
  ],
  meta: {
    'total-count': 6,
    'total-pages': 1
  }
};

export const mockPaginatedTableProps = {
  data: null,
  selectedTable: {
    dateField: 'record_date',
    endpoint: 'v1/accounting/dts/dts_table_1'
  },
  dateRange: {
    from: new Date(2021, 0, 21),
    to: new Date(2021, 0, 21)
  },
  serverSidePagination: "v1/accounting/dts/dts_table_1",
  shouldPage: true
};
