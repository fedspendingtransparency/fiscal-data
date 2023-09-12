import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import SelectAll from './data-table-select-all';

describe('Column Selector', () => {
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
    getVisibleFlatColumns: () => mockDefaultColumns,
    getAllLeafColumns: () => mockDefaultColumns,
    getIsAllColumnsVisible: () => true,
    toggleAllColumnsVisible: jest.fn(),
    getIsSomeColumnsVisible: () => true,
  };

  const mockTable_allVisibleFalse = {
    getVisibleFlatColumns: () => [{ id: 0 }, { id: 1 }],
    getAllLeafColumns: () => mockDefaultColumns,
    getIsAllColumnsVisible: () => false,
    getIsSomeColumnsVisible: () => true,
    toggleAllColumnsVisible: jest.fn(),
    setColumnVisibility: jest.fn(),
  };

  it('renders column selector', () => {
    const instance = render(<SelectAll table={mockTable} resetToDefault={jest.fn()} defaultColumns={mockDefaultColumns} />);
    expect(instance).toBeTruthy();
  });

  it('renders select all button', () => {
    const { getByRole } = render(<SelectAll table={mockTable} resetToDefault={jest.fn()} defaultColumns={mockDefaultColumns} />);
    const selectAllButton = getByRole('checkbox', { name: 'Select All' });
    expect(selectAllButton).toBeInTheDocument();

    selectAllButton.click();
    expect(mockTable.toggleAllColumnsVisible).toHaveBeenCalled();

    fireEvent.keyDown(selectAllButton, { key: 'Enter' });
    expect(mockTable.toggleAllColumnsVisible).toHaveBeenCalled();
  });

  it('select all button', () => {
    const { getByRole } = render(<SelectAll table={mockTable_allVisibleFalse} resetToDefault={jest.fn()} defaultColumns={mockDefaultColumns} />);
    const selectAllButton = getByRole('checkbox', { name: 'Select All' });
    expect(selectAllButton).toBeInTheDocument();

    selectAllButton.click();
    expect(mockTable_allVisibleFalse.setColumnVisibility).toHaveBeenCalledWith(true);
  });

  it('renders reset button', () => {
    const mockReset = jest.fn();
    const { getByRole } = render(<SelectAll table={mockTable} resetToDefault={mockReset} defaultColumns={mockDefaultColumns} />);
    const resetButton = getByRole('button', { name: 'Reset' });
    expect(resetButton).toBeInTheDocument();

    resetButton.click();
    expect(mockReset).toHaveBeenCalled();

    fireEvent.keyDown(resetButton, { key: 'Enter' });
    expect(mockReset).toHaveBeenCalled();
  });
});
