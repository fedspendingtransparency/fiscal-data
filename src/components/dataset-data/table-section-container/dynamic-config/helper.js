const excludedFields = ['DATE', 'QUARTER', 'YEAR', 'MONTH', 'DAY'];

const applyLocation = (arr, location) => {
  if(arr && arr.length){
    arr.forEach(el => el.from = location);
  }
};

const createPivotViewJSON = (pivotViews) => {
  return (
    pivotViews.map(pivot => {
      const pivotView = {
        'title': pivot.title || pivot.prettyName,
        'dimensionField': pivot.columnName
      };
      if (pivot.lastRowSnapshot) {
        pivotView.lastRowSnapshot = true;
      }
      if (pivot.filters) {
        pivotView.filters = pivot.filters;
      }
      return pivotView;
    })
  )
};

export const placeTablePivots = (selectedTable) => {
  const returnObj = {
    'PIVOT_BANK': [],
    'VIEW': [],
    'VALUE': []
  };

  if (selectedTable && selectedTable.fields) {
    let pivotViewsArr = [];
    const tableFields = selectedTable.fields;
    const dataDisplays = selectedTable.dataDisplays;
    if (dataDisplays && dataDisplays.length > 1) {
      pivotViewsArr = dataDisplays.filter(pivot => pivot.dimensionField).map(pivot => {
        const field =
          Object.assign({}, tableFields.find(p => p.columnName === pivot.dimensionField));
        field.title = pivot.title;
        field.filters = pivot.filters;
        field.lastRowSnapshot = !!pivot.lastRowSnapshot;
        return field;
      });
    }

    const valueFieldOptions = selectedTable.valueFieldOptions;
    const pivotValuesArr = (valueFieldOptions && valueFieldOptions.length) ?
      valueFieldOptions.map(pivot => tableFields.find(p => p.columnName === pivot))
        .filter(el => el) : [];

    let pivotBankArr = selectedTable.fields.filter(field => !excludedFields
      .some(excluded => excluded === field.dataType));
    const srcLineNbrIdx = pivotBankArr.findIndex(pivot => pivot.columnName === 'src_line_nbr');
    if (srcLineNbrIdx !== -1) {
      pivotBankArr.splice(srcLineNbrIdx, 1);
    }

    pivotBankArr = pivotBankArr.filter(pivot =>
      !pivotValuesArr.some(pVal => pVal.columnName === pivot.columnName));

    applyLocation(pivotBankArr, 'PIVOT_BANK');
    applyLocation(pivotViewsArr, 'VIEW');
    applyLocation(pivotValuesArr, 'VALUE');

    returnObj['PIVOT_BANK'] = pivotBankArr;
    returnObj['VIEW'] = pivotViewsArr;
    returnObj['VALUE'] = pivotValuesArr;
  }

  return returnObj;
};

export const createJSONOutput = (selectedTable, pivotViews, pivotValues) => {
  const apiId = selectedTable.apiId;
  const endpointJSON = {
    [apiId] : {
      'endpoint': selectedTable.endpoint,
      'dateField': selectedTable.dateField,
      'downloadName': selectedTable.downloadName,
      'dataDisplays': createPivotViewJSON(pivotViews),
      'valueFieldOptions': pivotValues.map(pivot => pivot.columnName)
    }
  };
  return JSON.stringify(endpointJSON, null, 1);
};

const testHelperDataDisplays = [
  // Existing setup in prod as of 3/24/21
  [
    {
      dimensionField: null,
      columnName: 'Complete Table'
    },
    {
      dimensionField: 'state_nm',
      title: 'By State'
    },
    {
      dimensionField: 'dept_nm',
      title: 'By Department',
      filters: [{
        'key': 'state_nm',
        'operator': 'eq',
        'value': 'A001'
      }]
    }
  ],
  // No dataDisplays
  [],
  // dataDisplays with null dimension fields (will act the same as no datadisplays)
  [
    {
      dimensionField: null,
      columnName: 'By State'
    },
    {
      dimensionField: null,
      columnName: 'Table Number'
    },
      {
      dimensionField: null,
      columnName: 'Parent Id'
    },
  ]
];

const testHelperValueFieldOptions = [
  // Existing setup in prod as of 3/24/21
  [
    "interest_rate_pct",
    "outstanding_advance_bal",
    "advance_auth_month_amt",
    "gross_advance_draws_month_amt"
  ],
  // No valueFieldOptions
  [],
  // Non-matching table fields
  ['not_a_field', 'also not a field', 'Complete Table']
];

const testHelperSelectedTable = {
  'apiId': '154',
  'endpoint': 'v2/accounting/od/title_xii',
  'dateField': 'record_date',
  'downloadName': 'AdvStateUnempFundsTitleXII',
  'dataDisplays': testHelperDataDisplays[0],
  'fields': [
    {
      "columnName": "record_date",
      "dataType": "DATE",
      "prettyName": "Record Date",
    },
    {
      "columnName": "state_nm",
      "dataType": "STRING",
      "prettyName": "State Name",
    },
    {
      "columnName": "interest_rate_pct",
      "dataType": "PERCENTAGE",
      "prettyName": "Interest Rate Percent",
    },
    {
      "columnName": "outstanding_advance_bal",
      "dataType": "CURRENCY",
      "prettyName": "Outstanding Advance Balance",
    },
    {
      "columnName": "advance_auth_month_amt",
      "dataType": "CURRENCY",
      "prettyName": "Advance Authorization Current Month",
    },
    {
      "columnName": "gross_advance_draws_month_amt",
      "dataType": "CURRENCY",
      "prettyName": "Gross Advance Draws Current Month",
    },
    {
      "columnName": "interest_accrued_fytd_amt",
      "dataType": "CURRENCY",
      "prettyName": "Interest Accrued Fiscal Year to Date",
    },
    {
      "columnName": "interest_paid_amt",
      "dataType": "CURRENCY",
      "prettyName": "Interest Paid Amount",
    },
    {
      "columnName": "src_line_nbr",
      "dataType": "NUMBER",
      "prettyName": "Source Line Number",
    },
    {
      "columnName": "record_fiscal_year",
      "dataType": "YEAR",
      "prettyName": "Fiscal Year",
    },
    {
      "columnName": "record_fiscal_quarter",
      "dataType": "QUARTER",
      "prettyName": "Fiscal Quarter Number",
    },
    {
      "columnName": "record_calendar_year",
      "dataType": "YEAR",
      "prettyName": "Calendar Year",
    },
    {
      "columnName": "record_calendar_quarter",
      "dataType": "QUARTER",
      "prettyName": "Calendar Quarter Number",
    },
    {
      "columnName": "record_calendar_month",
      "dataType": "MONTH",
      "prettyName": "Calendar Month Number",
    },
    {
      "columnName": "record_calendar_day",
      "dataType": "DAY",
      "prettyName": "Calendar Day Number",
    }
    ],
  'valueFieldOptions': testHelperValueFieldOptions[0]
};

export const unitTestHelpers = {
  selectedTable: testHelperSelectedTable,
  dataDisplays: testHelperDataDisplays,
  valueFieldOptions: testHelperValueFieldOptions
};
