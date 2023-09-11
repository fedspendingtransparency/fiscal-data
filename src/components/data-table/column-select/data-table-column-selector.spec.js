import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import DataTableColumnSelector from './data-table-column-selector';

describe('Column Selector', () => {
  const mockAdditionalColumns = [
    {
      getIsVisible: () => true,
      getToggleVisibilityHandler: () => jest.fn(),
      id: 0,
      columnDef: {
        header: 'test additional column name',
      },
    },
  ];
  const mockDefaultColumns = [
    {
      getIsVisible: () => true,
      getToggleVisibilityHandler: () => jest.fn(),
      id: 1,
      columnDef: {
        header: 'test default column name',
      },
    },
    {
      getIsVisible: () => true,
      getToggleVisibilityHandler: () => jest.fn(),
      id: 2,
      columnDef: {
        header: 'test default column name 2',
      },
    },
  ];

  const mockTable = {
    getVisibleFlatColumns: () => ['test'],
    getAllLeafColumns: () => mockDefaultColumns,
    getIsAllColumnsVisible: () => true,
  };

  it('renders column selector', () => {
    const instance = render(
      <DataTableColumnSelector
        table={mockTable}
        resetToDefault={jest.fn()}
        setSelectColumnPanel={jest.fn()}
        defaultSelectedColumns={null}
        defaultColumns={mockDefaultColumns}
        additionalColumns={mockAdditionalColumns}
      />
    );
    expect(instance).toBeTruthy();
  });

  it('renders close button', () => {
    const mockSelectColumnPanel = jest.fn();
    const { getByRole } = render(
      <DataTableColumnSelector
        table={mockTable}
        resetToDefault={jest.fn()}
        setSelectColumnPanel={mockSelectColumnPanel}
        defaultSelectedColumns={null}
        defaultColumns={mockDefaultColumns}
        additionalColumns={mockAdditionalColumns}
      />
    );
    const closeButton = getByRole('button', { name: 'Close select control panel' });
    expect(closeButton).toBeInTheDocument();
    closeButton.click();
    expect(mockSelectColumnPanel).toHaveBeenCalledWith(false);

    fireEvent.keyDown(closeButton);
    expect(mockSelectColumnPanel).toHaveBeenCalledWith(false);
  });

  it('renders all default columns in the selection list', () => {
    const { getByRole } = render(
      <DataTableColumnSelector
        table={mockTable}
        resetToDefault={jest.fn()}
        setSelectColumnPanel={jest.fn()}
        defaultSelectedColumns={true}
        defaultColumns={mockDefaultColumns}
        additionalColumns={mockAdditionalColumns}
      />
    );

    expect(getByRole('checkbox', { name: 'test default column name' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'test default column name 2' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'test additional column name' })).toBeInTheDocument();
  });
});
