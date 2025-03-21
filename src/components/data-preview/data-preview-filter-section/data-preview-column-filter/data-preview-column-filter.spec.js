import React from 'react';
import DataPreviewColumnFilter from './data-preview-column-filter';
import { fireEvent, render } from '@testing-library/react';
import { DataTableContext } from '../../data-preview-context';

describe('Column Filter', () => {
  const mockColumns = ['col1', 'col2', 'col3'];
  const mockColumnConfigs = [
    { id: 'col1', getIsVisible: jest.fn(), getToggleVisibilityHandler: jest.fn(), columnDef: { header: 'col1' } },
    { id: 'col2', getIsVisible: jest.fn(), getToggleVisibilityHandler: jest.fn(), columnDef: { header: 'col2' } },
    { id: 'col3', getIsVisible: jest.fn(), getToggleVisibilityHandler: jest.fn(), columnDef: { header: 'col3' } },
  ];

  const mockContextValues = {
    tableState: {
      getAllLeafColumns: jest.fn().mockImplementation(() => mockColumnConfigs),
      getVisibleFlatColumns: jest.fn().mockImplementation(() => mockColumnConfigs),
      getIsAllColumnsVisible: jest.fn(),
      getIsSomeColumnsVisible: jest.fn(),
    },
    allColumns: mockColumns,
    defaultColumns: mockColumnConfigs,
    defaultSelectedColumns: [],
  };

  it('renders the column filter dropdown', () => {
    const { getByRole } = render(
      <DataTableContext.Provider
        value={{
          ...mockContextValues,
        }}
      >
        <DataPreviewColumnFilter allTablesSelected={false} isDisabled={false} />
      </DataTableContext.Provider>
    );
    const dropdownButton = getByRole('button', { name: 'Columns: 3/3' });
    fireEvent.click(dropdownButton);
    expect(getByRole('checkbox', { name: 'Select All' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'col1' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'col2' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'col3' })).toBeInTheDocument();
  });

  //Todo update test case for full apply button interaction in the next column filter ticket
  it('closes dropdown on apply button click', () => {
    const { getByRole, queryByRole } = render(
      <DataTableContext.Provider
        value={{
          ...mockContextValues,
        }}
      >
        <DataPreviewColumnFilter allTablesSelected={false} isDisabled={false} />
      </DataTableContext.Provider>
    );
    const dropdownButton = getByRole('button', { name: 'Columns: 3/3' });
    fireEvent.click(dropdownButton);
    const applyButton = getByRole('button', { name: 'Apply' });
    fireEvent.click(applyButton);
    expect(queryByRole('checkbox', { name: 'Select All' })).not.toBeInTheDocument();
  });

  //Todo update test case for full apply button interaction in the next column filter ticket
  it('closes dropdown on cancel button click', () => {
    const { getByRole, queryByRole } = render(
      <DataTableContext.Provider
        value={{
          ...mockContextValues,
        }}
      >
        <DataPreviewColumnFilter allTablesSelected={false} isDisabled={false} />
      </DataTableContext.Provider>
    );
    const dropdownButton = getByRole('button', { name: 'Columns: 3/3' });
    fireEvent.click(dropdownButton);
    const cancelButton = getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);
    expect(queryByRole('checkbox', { name: 'Select All' })).not.toBeInTheDocument();
  });
});
