import React from 'react';
import GenerativeReportsEmptyTable from './generative-reports-empty-table';
import { render, within } from '@testing-library/react';

jest.mock('../../../variables.module.scss', () => {
  return {
    breakpointLg: '992px',
  };
});
describe('Generative Report Empty Table', () => {
  const rowCount = 3;
  it('renders a table', () => {
    const { getByRole, getAllByRole } = render(<GenerativeReportsEmptyTable width={1000} />);

    expect(getByRole('table')).toBeInTheDocument();
    expect(getAllByRole('row')).toHaveLength(rowCount + 1);
    const headerRow = getByRole('columnheader', {});
    expect(within(headerRow).getByText('Name')).toBeInTheDocument();
    expect(within(headerRow).getByText('Date')).toBeInTheDocument();
    expect(within(headerRow).getByText('Size')).toBeInTheDocument();
  });

  it('renders a mobile table', () => {
    const { getByRole, getAllByRole } = render(<GenerativeReportsEmptyTable width={300} />);
    expect(getByRole('table')).toBeInTheDocument();
    expect(getAllByRole('row')).toHaveLength(rowCount + 1);
    const headerRow = getByRole('columnheader');
    expect(within(headerRow).getByText('Name')).toBeInTheDocument();
    expect(within(headerRow).queryByText('Date')).not.toBeInTheDocument();
    expect(within(headerRow).queryByText('Size')).not.toBeInTheDocument();
  });
});
