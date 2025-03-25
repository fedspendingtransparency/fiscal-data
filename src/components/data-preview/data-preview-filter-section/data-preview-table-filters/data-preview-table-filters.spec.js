import React from 'react';
import DataPreviewTableFilters from './data-preview-table-filters';
import { fireEvent, render } from '@testing-library/react';

describe('Table filters dropdown', () => {
  const datasetConfig = { currentDateButton: 'byFullMonth', techSpecs: { earliestDate: '3-17-2020', latestDate: '3-17-2025' } };
  const mockSelectedTable = { userFilter: null, earliestDate: '3-17-2020', latestDate: '3-17-2025', dateField: 'record_date' };

  it('renders the dropdown button', () => {
    const { getByRole } = render(<DataPreviewTableFilters width={1000} />);
    const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    fireEvent.click(dropdownButton);
    //Filters dropdown opens on click
    const applyButton = getByRole('button', { name: 'Apply' });
    expect(applyButton).toBeInTheDocument();
  });
  it('apply button closes dropdown panel and applies any selected filters', () => {
    const { getByRole } = render(<DataPreviewTableFilters width={1000} />);
    const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    fireEvent.click(dropdownButton);
    //Filters dropdown opens on click
    const applyButton = getByRole('button', { name: 'Apply' });
    expect(applyButton).toBeInTheDocument();
    fireEvent.click(applyButton);
    expect(applyButton).not.toBeInTheDocument();
    //Todo: check that filters are applied
    expect(getByRole('button', { name: 'Filters: 0 applied' })).toBeInTheDocument();
  });

  it('cancel button closes dropdown panel without applying filters', () => {
    const { getByRole } = render(<DataPreviewTableFilters width={1000} />);
    const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    fireEvent.click(dropdownButton);
    //Filters dropdown opens on click
    const cancelButton = getByRole('button', { name: 'Cancel' });
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
    expect(cancelButton).not.toBeInTheDocument();
    //no filters are applied
    expect(getByRole('button', { name: 'Filters: 0 applied' })).toBeInTheDocument();
  });

  it('renders the column filters', () => {
    const { getByRole, getByText } = render(<DataPreviewTableFilters selectedTable={mockSelectedTable} config={datasetConfig} width={1000} />);
    const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    fireEvent.click(dropdownButton);
    expect(getByRole('radio', { name: 'Preset' })).toBeInTheDocument();
    expect(getByText('Record Date')).toBeInTheDocument();
  });
});
