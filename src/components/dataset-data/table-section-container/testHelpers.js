import {
  TestData,
  TestData2,
  testDataForUserFiltering,
  TestPivotDataWithVaryingColSets
} from '../../dtg-table/test-data';

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

export const mockApiDataUserFilterable = {
  data: [],
  meta: {
    labels: {
      facility_desc: 'Facility Description',
      book_value_amt: 'Book Value Amount'
    },
    dataTypes: {
      facility_desc: 'string'
    }
  }
};

 export const mockApiPivotData = {
    data: TestPivotDataWithVaryingColSets,
    meta: {
      labels: {
        first: 'First',
        middle: 'Middle',
        last: 'Last',
        birthplace: 'Place of Birth',
        age: 'Age',
        record_date: 'Record Date'
      },
      dataTypes: {
        first: 'string',
        middle: 'string',
        last: 'string',
        birthplace: 'string',
        age: 'number',
        record_date: 'date'
      }
    }
  };

  const mockApiData2 = {
    data: TestData,
    meta: {
      labels: {
        first: 'First',
        middle: 'Middle',
        last: 'Last',
        next: 'next',
        then: 'then',
        and: 'and',
        more: 'more'
      },
      dataTypes: {
        first: 'string'
      }
    }
  };

  const mockApiData3 = {
    data: TestData2,
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

  const mockYears = {
    from: 2019,
    to: 2020
  };

  export const mockDateRange = {
    from: new Date(mockYears.from, 0, 1),
    to: new Date(mockYears.to, 0, 1)
  };

  export const selectedTableMoreFields = {
    apiId: 1,
    tableName: 'Table 1',
    fields: [
      { columnName: 'facility_desc', 'prettyName': 'Facility Description', 'dataType': 'string' },
      { columnName: 'book_value_amt', 'prettyName': 'Book Value', 'dataType': 'string' },
      { columnName: 'report_date', 'prettyName': 'Report Date', 'dataType': 'date' },
      { columnName: 'col_1', 'prettyName': 'Column 1', 'dataType': 'string' },
      { columnName: 'col_2', 'prettyName': 'Column 2', 'dataType': 'string' },
      { columnName: 'col_3', 'prettyName': 'Column 3', 'dataType': 'string' },
      { columnName: 'col_4', 'prettyName': 'Column 4', 'dataType': 'string' },
    ],
  };

  export const selectedTableLessFields = {
    apiId: 2,
    tableName: 'Table 1',
    fields: [
      { columnName: 'facility_desc', 'prettyName': 'Facility Description', 'dataType': 'string' },
      { columnName: 'book_value_amt', 'prettyName': 'Book Value', 'dataType': 'string' },
      { columnName: 'report_date', 'prettyName': 'Report Date', 'dataType': 'date' }
    ],
    dataDisplays: [
      { chartType: 'none', dimensionField: null, title: 'Complete Table' },
      { chartType: null, 'dimensionField': 'facility_desc', title: 'By Facility' }
    ],
  };

  export const mockTableWithPivot = {
    apiId: 3,
    tableName: 'Debt to the Nickel',
    dateField: 'record_date',
    dataDisplays: [
      { chartType: 'none', dimensionField: null, title: 'Complete Table'},
      { chartType: null, 'dimensionField': 'facility_desc', title: 'By Facility', aggregateOn: {}}
    ],
    fields: [
      { columnName: 'facility_desc', 'prettyName': 'Facility Description', 'dataType': 'string' },
      { columnName: 'book_value_amt', 'prettyName': 'Book Value', 'dataType': 'string' },
      { columnName: 'report_date', 'prettyName': 'Report Date', 'dataType': 'date' }
    ],
    valueFieldOptions: ['book_value_amt']
  };

  export const mockTableWithNoChartAvailable = {
    apiId: 4,
    tableName: 'Debt to the Nickel',
    dataDisplays: [
      { chartType: 'none', dimensionField: null, title: 'Complete Table'}
    ],
    fields: [
      { columnName: 'facility_desc', 'prettyName': 'Facility Description', 'dataType': 'string' },
      { columnName: 'book_value_amt', 'prettyName': 'Book Value', 'dataType': 'string' }
    ],
    valueFieldOptions: ['book_value_amt']
  };

export const mockTableWithUserFilterAvailable = {
  apiId: 4,
  tableName: 'Exchange Rates',
  dataDisplays: [
    { dimensionField: null, title: 'Complete Table' }
  ],
  fields: [
    { columnName: 'facility_desc', 'prettyName': 'Facility Description', 'dataType': 'string' },
    { columnName: 'book_value_amt', 'prettyName': 'Book Value', 'dataType': 'string' }
  ],
  valueFieldOptions: ['book_value_amt'],
  userFilter: {
    label: 'Facility Description',
    field: 'facility_desc',
    notice: 'hello',
    optionValues: ['Building', 'Room', 'Venue', 'Campus', 'Auditorium'],
    dataUnmatchedMessage: 'Sorry, no facilities of that type for the date range.'
  }
};

  export const mockConfig = {
    name: 'my name',
    slug: 'mock/slug/here',
    apis: [
      selectedTableLessFields,
      selectedTableMoreFields,
      mockTableWithNoChartAvailable,
      mockTableWithPivot
    ]
  };

  export const pivotFields = [{
    columnName: "avg_interest_rate_amt",
    PrettyName: "Floccinaucinihilipilification."}];

  export const selectedPivot = {
    pivotView: { "chartType": null, "dimensionField": "facility_desc", "title": "By Facility" },
    pivotValue: pivotFields[0]
  };

  export const selectedPivotWithAggregation = {
    pivotView: {
      "chartType": null,
      "dimensionField": "facility_desc",
      "title": "By Facility",
      "aggregateOn": [
        { "type": "YEAR" }
      ]
    },
    pivotValue: pivotFields[0]
  };
