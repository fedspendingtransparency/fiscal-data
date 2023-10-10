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

export const testDataForUserFiltering = [
  {
    facility_desc: 'Room',
    book_value_amt: 14,
  },
  {
    facility_desc: 'Building',
    book_value_amt: 14,
  },
  {
    facility_desc: 'Venue',
    book_value_amt: 14,
  },
  {
    facility_desc: 'Campus',
    book_value_amt: 14,
  },
  {
    facility_desc: 'Building',
    book_value_amt: 14,
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
    property: 'money3',
    name: 'money3',
    order: 14,
    type: 'CURRENCY3'
  },
  {
    property: 'money10',
    name: 'money10',
    order: 15,
    type: 'CURRENCY10'
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

export const ColSelectColConfig = [
  {
    property: 'date',
    name: 'Date'
  },
  {
    property: 'time',
    name: 'Time'
  },
  {
    property: 'name',
    name: 'Name'
  },
];

export const ColSelectTestData = [
  {
    date: '1/1/23',
    time: '1:11',
    name: 'Name1'
  },
  {
    date: '2/2/23',
    time: '2:22',
    name: 'Name2'
  },
  {
    date: '3/3/23',
    time: '3:33',
    name: 'Name3'
  }
];

export const DefaultColSelectTestColumns = ['date', 'time'];

export const ColSelectTestDataRowCount = [
  {
    date: '1/1/23',
    time: '1:11',
    name: 'Name1'
  },
  {
    date: '2/2/23',
    time: '2:22',
    name: 'Name2'
  },
  {
    date: '3/3/23',
    time: '3:33',
    name: 'Name3'
  },
  {
    date: '4/1/23',
    time: '4:11',
    name: 'Name12'
  },
  {
    date: '5/2/23',
    time: '5:22',
    name: 'Name22'
  },
  {
    date: '6/3/23',
    time: '6:33',
    name: 'Name32'
  },
  {
    date: '7/1/23',
    time: '7:11',
    name: 'Name13'
  },
  {
    date: '8/2/23',
    time: '8:22',
    name: 'Name23'
  },
  {
    date: '9/3/23',
    time: '9:33',
    name: 'Name33'
  },
  {
    date: '10/1/23',
    time: '10:11',
    name: 'Name14'
  },
  {
    date: '11/2/23',
    time: '11:22',
    name: 'Name24'
  },
  {
    date: '12/3/23',
    time: '12:33',
    name: 'Name34'
  }
];
