import React from 'react';
import { render } from '@testing-library/react';
import ChartApiError from '../chart-api-error/chart-api-error';

describe('Chart api error message', () => {
  it('renders the component', () => {
    const { getByText } = render(<ChartApiError />);
    expect(getByText('Chart failed to load.')).toBeInTheDocument();
  });
});
