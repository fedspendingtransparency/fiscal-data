import {unitTestHelpers, createJSONOutput, placeTablePivots} from './helper';

describe('Dynamic Config Helper', () => {


  it('places all applicable fields in pivot bank if no pivot views/values are set on table', () => {
    // Taking all fields from selectedTable and removing any
    // that have a dataType that is part of excludedFields
    const numStrippedFields = 7;
    const selectedTable = JSON.parse(JSON.stringify(unitTestHelpers.selectedTable));
    selectedTable.dataDisplays = unitTestHelpers.dataDisplays[1];
    selectedTable.valueFieldOptions = unitTestHelpers.valueFieldOptions[1];

    let response = placeTablePivots(selectedTable);
    expect(response['PIVOT_BANK'].length).toEqual(numStrippedFields);
    expect(response['VIEW'].length).toEqual(0);
    expect(response['VALUE'].length).toEqual(0);

    selectedTable.dataDisplays = unitTestHelpers.dataDisplays[2];
    selectedTable.valueFieldOptions = unitTestHelpers.valueFieldOptions[2];
    response = placeTablePivots(selectedTable);
    expect(response['PIVOT_BANK'].length).toEqual(numStrippedFields);
    expect(response['VIEW'].length).toEqual(0);
    expect(response['VALUE'].length).toEqual(0);
  });

  it('places all applicable fields in their respective sections based on table properties',
    () => {
    const numPivotBank = 3;
    const viewArr = [{
      "columnName": "state_nm",
      "dataType": "STRING",
      "prettyName": "State Name",
      "title": "By State",
      "from": 'VIEW',
      "lastRowSnapshot": false,
      "filters": undefined
    }];
    const numValues = 4;
    const response = placeTablePivots(unitTestHelpers.selectedTable);
    expect(response['PIVOT_BANK'].length).toEqual(numPivotBank);
    expect(response['VIEW'][0]).toEqual(viewArr[0]);
    expect(response['VALUE'].length).toEqual(numValues);
  });

  it('generates an expected JSON response to use in the endpointConfig', () => {
    const selectedTable = unitTestHelpers.selectedTable;
    const expectedResponse = JSON.stringify({
      '154': {
        endpoint: selectedTable.endpoint,
        dateField: selectedTable.dateField,
        downloadName: selectedTable.downloadName,
        dataDisplays: [{title: 'State Name', dimensionField: 'state_nm'}],
        valueFieldOptions: [
          "interest_rate_pct",
          "outstanding_advance_bal",
          "advance_auth_month_amt",
          "gross_advance_draws_month_amt"]
      }
    },null, 1);
    const dataDisplaysArr = [{
      "columnName": "state_nm",
      "dataType": "STRING",
      "prettyName": "State Name"
    }];
    const valueFieldOptionsArr = [
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
      }
    ];
    expect(createJSONOutput(selectedTable, dataDisplaysArr, valueFieldOptionsArr))
      .toEqual(expectedResponse);
  });

  it(`generates an expected JSON response to use
  in the endpointConfig when lastRowSnapshot has been set to true`, () => {

    const selectedTable = unitTestHelpers.selectedTable;
    const expectedResponse = JSON.stringify({
      '154': {
        endpoint: selectedTable.endpoint,
        dateField: selectedTable.dateField,
        downloadName: selectedTable.downloadName,
        dataDisplays: [{title: 'State Name', dimensionField: 'state_nm', lastRowSnapshot: true}],
        valueFieldOptions: [
          "interest_rate_pct",
          "outstanding_advance_bal",
          "advance_auth_month_amt",
          "gross_advance_draws_month_amt"]
      }
    },null, 1);
    const dataDisplaysArr = [{
      "columnName": "state_nm",
      "dataType": "STRING",
      "prettyName": "State Name",
      "lastRowSnapshot": true
    }];
    const valueFieldOptionsArr = [
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
      }
    ];
    expect(createJSONOutput(selectedTable, dataDisplaysArr, valueFieldOptionsArr))
      .toEqual(expectedResponse);
  });
});
