import ColumnFilterOptions from './column-filter-options';
import { render } from '@testing-library/react';
import React from 'react';

describe('Column Filter Options', () => {
  const mockSelectedColumn = { prettyName: 'Record Date', dataType: 'DATE', field: 'record_date' };
  const datasetConfig = { currentDateButton: 'byFullMonth', techSpecs: { earliestDate: '3-17-2020', latestDate: '3-17-2025' } };
  const mockSelectedTable = { userFilter: null, earliestDate: '3-17-2020', latestDate: '3-17-2025', dateField: 'record_date' };

  it('renders the date filter with presets for the primary date field', () => {
    const { getByRole, getByText } = render(
      <ColumnFilterOptions selectedColumn={mockSelectedColumn} config={datasetConfig} selectedTable={mockSelectedTable} />
    );
    expect(getByRole('radio', { name: 'Preset' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Custom' })).toBeInTheDocument();
    expect(getByText('Record Date')).toBeInTheDocument();
  });
});
