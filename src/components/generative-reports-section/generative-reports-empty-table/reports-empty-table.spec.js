import React from 'react';
import GenerativeReportsEmptyTable from './generative-reports-empty-table';
import { render } from '@testing-library/react';

describe('Empty Table', () => {
  it('renders a table', () => {
    const { getByRole, getAllByRole } = render(<GenerativeReportsEmptyTable />);

    expect(getByRole('table')).toBeInTheDocument();
    expect(getAllByRole('row')).toHaveLength(11);
  });

  it('renders a table with specified number of rows', () => {
    const { getByRole, getAllByRole } = render(<GenerativeReportsEmptyTable rowCount={5} />);

    expect(getByRole('table')).toBeInTheDocument();
    expect(getAllByRole('row')).toHaveLength(6);
  });
});
