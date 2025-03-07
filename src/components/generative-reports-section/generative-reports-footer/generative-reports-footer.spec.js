import React from 'react';
import GenerativeReportsFooter from './generative-reports-footer';
import { render } from '@testing-library/react';
import GenerativeReportsEmptyTable from '../generative-reports-empty-table/generative-reports-empty-table';

describe('Generative Report Footer', () => {
  it('renders text', () => {
    const { getByRole, getAllByRole } = render(<GenerativeReportsEmptyTable />);

    expect(getByRole('span')).toBeInTheDocument();
  });
});
