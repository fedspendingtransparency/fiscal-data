import React from 'react';
import SummaryTable from './summary-table';
import { render } from '@testing-library/react';

describe('Summary Table', () => {
  const mockSummaryValues = { cusip: 1, series: 2 };
  const mockSummaryTable = ['cusip', 'series'];
  const mockColumnConfig = [
    { property: 'cusip', name: 'CUSIP' },
    { property: 'series', name: 'Series' },
  ];

  it('renders summary table with all headers and values', () => {
    const { getByText } = render(<SummaryTable summaryValues={mockSummaryValues} summaryTable={mockSummaryTable} columnConfig={mockColumnConfig} />);
    expect(getByText('CUSIP')).toBeInTheDocument();
    expect(getByText('Series')).toBeInTheDocument();
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
  });
});
