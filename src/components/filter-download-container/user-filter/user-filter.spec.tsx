import { render, within } from '@testing-library/react';
import React from 'react';
import UserFilter, { determineUserFilterUnmatchedForDateRange } from './user-filter';
import userEvent from '@testing-library/user-event';

describe('UserFilter Component', () => {
  const ComboCurrencySelect = jest.requireActual('../../combo-select/combo-currency-select/combo-currency-select');
  const comboSelectSpy = jest.spyOn(ComboCurrencySelect, 'default');

  it('sends expected properties to combo-select control and displays notice', async () => {
    const { getByTestId } = render(<UserFilter selectedTable={mockTable} onUserFilter={jest.fn()} apiData={mockData} />);

    expect(getByTestId('datatable-banner')).toHaveTextContent(mockTable.userFilter.notice);
    const comboSelectProps = comboSelectSpy.mock.calls[0][0];

    expect(comboSelectProps['label']).toEqual(`${mockTable.userFilter.label}:`);
    const optionsFromBuildTimeData = mockTable.userFilter.optionValues.map(optionValue => ({ label: optionValue, value: optionValue }));
    expect(comboSelectProps['options']).toEqual(
      [
        {
          label: '(None selected)',
          value: null,
        },
      ].concat(optionsFromBuildTimeData.slice(0, 4))
    );
    expect(comboSelectProps['selectedOption']).toEqual({
      label: '(None selected)',
      value: null,
    });
  });

  it('sends expected properties to combo-select control for the apiFilter', async () => {
    const { getByTestId } = render(<UserFilter selectedTable={mockTableApiFilter} onUserFilter={jest.fn()} />);

    const comboSelectProps = comboSelectSpy.mock.calls[0][0];

    expect(comboSelectProps['label']).toEqual(`${mockTable.userFilter.label}:`);
    const optionsFromBuildTimeData = mockTable.userFilter.optionValues.map(optionValue => ({ label: optionValue, value: optionValue }));
    expect(comboSelectProps['options']).toEqual(
      [
        {
          label: '(None selected)',
          value: null,
        },
      ].concat(optionsFromBuildTimeData.slice(0, 4))
    );
    expect(comboSelectProps['selectedOption']).toEqual({
      label: '(None selected)',
      value: null,
    });
  });

  it('sends expected properties to combo-select control for the apiFilter with multiple dropdown categories', () => {
    const { getByText, getByRole } = render(<UserFilter selectedTable={mockTableApiFilterMultiCategory} onUserFilter={jest.fn()} />);
    const filterDropdown = getByRole('button');
    expect(getByText('(None selected)')).toBeInTheDocument();
    userEvent.click(filterDropdown);
    expect(getByText('State')).toBeInTheDocument();
    expect(getByText('Federal')).toBeInTheDocument();
  });

  it(`supplies a utility function that determines if the userFilter selection is unmatched for a given date range`, () => {
    // conditions are met for true
    let result = determineUserFilterUnmatchedForDateRange(mockTable, { label: 'Estonia', value: 'Estonia' }, { data: [] });
    expect(result).toStrictEqual(true);

    // selected table doesn't have defined userFilter, so false
    result = determineUserFilterUnmatchedForDateRange({}, { label: 'Estonia', value: 'Estonia' }, { data: [] });
    expect(result).toBeFalsy();

    // data rows are present after filtering, so false
    result = determineUserFilterUnmatchedForDateRange(mockTable, { label: 'Denmark', value: 'Denmark' }, { data: [mockData.data[5]] });
    expect(result).toBeFalsy();
  });

  it(`supplies a utility function that determines if the apiFilter selection is unmatched for a given date range`, () => {
    // conditions are met for true
    let result = determineUserFilterUnmatchedForDateRange(mockTableApiFilter, { label: 'A', value: 'A' }, { data: [] });
    expect(result).toStrictEqual(true);

    // selected table doesn't have defined userFilter, so false
    result = determineUserFilterUnmatchedForDateRange({}, { label: 'Estonia', value: 'Estonia' }, { data: [] });
    expect(result).toBeFalsy();

    // data rows are present after filtering, so false
    result = determineUserFilterUnmatchedForDateRange(mockTableApiFilter, { label: 'B', value: 'B' }, { data: [mockDataApiFilter.data[1]] });
    expect(result).toBeFalsy();
  });

  it('uses api filter options labels when available', () => {
    const { getByRole } = render(<UserFilter selectedTable={mockTableApiFilterOptionLabels} onUserFilter={jest.fn()} />);
    const filterDropdown = getByRole('button');
    userEvent.click(filterDropdown);
    expect(getByRole('button', { name: '123' })).toBeInTheDocument();
    expect(getByRole('button', { name: '456' })).toBeInTheDocument();
    expect(getByRole('button', { name: '789' })).toBeInTheDocument();
  });

  it('calls reset filter function when the user filter changes ', () => {
    const resetFilterSpy = jest.fn();
    const { getByRole, getByTestId } = render(
      <UserFilter selectedTable={mockTable} onUserFilter={jest.fn()} apiData={mockData} setResetFilters={resetFilterSpy} />
    );
    const dropdown = getByRole('button');
    userEvent.click(dropdown);
    const list = getByTestId('dropdown-list');
    const button = within(list).getAllByRole('button')[0];
    userEvent.click(button);

    expect(resetFilterSpy).toHaveBeenCalledWith(true);
  });

  const mockTable = {
    apiId: '1137',
    userFilter: {
      label: 'Country-Currency',
      field: 'ccd',
      notice: 'this is some info related to the user-filterable data',
      optionValues: ['Albania', 'Belgium', 'Croatia'],
      dataUnmatchedMessage: 'Cannot find a currency match for these dates.',
    },
  };

  const mockTableApiFilter = {
    apiId: '1137',
    apiFilter: {
      label: 'Account Description',
      field: 'acct_desc',
      notice: 'this is some info related to the user-filterable data',
      optionValues: { all: ['A', 'B', 'C'] },
      dataUnmatchedMessage: 'Cannot find account match for these dates.',
      dataSearchLabel: 'Search accounts',
    },
  };

  const mockTableApiFilterMultiCategory = {
    apiId: '1137',
    apiFilter: {
      label: 'Account Description',
      field: 'acct_desc',
      notice: 'this is some info related to the user-filterable data',
      optionValues: { State: ['A', 'B', 'C'], Federal: ['E', 'F', 'G', 'H'] },
      dataUnmatchedMessage: 'Cannot find account match for these dates.',
      dataSearchLabel: 'Search accounts',
      fieldFilter: {
        field: 'report_type',
        value: ['Federal', 'State'],
      },
    },
  };

  const mockTableApiFilterOptionLabels = {
    apiId: '1137',
    apiFilter: {
      label: 'Account Description',
      field: 'acct_nbr',
      labelField: 'acct_desc',
      notice: 'this is some info related to the user-filterable data',
      optionLabels: { A: '123', B: '456', C: '789' },
      optionValues: { all: ['A', 'B', 'C'] },
      dataUnmatchedMessage: 'Cannot find account match for these dates.',
      dataSearchLabel: 'Search accounts',
    },
  };

  const mockData = {
    data: [
      {
        record_date: '2023-01-01',
        rate: '1.1',
        ccd: 'Albania',
      },
      {
        record_date: '2023-01-01',
        rate: '1.2',
        ccd: 'Albania',
      },
      {
        record_date: '2023-01-01',
        rate: '1.3',
        ccd: 'Belgium',
      },
      {
        record_date: '2022-01-01',
        rate: '1.4',
        ccd: 'Croatia',
      },
      {
        record_date: '2022-01-01',
        rate: '1.0',
        ccd: 'Albania',
      },
      {
        record_date: '2022-01-01',
        rate: '1.3',
        ccd: 'Denmark',
      },
      {
        record_date: '2022-01-01',
        rate: '1.3',
        ccd: 'Belgium',
      },
      {
        record_date: '2022-01-01',
        rate: '2.4',
        ccd: 'Croatia',
      },
    ],
  };
  const mockDataApiFilter = {
    data: [
      {
        record_date: '2023-01-01',
        val: '1.1',
        acct_desc: 'A',
      },
      {
        record_date: '2023-01-01',
        val: '1.2',
        ccd: 'A',
      },
      {
        record_date: '2023-01-01',
        val: '1.3',
        acct_desc: 'B',
      },
      {
        record_date: '2022-01-01',
        val: '1.4',
        acct_desc: 'C',
      },
    ],
  };
});
