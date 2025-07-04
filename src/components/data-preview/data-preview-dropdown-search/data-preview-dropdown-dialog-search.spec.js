import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataPreviewDropdownDialogSearch from './data-preview-dropdown-dialog-search';
import { dataTableSearchContainer } from './data-preview-dropdown-dialog-search.module.scss';

describe('Data Preview Dropdown Dialog search', () => {
  const mockSetSelectedTable = jest.fn();
  const mockOptions = [
    { label: 'Table 1', onClick: jest.fn(), type: 'dataTable', tableName: 'Table 1' },
    { label: 'Table 2', onClick: jest.fn(), type: 'dataTable', tableName: 'Table 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dataTableSearchContainer', () => {
    const { container } = render(
      <DataPreviewDropdownDialogSearch
        selectedOption={{ label: 'Default Table', tableName: 'Default Table' }}
        setSelectedOption={mockSetSelectedTable}
        options={mockOptions}
        searchBarLabel="Search..."
        active={false}
      />
    );

    expect(container.querySelector(`.${dataTableSearchContainer}`)).toBeInTheDocument();
  });

  it('calls setSelectedTable when an option is selected (handleSearchChange)', async () => {
    render(
      <DataPreviewDropdownDialogSearch
        selectedOption={{ label: 'Default Table', tableName: 'Default Table' }}
        setSelectedOption={mockSetSelectedTable}
        options={mockOptions}
        searchBarLabel="Search..."
        active={true}
      />
    );

    const option = screen.getByText('Table 1');
    await userEvent.click(option);

    expect(mockSetSelectedTable).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedTable).toHaveBeenCalledWith(expect.objectContaining({ label: 'Table 1' }));
  });
});
