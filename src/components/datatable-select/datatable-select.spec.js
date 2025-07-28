import React from 'react';
import DataTableSelect, { allTablesOption } from './datatable-select';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('DatatableSelect', () => {
  const earliestDate = 'test early date';
  const latestDate = 'test late date';

  const apisArr = [
    {
      tableName: 'Table 1',
    },
    {
      tableName: 'Table 2',
    },
    {
      tableName: 'Table 3',
    },
  ];

  const allTables = [
    {
      ...allTablesOption,
      earliestDate,
      latestDate,
    },
  ].concat(apisArr);

  const apisArrOne = [{ tableName: 'Only One Table' }];
  const mockSetSelectedTable = jest.fn();

  it('passes the apisArr to SelectControl', () => {
    const { getByRole, getByLabelText } = render(
      <DataTableSelect
        apis={apisArr}
        selectedTable={apisArr[0]}
        setSelectedTable={mockSetSelectedTable}
        earliestDate={earliestDate}
        latestDate={latestDate}
      />
    );
    const dropdown = getByRole('button');
    userEvent.click(dropdown);
    allTables.forEach(table => {
      expect(getByLabelText(table.tableName)).toBeInTheDocument();
    });
  });

  it('passes the selectedOption to SelectControl', () => {
    const { getByRole } = render(
      <DataTableSelect
        apis={apisArr}
        selectedTable={apisArr[0]}
        setSelectedTable={mockSetSelectedTable}
        earliestDate={earliestDate}
        latestDate={latestDate}
      />
    );
    const dropdown = getByRole('button');

    expect(within(dropdown).getByText(apisArr[0].tableName)).toBeInTheDocument();
  });

  it('does not appear on the page if there is only one table in the apis array', () => {
    const { queryByRole } = render(<DataTableSelect apis={apisArrOne} selectedTable={apisArrOne[0]} setSelectedTable={mockSetSelectedTable} />);

    expect(queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a placeholder while no table is selected (during loading)', () => {
    const { getByTestId } = render(
      <DataTableSelect
        apis={apisArr}
        selectedTable={null}
        setSelectedTable={mockSetSelectedTable}
        earliestDate={earliestDate}
        latestDate={latestDate}
      />
    );
    expect(getByTestId('tableSelectPlaceholder')).toBeInTheDocument();
  });

  it('when a table is selected the placeholder does not render', () => {
    const { queryByTestId } = render(
      <DataTableSelect
        apis={apisArr}
        selectedTable={apisArr[0]}
        setSelectedTable={mockSetSelectedTable}
        earliestDate={earliestDate}
        latestDate={latestDate}
      />
    );
    expect(queryByTestId('tableSelectPlaceholder')).not.toBeInTheDocument();
  });

  it('does not render the All Tables options with disableAllTables is true', () => {
    const { getByRole, queryByRole } = render(
      <DataTableSelect
        apis={apisArr}
        selectedTable={apisArr[0]}
        setSelectedTable={mockSetSelectedTable}
        earliestDate={earliestDate}
        latestDate={latestDate}
        disableAllTables={true}
      />
    );

    const dropdown = getByRole('button', { name: 'Table 1' });
    dropdown.click();

    expect(queryByRole('button', { name: 'All Data Tables' })).not.toBeInTheDocument();
  });
});
