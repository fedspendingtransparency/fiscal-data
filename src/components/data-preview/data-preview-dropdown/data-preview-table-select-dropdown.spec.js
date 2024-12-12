import React from 'react';
import { render } from '@testing-library/react';
import DataPreviewTableSelectDropdown from './data-preview-table-select-dropdown';
import userEvent from '@testing-library/user-event';

describe('Data Preview Dropdown Dialog', () => {
  const mockSetSelectedTable = jest.fn();
  const mockSelectedTable = { tableName: 'Mock Table Name' };
  it('renders the dropdown button', () => {
    const { getByRole } = render(<DataPreviewTableSelectDropdown selectedTable={mockSelectedTable} setSelectedTable={mockSetSelectedTable} apis={[]} />);
    const dropdownButton = getByRole('button', { name: 'Data Table: Mock Table Name' });
    expect(dropdownButton).toBeInTheDocument();
    userEvent.click(dropdownButton);
  });
});
