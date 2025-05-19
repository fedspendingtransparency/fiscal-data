import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import SelectAll from './data-preview-select-all';
import userEvent from '@testing-library/user-event';

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
    {
      getIsVisible: () => false,
      getToggleVisibilityHandler: () => jest.fn(),
      id: 3,
      columnDef: {
        header: 'test default column name 3',
      },
    },
  ];

  it('renders column selector', () => {
    const instance = render(
      <SelectAll
        allColumns={[]}
        setAllColumnsSelected={jest.fn()}
        checkboxesSelected={[]}
        setCheckboxesSelected={jest.fn()}
        setPendingColumnSelection={jest.fn()}
      />
    );
    expect(instance).toBeTruthy();
  });

  it('renders select all button', () => {
    const setAllColumnsSelectedSpy = jest.fn();
    const setCheckboxesSelectedSpy = jest.fn();
    const setPendingColumnSelectionSpy = jest.fn();
    const { getByRole } = render(
      <SelectAll
        allColumns={mockDefaultColumns}
        allColumnsSelected={false}
        setAllColumnsSelected={setAllColumnsSelectedSpy}
        checkboxesSelected={[]}
        pendingColumnSelection={[mockDefaultColumns[1]]}
        setCheckboxesSelected={setCheckboxesSelectedSpy}
        setPendingColumnSelection={setPendingColumnSelectionSpy}
      />
    );
    const selectAllButton = getByRole('checkbox', { name: 'All Columns' });
    expect(selectAllButton).toBeInTheDocument();

    userEvent.click(selectAllButton);
    expect(setAllColumnsSelectedSpy).toHaveBeenCalledWith(true);
    expect(setCheckboxesSelectedSpy).toHaveBeenCalledWith(mockDefaultColumns);
    expect(setPendingColumnSelectionSpy).toHaveBeenCalledWith([mockDefaultColumns[2]]);
  });

  it('renders select all button with keyboard accessibility', () => {
    const setAllColumnsSelectedSpy = jest.fn();
    const setCheckboxesSelectedSpy = jest.fn();
    const setPendingColumnSelectionSpy = jest.fn();
    const { getByRole } = render(
      <SelectAll
        allColumns={mockDefaultColumns}
        allColumnsSelected={false}
        setAllColumnsSelected={setAllColumnsSelectedSpy}
        checkboxesSelected={[]}
        pendingColumnSelection={[mockDefaultColumns[1]]}
        setCheckboxesSelected={setCheckboxesSelectedSpy}
        setPendingColumnSelection={setPendingColumnSelectionSpy}
      />
    );
    const selectAllButton = getByRole('checkbox', { name: 'All Columns' });
    expect(selectAllButton).toBeInTheDocument();

    fireEvent.keyDown(selectAllButton, { key: 'Enter' });
    expect(setAllColumnsSelectedSpy).toHaveBeenCalledWith(true);
    expect(setCheckboxesSelectedSpy).toHaveBeenCalledWith(mockDefaultColumns);
    expect(setPendingColumnSelectionSpy).toHaveBeenCalledWith([mockDefaultColumns[2]]);
  });
});
