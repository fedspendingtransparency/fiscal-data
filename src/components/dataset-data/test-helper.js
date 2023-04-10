import { TestData } from '../dtg-table/test-data';
import { subYears, format, addDays } from 'date-fns';

export const latestDate = '2020-04-13';
let testDate = subYears(new Date(2020, 3, 13), 5);
testDate = addDays(testDate, 1);
export const fivePrior = format(testDate, 'yyyy-MM-dd');

const mockYears = {
  from: 2019,
  to: 2020
};
export const mockDateRange = {
  from: new Date(mockYears.from, 0, 1),
  to: new Date(mockYears.to, 0, 1)
};

export const mockEndpoint = 'mock/end/point';

export const mockSelectedTable = {
  endpoint: mockEndpoint,
  fields: [
    {columnName: 'first', dummyProp: 'dummy'},
    {columnName: 'second', dummyProp: 'dummy'},
    {columnName: 'third', dummyProp: 'dummy'},
  ]
};

export const mockSelectedPivot = {
  pivotValue: null,
  pivotView: {
    chartType: "none",
    dimensionField: null,
    filters: null,
    title: "Complete Table"
  }
};

export const mockApiData = {
  data: TestData,
  meta: {
    labels: {
      first: 'First',
      middle: 'Middle',
      last: 'Last'
    },
    dataTypes: {
      first: 'string'
    }
  }
};

export const mockApiDataEmpty = {
  data: [],
  meta: {}
};

export const config = {
  slug: '/mock-dataset/',
  datasetId: 'MOCK-DATASET-ID-0',
  apis : [
    {
      tableName: 'Table 1',
      pathName: 'table-1',
      earliestDate: '2002-01-01',
      latestDate,
      endpoint: 'mockEndpoint',
      rowCount: 4000,
      dateField: 'record_date',
      dataDisplays: [
        { chartType: 'none', dimensionField: null, title: 'Complete Table' },
        { chartType: null, 'dimensionField': 'facility_desc', title: 'By Facility' }
      ],
      fields: [
        {
          columnName: "record_date",
          dataType: "DATE",
          prettyName: "Record Date",
        }
      ]
    },
    {
      tableName: 'Table 2',
      pathName: 'table-2',
      earliestDate: '2002-01-01',
      latestDate,
      endpoint: 'mockEndpoint2',
      rowCount: 4000,
      dateField: 'record_date',
      dataDisplays: [
        { chartType: 'none', dimensionField: null, title: 'Complete Table' },
        { chartType: null, 'dimensionField': 'facility_desc', title: 'By Facility' }
      ],
      valueFieldOptions: ['hot_dog'],
      fields: [
        {
          columnName: 'facility_desc',
          dataType: 'STRING',
          prettyName: 'Facility'
        },
        {
          columnName: 'published_count',
          dataType: 'NUMBER',
          prettyName: 'Or Perish'
        },
        {
          columnName: 'record_date',
          dataType: 'DATE',
          prettyName: 'Record Date'
        },
      ]
    },
    {
      tableName: 'Table 3',
      pathName: 'table-3',
      earliestDate: '2017-01-01',
      latestDate,
      endpoint: 'mockEndpoint3',
      rowCount: 4000,
      dateField: 'record_date',
      dataDisplays: [
        { chartType: 'none', dimensionField: null, title: 'Complete Table' },
        { chartType: null, 'dimensionField': 'facility_desc', title: 'By Facility' }
      ],
      fields: [
        {
          columnName: "record_date",
          dataType: "DATE",
          prettyName: "Record Date",
        },
        {
          columnName: "book_value_amt",
          dataType: "NUMBER",
          prettyName: "Book Value Amount",
        },
        {
          columnName: "facility_desc",
          dataType: "DESK",
          prettyName: "Facilities' Desk",
        }
      ],
      valueFieldOptions: ['book_value_amt']
    },
    {
      tableName: 'Table 4',
      pathName: 'table-4',
      earliestDate: '2017-01-01',
      latestDate,
      endpoint: 'mockEndpoint4',
      rowCount: 7001,
      isLargeDataset: true,
      dateField: 'record_date',
      dataDisplays: [
        { chartType: 'none', dimensionField: null, title: 'Complete Table' },
        { chartType: null, 'dimensionField': 'facility_desc', title: 'By Facility' }
      ],
      fields: [
        {
          columnName: "record_date",
          dataType: "DATE",
          prettyName: "Record Date",
        }
      ]
    },
    {
      tableName: 'Table 5',
      pathName: 'table-5',
      earliestDate: '2017-01-01',
      latestDate,
      endpoint: 'mockEndpoint5',
      rowCount: 150001,
      dateField: 'record_date',
      dataDisplays: [
        {
          chartType: null, 'dimensionField': 'facility_desc', title: 'By Facility',
          aggregateOn: [
            {
              field: 'record_calendar_year',
              type: 'YEAR'
            },
            {
              field: 'record_calendar_month',
              type: 'MONTH'
            }
          ]
        }
      ],
      valueFieldOptions: ['hot_dog'],
      fields: [
        {
          columnName: 'facility_desc',
          dataType: 'STRING',
          prettyName: 'Facility'
        },
        {
          columnName: 'hot_dog',
          dataType: 'STRING',
          prettyName: 'Hot Diggity Dog'
        },
        {
          columnName: 'record_date',
          dataType: 'DATE',
          prettyName: 'Record Date'
        },
      ]
    },
    {
      tableName: 'Table 6',
      pathName: 'table-6',
      earliestDate: '2016-01-01',
      latestDate,
      endpoint: 'mockEndpoint6',
      rowCount: 8001,
      isLargeDataset: true,
      dateField: 'record_date',
      dataDisplays: [
        { chartType: 'none', dimensionField: null, title: 'Complete Table' }
      ],
      fields: [
        {
          columnName: "record_date",
          dataType: "DATE",
          prettyName: "Record Date"
        }
      ]
    },
    {
      tableName: 'Table 7',
      pathName: 'table-7',
      earliestDate: '2015-01-01',
      latestDate,
      endpoint: 'mockEndpoint7',
      rowCount: 9001,
      isLargeDataset: true,
      dateField: 'record_date',
      dataDisplays: [
        { chartType: 'none', dimensionField: null, title: 'Complete Table' }
      ],
      fields: [
        {
          columnName: "record_date",
          dataType: "DATE",
          prettyName: "Record Date"
        }
      ]
    },
    {
      tableName: 'Table 8',
      pathName: 'table-8',
      earliestDate: '2017-01-01',
      latestDate,
      endpoint: 'mockEndpoint8',
      apiId: '222',
      rowCount: 4000,
      dateField: 'record_date',
      dataDisplays: [
        { chartType: 'none', dimensionField: null, title: 'Complete Table' },
        { chartType: null, 'dimensionField': 'facility_desc', title: 'By Facility' }
      ],
      fields: [
        {
          columnName: "record_date",
          dataType: "DATE",
          prettyName: "Record Date",
        },
        {
          columnName: "book_value_amt",
          dataType: "NUMBER",
          prettyName: "Book Value Amount",
        },
        {
          columnName: "facility_desc",
          dataType: "DESK",
          prettyName: "Facilities' Desk",
        }
      ],
      valueFieldOptions: ['book_value_amt']
    },
    {
      tableName: 'Table 9',
      pathName: 'table-9',
      earliestDate: '2017-01-01',
      latestDate,
      endpoint: 'mockEndpoint9',
      rowCount: 8601,
      isLargeDataset: true,
      dateField: 'record_date',
      dataDisplays: [
        { chartType: null, dimensionField: null, title: 'Complete Table' }
      ],
      fields: [
        {
          columnName: "record_date",
          dataType: "DATE",
          prettyName: "Record Date",
        }
      ]
    },
    {
      tableName: 'Table 10',
      pathName: 'table-10',
      earliestDate: '2017-01-01',
      latestDate,
      endpoint: 'mockEndpoint10',
      apiId: '222',
      rowCount: 4000,
      dateField: 'record_date',
      dataDisplays: [
        { chartType: 'none', dimensionField: null, title: 'Complete Table' },
        { chartType: null, 'dimensionField': 'facility_desc', title: 'By Facility' }
      ],
      fields: [
        {
          columnName: "record_date",
          dataType: "DATE",
          prettyName: "Record Date",
        },
        {
          columnName: "book_value_amt",
          dataType: "NUMBER",
          prettyName: "Book Value Amount",
        },
        {
          columnName: "facility_desc",
          dataType: "DESK",
          prettyName: "Facilities' Desk",
        }
      ],
      valueFieldOptions: ['book_value_amt']
    }
  ],
  techSpecs: {
    earliestDate: '2002-01-01',
    latestDate,
  }
};

export const mockLocation = {
  pathname: '/datasets/mock-dataset/'
};

export const mockLocationWithTablePathName = {
  pathname: '/datasets/mock-dataset/table-3'
};

export const mockPivotableData = {
  data: [
    {
      reporting_date: "2020-04-30",
      security_desc: "Federal Financing Bank",
      avg_interest_rate_amt: "2.685"
    },
    {
      reporting_date: "2020-04-30",
      security_desc: "Total Marketable",
      avg_interest_rate_amt: "1.964"
    },
    {
      reporting_date: "2020-04-30",
      security_desc: "Treasury Bills",
      avg_interest_rate_amt: "0.596"
    },
    {
      reporting_date: "2020-04-30",
      security_desc: "Treasury Bonds",
      avg_interest_rate_amt: "3.764"
    },
    {
      reporting_date: "2020-04-30",
      security_desc: "Treasury Floating Rate Note (FRN)",
      avg_interest_rate_amt: "0.285"
    },
    {
      reporting_date: "2020-04-30",
      security_desc: "Treasury Inflation-Protected Securities (TIPS)",
      avg_interest_rate_amt: "0.751"
    },
    {
      reporting_date: "2020-04-30",
      security_desc: "Treasury Notes",
      avg_interest_rate_amt: "2.069"
    },
    {
      reporting_date: "2020-05-31",
      security_desc: "Federal Financing Bank",
      avg_interest_rate_amt: "2.385"
    },
    {
      reporting_date: "2020-05-31",
      security_desc: "Total Marketable",
      avg_interest_rate_amt: "1.264"
    },
    {
      reporting_date: "2020-05-31",
      security_desc: "Treasury Bills",
      avg_interest_rate_amt: "1.596"
    },
    {
      reporting_date: "2020-05-31",
      security_desc: "Treasury Bonds",
      avg_interest_rate_amt: "3.164"
    },
    {
      reporting_date: "2020-05-31",
      security_desc: "Treasury Nickels",
      avg_interest_rate_amt: "3.864"
    }],
  meta: {
    dataTypes: {
      reporting_date: "DATE",
      avg_interest_rate_amt: "PERCENTAGE",
      security_desc: "STRING"
    },
    labels: {
      reporting_date: "Calendar Date",
      avg_interest_rate_amt: "Average Interest Rate Amount",
      security_desc: "Security Description"
    }
  }
};

export const mockAccumulableData = {
  data: [
    {
      record_calendar_year: "2020",
      record_calendar_month: "05",
      class_desc: "Federal Bank",
      cost: "1000.0000"
    },
    {
      record_calendar_year: "2020",
      record_calendar_month: "05",
      class_desc: "Medical Safe",
      cost: "1000002.000"
    },
    {
      record_calendar_year: "2020",
      record_calendar_month: "05",
      class_desc: "Federal Bank",
      cost: "1000.0010"
    },
    {
      record_calendar_year: "2020",
      record_calendar_month: "05",
      class_desc: "Medical Safe",
      cost: "1000200"
    },

    {
      record_calendar_year: "2020",
      record_calendar_month: "05",
      class_desc: "Federal Bank",
      cost: "1000.1000"
    },
    {
      record_calendar_year: "2020",
      record_calendar_month: "05",
      class_desc: "Medical Safe",
      cost: "1020000"
    },

    {
      record_calendar_year: "2020",
      record_calendar_month: "05",
      class_desc: "Federal Bank",
      cost: "1010.0000"
    },
    {
      record_calendar_year: "2020",
      record_calendar_month: "05",
      class_desc: "Medical Safe",
      cost: null
    },

    {
      record_calendar_year: "2020",
      record_calendar_month: "05",
      class_desc: "Federal Bank",
      cost: "-3000"
    },
    {
      record_calendar_year: "2020",
      record_calendar_month: "05",
      class_desc: "Medical Safe",
      cost: "0.0"
    },

    {
      record_calendar_year: "2020",
      record_calendar_month: "04",
      class_desc: "Federal Bank",
      cost: "-"
    },
    {
      record_calendar_year: "2020",
      record_calendar_month: "04",
      class_desc: "Medical Safe",
      cost: "2000000"
    },

    {
      record_calendar_year: "2020",
      record_calendar_month: "04",
      class_desc: "Federal Bank",
      cost: "1000.0001"
    },
    {
      record_calendar_year: "2020",
      record_calendar_month: "04",
      class_desc: "Medical Safe",
      cost: ".20"
    },

    {
      record_calendar_year: "2020",
      record_calendar_month: "04",
      class_desc: "Federal Bank",
      cost: "*"
    },
    {
      record_calendar_year: "2020",
      record_calendar_month: "04",
      class_desc: "Medical Safe",
      cost: "1000000.5"
    }
  ],
  meta: {
    dataTypes: {
      record_calendar_year: "YEAR",
      record_calendar_MONTH: "MONTH",
      cost: "CURRENCY",
      Class_desc: "STRING"
    },
    labels: {
      reporting_date: "Calendar Date",
      record_calendar_year: "Calendar Year",
      record_calendar_month: "Calendar Month",
      cost: "Expended Cost",
      security_desc: "Classification"
    }
  }
};

export const createFilter = (operator, value) => {
  return [{ key: 'testVal', operator, value}];
}

export const filteringOperators = {
  eq10:    createFilter('eq', '10'),
  neq10:   createFilter('neq', '10'),
  gt10:    createFilter('gt', '10'),
  gte10:   createFilter('gte', '10'),
  lt10:    createFilter('lt', '10'),
  lte10:   createFilter('lte', '10'),
  in812:   createFilter('in', '8,12'),
  in8910:  createFilter('in','8,9,10'),
  nin8910: createFilter('nin','8,9,10'),
  noOperator10: [{ key: 'testVal', value: '10' }]
};
