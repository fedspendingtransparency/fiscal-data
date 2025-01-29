import React from 'react';
import ChartTableDisplay from './data-preview-chart-table-display';
import { render } from '@testing-library/react';

describe('Chart Table Display', () => {
  it('displays table', () => {
    const mockTable = <table></table>;
    const { getByRole } = render(<ChartTableDisplay table={mockTable} allTablesSelected={false} />);
    expect(getByRole('table')).toBeInTheDocument();
  });

  it(`display "All Data Tables" banner when all tables is selected`, () => {
    const mockTable = <table></table>;
    const { getByText } = render(<ChartTableDisplay table={mockTable} allTablesSelected={true} />);
    expect(getByText('The current "All Data Tables" selection is for download only')).toBeInTheDocument();
    expect(getByText("To download the data, select the 'Download' button and choose the desired format.")).toBeInTheDocument();
  });
});
