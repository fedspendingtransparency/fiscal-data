import { render } from '@testing-library/react';
import React from 'react';
import UserFilterDropdown from './user-filter-dropdown';
import userEvent from '@testing-library/user-event';

describe('UserFilter Component', () => {
  it('sends expected properties to dropdown', async () => {
    const setFilterMapSpy = jest.fn();
    const { getByRole } = render(
      <UserFilterDropdown
        selectedTable={mockTable}
        apiData={mockData}
        filterMap={mockFilterMap}
        setFilterMap={setFilterMapSpy}
        columnConfig={mockColumnConfig}
      />
    );
    const dropdownButton = getByRole('button', { name: '(None selected)' });
    userEvent.click(dropdownButton);
    const optionsFromBuildTimeData = mockTable.userFilter.optionValues.map(optionValue => ({ label: optionValue, value: optionValue }));

    expect(getByRole('button', { name: optionsFromBuildTimeData[0].label })).toBeInTheDocument();
    expect(getByRole('button', { name: optionsFromBuildTimeData[1].label })).toBeInTheDocument();
    expect(getByRole('button', { name: optionsFromBuildTimeData[2].label })).toBeInTheDocument();

    userEvent.click(getByRole('button', { name: optionsFromBuildTimeData[0].label }));
    expect(setFilterMapSpy).toHaveBeenCalledWith({ country_currency_desc: { filterValue: '', pendingValue: optionsFromBuildTimeData[0].label } });
  });

  it("resets filterMap on '(None selected)' click", async () => {
    const setFilterMapSpy = jest.fn();
    const { getByRole } = render(
      <UserFilterDropdown
        selectedTable={mockTable}
        apiData={mockData}
        filterMap={mockFilterMap}
        setFilterMap={setFilterMapSpy}
        columnConfig={mockColumnConfig}
      />
    );
    const dropdownButton = getByRole('button', { name: '(None selected)' });
    userEvent.click(dropdownButton);
    const optionsFromBuildTimeData = mockTable.userFilter.optionValues.map(optionValue => ({ label: optionValue, value: optionValue }));

    userEvent.click(getByRole('button', { name: optionsFromBuildTimeData[0].label }));
    expect(setFilterMapSpy).toHaveBeenCalledWith({ country_currency_desc: { filterValue: '', pendingValue: optionsFromBuildTimeData[0].label } });

    userEvent.click(dropdownButton);
    userEvent.click(getByRole('button', { name: '(None selected)' }));
    expect(setFilterMapSpy).toHaveBeenCalledWith({ country_currency_desc: { filterValue: '', pendingValue: '' } });
  });

  // it('sends expected properties to combo-select control for the apiFilter', async () => {
  //   const { getByTestId } = render(<UserFilter selectedTable={mockTableApiFilter} onUserFilter={jest.fn()} />);
  //
  //   const comboSelectProps = comboSelectSpy.mock.calls[0][0];
  //
  //   expect(comboSelectProps['label']).toEqual(`${mockTable.userFilter.label}:`);
  //   const optionsFromBuildTimeData = mockTable.userFilter.optionValues.map(optionValue => ({ label: optionValue, value: optionValue }));
  //   expect(comboSelectProps['options']).toEqual(
  //     [
  //       {
  //         label: '(None selected)',
  //         value: null,
  //       },
  //     ].concat(optionsFromBuildTimeData.slice(0, 4))
  //   );
  //   expect(comboSelectProps['selectedOption']).toEqual({
  //     label: '(None selected)',
  //     value: null,
  //   });
  // });

  // it('sends expected properties to combo-select control for the apiFilter with multiple dropdown categories', () => {
  //   const { getByText, getByRole } = render(<UserFilterDropdown selectedTable={mockTableApiFilterMultiCategory} onUserFilter={jest.fn()} />);
  //   const filterDropdown = getByRole('button');
  //   expect(getByText('(None selected)')).toBeInTheDocument();
  //   userEvent.click(filterDropdown);
  //   expect(getByText('State')).toBeInTheDocument();
  //   expect(getByText('Federal')).toBeInTheDocument();
  // });

  // it('uses api filter options labels when available', () => {
  //   const { getByRole } = render(<UserFilterDropdown selectedTable={mockTableApiFilterOptionLabels} onUserFilter={jest.fn()} />);
  //   const filterDropdown = getByRole('button');
  //   userEvent.click(filterDropdown);
  //   expect(getByRole('button', { name: '123' })).toBeInTheDocument();
  //   expect(getByRole('button', { name: '456' })).toBeInTheDocument();
  //   expect(getByRole('button', { name: '789' })).toBeInTheDocument();
  // });
  const mockFilterMap = { country_currency_desc: { filterValue: '', pendingValue: '' } };
  const mockColumnConfig = {
    columnName: 'country_currency_desc',
    dataType: 'STRING',
    definition: 'Country and currency associated with a given exchange rate.',
    filterValue: '',
    prettyName: 'Country - Currency Description',
    tableName: 'Treasury Reporting Rates of Exchange',
  };
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
