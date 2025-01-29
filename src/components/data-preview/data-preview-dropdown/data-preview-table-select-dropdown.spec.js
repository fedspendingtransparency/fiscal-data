import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import DataPreviewTableSelectDropdown from './data-preview-table-select-dropdown';
import userEvent from '@testing-library/user-event';

describe('Data Preview Dropdown Dialog', () => {
  const mockSelectedTable = {
    tableName: 'Mock Table Name',
    dataDisplays: [
      { title: 'Complete Table' },
      { dimensionField: 'account_type', title: 'By Account Type' },
      { dimensionField: 'account_number', title: 'By Account Number' },
    ],
    valueFieldOptions: ['value_1', 'value_2'],
    fields: [
      { columnName: 'value_1', prettyName: 'Value 1' },
      { columnName: 'value_2', prettyName: 'Value 2' },
    ],
  };
  const mockApis = [mockSelectedTable, { tableName: 'Another Mock Table Name' }];

  it('renders the dropdown button', () => {
    const mockSetSelectedTable = jest.fn();
    const { getByRole } = render(
      <DataPreviewTableSelectDropdown
        selectedTable={mockSelectedTable}
        setSelectedTable={mockSetSelectedTable}
        apis={[]}
        setSelectedPivot={jest.fn()}
      />
    );
    const dropdownButton = getByRole('button', { name: 'Data Table: Mock Table Name' });
    expect(dropdownButton).toBeInTheDocument();
    userEvent.click(dropdownButton);
  });

  it('updates table selection on apply', () => {
    const mockSetSelectedTable = jest.fn();

    const { getByRole } = render(
      <DataPreviewTableSelectDropdown
        selectedTable={mockSelectedTable}
        setSelectedTable={mockSetSelectedTable}
        apis={mockApis}
        setSelectedPivot={jest.fn()}
      />
    );
    const dropdownButton = getByRole('button', { name: 'Data Table: Mock Table Name' });
    fireEvent.click(dropdownButton);
    const newTableButton = getByRole('button', { name: 'Another Mock Table Name' });
    fireEvent.click(newTableButton);
    const applyButton = getByRole('button', { name: 'Apply' });
    fireEvent.click(applyButton);

    expect(mockSetSelectedTable).toHaveBeenCalledWith({ tableName: 'Another Mock Table Name' });
  });

  it('updates pivot selection on apply', () => {
    const mockSetSelectedTable = jest.fn();
    const mockSetSelectedPivot = jest.fn();

    const { getByRole } = render(
      <DataPreviewTableSelectDropdown
        selectedTable={mockSelectedTable}
        setSelectedTable={mockSetSelectedTable}
        apis={mockApis}
        setSelectedPivot={mockSetSelectedPivot}
      />
    );
    const dropdownButton = getByRole('button', { name: 'Data Table: Mock Table Name' });
    fireEvent.click(dropdownButton);
    const pivotDataButton = getByRole('radio', { name: 'Pivot Data' });
    fireEvent.click(pivotDataButton);
    const pivotViewDropdown = getByRole('button', { name: 'Select Pivot View' });
    fireEvent.click(pivotViewDropdown);
    const newPivotViewDropdown = getByRole('button', { name: 'By Account Number' });
    fireEvent.click(newPivotViewDropdown);
    const pivotValueDropdown = getByRole('button', { name: 'Select Pivot Value' });

    const applyButton = getByRole('button', { name: 'Apply' });
    fireEvent.click(applyButton);

    expect(mockSetSelectedPivot).toHaveBeenCalledWith({
      pivotValue: { columnName: 'value_1', prettyName: 'Value 1' },
      pivotView: { dimensionField: 'account_number', title: 'By Account Number' },
    });
  });

  it('updates dropdown when All Data Tables is selected', () => {
    const mockSetSelectedTable = jest.fn();
    const mockSetSelectedPivot = jest.fn();

    const { getByRole, getAllByText, queryByRole } = render(
      <DataPreviewTableSelectDropdown
        selectedTable={mockSelectedTable}
        setSelectedTable={mockSetSelectedTable}
        apis={mockApis}
        setSelectedPivot={mockSetSelectedPivot}
      />
    );

    const dropdownButton = getByRole('button', { name: 'Data Table: Mock Table Name' });
    fireEvent.click(dropdownButton);

    const allTablesButton = getByRole('button', { name: 'All Data Tables (Download Only)' });
    fireEvent.click(allTablesButton);

    expect(getAllByText('All Data Tables (Download Only)').length).toBe(2);
    expect(getByRole('radio', { name: 'Raw Data' })).toBeInTheDocument();
    expect(queryByRole('radio', { name: 'Pivot Data' })).not.toBeInTheDocument();
  });
});
