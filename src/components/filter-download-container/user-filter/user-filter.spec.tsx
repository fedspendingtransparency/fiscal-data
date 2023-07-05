import {render} from "@testing-library/react";
import React from "react";
import UserFilter, {determineUserFilterUnmatchedForDateRange} from "./user-filter";

describe('UserFilter Component', () => {

  const ComboCurrencySelect = jest.requireActual('../../combo-select/combo-currency-select/combo-currency-select');
  const comboSelectSpy = jest.spyOn(ComboCurrencySelect, "default");

  it('sends expected properties to combo-select control and displays notice', async () => {
    const { getByTestId } = render(
      <UserFilter
        selectedTable={mockTable}
        onUserFilter={jest.fn()}
        apiData={mockData}
      />
    );

    expect(getByTestId('userFilterNotice')).toHaveTextContent(mockTable.userFilter.notice);
    const comboSelectProps = comboSelectSpy.mock.calls[0][0];

    expect(comboSelectProps['label']).toEqual(`${mockTable.userFilter.label}:`);
    const optionsFromBuildTimeData = mockTable.userFilter.optionValues
      .map(optionValue => ({label: optionValue, value: optionValue}));
    expect(comboSelectProps['options']).toEqual([
      {
        label: "(None selected)",
        value: null
      }
    ].concat(optionsFromBuildTimeData.slice(0, 4)));
    expect(comboSelectProps['selectedOption']).toEqual({
      label: "(None selected)",
      value: null
    });
  });

  it(`supplies a utility function that determines if the userFilter selection is
  unmatched for a given date range`, () => {

    // conditions are met for true
    let result = determineUserFilterUnmatchedForDateRange(mockTable,
      {label: 'Estonia', value: 'Estonia'},
      {data: []});
    expect(result).toStrictEqual(true);

    // selected table doesn't have defined userFilter, so false
    result = determineUserFilterUnmatchedForDateRange({},
      {label: 'Estonia', value: 'Estonia'},
      {data: []});
    expect(result).toBeFalsy();

    // data rows are present after filtering, so false
    result = determineUserFilterUnmatchedForDateRange(mockTable,
      {label: 'Denmark', value: 'Denmark'},
      {data: [mockData.data[5]]});
    expect(result).toBeFalsy();

  });

  const mockTable = {
    apiId: '1137',
    userFilter: {
      label: 'Country-Currency',
      field: 'ccd',
      notice: 'this is some info related to the user-filterable data',
      optionValues: ['Albania', 'Belgium', 'Croatia'],
      dataUnmatchedMessage: 'Cannot find a currency match for these dates.'
    }
  };

  const mockData = {
    data: [
      {
        record_date: '2023-01-01',
        rate: '1.1',
        ccd: 'Albania'
      },
      {
        record_date: '2023-01-01',
        rate: '1.2',
        ccd: 'Albania'
      },
      {
        record_date: '2023-01-01',
        rate: '1.3',
        ccd: 'Belgium'
      },
      {
        record_date: '2022-01-01',
        rate: '1.4',
        ccd: 'Croatia'
      },
      {
        record_date: '2022-01-01',
        rate: '1.0',
        ccd: 'Albania'
      },
      {
        record_date: '2022-01-01',
        rate: '1.3',
        ccd: 'Denmark'
      },
      {
        record_date: '2022-01-01',
        rate: '1.3',
        ccd: 'Belgium'
      },
      {
        record_date: '2022-01-01',
        rate: '2.4',
        ccd: 'Croatia'
      },
    ]
  };

});
