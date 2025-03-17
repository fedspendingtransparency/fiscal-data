import React from 'react';
import DataPreviewTableFilters from './data-preview-table-filters';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Table filters dropdown', () => {
  const datasetConfig = { currentDateButton: 'byFullMonth', techSpecs: { earliestDate: '3-17-2020', latestDate: '3-17-2025' } };
  const mockSelectedTable = { userFilter: null, earliestDate: '3-17-2020', latestDate: '3-17-2025', dateField: 'record_date' };

  it('renders the dropdown button', () => {
    const { getByRole } = render(<DataPreviewTableFilters />);
    const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    userEvent.click(dropdownButton);
    //Filters dropdown opens on click
    const applyButton = getByRole('button', { name: 'Apply' });
    expect(applyButton).toBeInTheDocument();
  });

  it('renders the column filters', () => {
    const { getByRole, getByText } = render(<DataPreviewTableFilters selectedTable={mockSelectedTable} config={datasetConfig} />);
    const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    userEvent.click(dropdownButton);
    expect(getByRole('radio', { name: 'Preset' })).toBeInTheDocument();
    expect(getByText('Record Date')).toBeInTheDocument();
  });
});
