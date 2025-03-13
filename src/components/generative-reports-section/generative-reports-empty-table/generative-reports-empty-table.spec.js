import React from 'react';
import GenerativeReportsEmptyTable from './generative-reports-empty-table';
import { render } from '@testing-library/react';

describe('Generative Report Empty Table', () => {
  it('renders a table', () => {
    const { getByRole, getAllByRole } = render(<GenerativeReportsEmptyTable />);

    expect(getByRole('table')).toBeInTheDocument();
    expect(getAllByRole('row')).toHaveLength(3);
  });

  it('renders a mobile table with more of rows', () => {
    const { getByRole, getAllByRole } = render(<GenerativeReportsEmptyTable mobileView={true} />);

    expect(getByRole('table')).toBeInTheDocument();
    expect(getAllByRole('row')).toHaveLength(5);
  });
});
