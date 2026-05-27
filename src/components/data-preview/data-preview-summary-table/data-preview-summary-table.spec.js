import React from 'react';
import SummaryTable from './data-preview-summary-table';
import { render } from '@testing-library/react';
import { DataTableContext } from '../data-preview-context';

describe('Summary Table', () => {
  const mockSummaryValues = { cusip: 1, series: 2 };
  const mockSummaryTable = ['cusip', 'series'];
  const mockColumnConfig = [
    { property: 'cusip', name: 'CUSIP' },
    { property: 'series', name: 'Series' },
  ];

  it('renders summary table with all headers and values', () => {
    const mockTableProps = { columnConfig: mockColumnConfig };
    const { getByText } = render(
      <DataTableContext.Provider value={{ tableProps: mockTableProps }}>
        <SummaryTable summaryValues={mockSummaryValues} summaryTable={mockSummaryTable} columnConfig={mockColumnConfig} />
      </DataTableContext.Provider>
    );
    expect(getByText('CUSIP')).toBeInTheDocument();
    expect(getByText('Series')).toBeInTheDocument();
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
  });
});
