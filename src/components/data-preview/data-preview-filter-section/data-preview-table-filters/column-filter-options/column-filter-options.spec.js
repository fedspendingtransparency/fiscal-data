import ColumnFilterOptions from './column-filter-options';
import { render } from '@testing-library/react';
import React from 'react';

describe('Column Filter Options', () => {
  it('renders the date filter', () => {
    const mockSelectedColumn = { name: 'Record Date', type: 'Date' };

    const { getAllByRole, getByText } = render(<ColumnFilterOptions selectedColumn={mockSelectedColumn} />);
    expect(getAllByRole('radio')).toBeInTheDocument();
    expect(getByText('Record Date')).toBeInTheDocument();
  });
});
