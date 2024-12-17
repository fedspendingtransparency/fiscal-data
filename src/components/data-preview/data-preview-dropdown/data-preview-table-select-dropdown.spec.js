import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import DataPreviewTableSelectDropdown from './data-preview-table-select-dropdown';
import userEvent from '@testing-library/user-event';

describe('Data Preview Dropdown Dialog', () => {
  const mockSelectedTable = { tableName: 'Mock Table Name' };
  const mockApis = [{ tableName: 'Mock Table Name' }, { tableName: 'Another Mock Table Name' }];
  it('renders the dropdown button', () => {
    const mockSetSelectedTable = jest.fn();
    const { getByRole } = render(
      <DataPreviewTableSelectDropdown selectedTable={mockSelectedTable} setSelectedTable={mockSetSelectedTable} apis={[]} />
    );
    const dropdownButton = getByRole('button', { name: 'Data Table: Mock Table Name' });
    expect(dropdownButton).toBeInTheDocument();
    userEvent.click(dropdownButton);
  });

  it('updates table selection on apply', () => {
    const mockSetSelectedTable = jest.fn();

    const { getByRole, findByRole } = render(
      <DataPreviewTableSelectDropdown selectedTable={mockSelectedTable} setSelectedTable={mockSetSelectedTable} apis={mockApis} />
    );
    const dropdownButton = getByRole('button', { name: 'Data Table: Mock Table Name' });
    fireEvent.click(dropdownButton);
    const newTableButton = getByRole('button', { name: 'Another Mock Table Name' });
    fireEvent.click(newTableButton);
    const applyButton = getByRole('button', { name: 'Apply' });
    fireEvent.click(applyButton);

    expect(mockSetSelectedTable).toHaveBeenCalledWith({ tableName: 'Another Mock Table Name' });
  });
});
