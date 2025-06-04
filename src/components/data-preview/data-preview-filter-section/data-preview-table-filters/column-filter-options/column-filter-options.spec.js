import ColumnFilterOptions from './column-filter-options';
import { render } from '@testing-library/react';
import React from 'react';

describe('Column Filter Options', () => {
  const mockSelectedColumn = { prettyName: 'Record Date', dataType: 'DATE', columnName: 'record_date' };
  const datasetConfig = { currentDateButton: 'byFullMonth', techSpecs: { earliestDate: '3-17-2020', latestDate: '3-17-2025' } };
  const mockSelectedTable = { userFilter: null, earliestDate: '3-17-2020', latestDate: '3-17-2025', dateField: 'record_date' };
  const mockPresets = [
    { label: '1 Year', key: '1yr', years: 1 },
    { label: '5 Years', key: '5yr', years: 5 },
    { label: '10 Years', key: '10yr', years: 10 },
  ];

  it('renders the date filter with presets for the primary date field', () => {
    const { getByRole, getByText } = render(
      <ColumnFilterOptions selectedColumn={mockSelectedColumn} config={datasetConfig} selectedTable={mockSelectedTable} presets={mockPresets} />
    );
    expect(getByRole('radio', { name: 'Preset' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Custom' })).toBeInTheDocument();
    expect(getByText('Record Date')).toBeInTheDocument();
  });
});
