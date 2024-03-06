import React from 'react';
import ChartDataHeader from './chart-data-header';
import { render } from '@testing-library/react';

describe('Chart Data Header', () => {
  const mockHeaderRight = { label: 'right', value: '$1' };
  const mockHeaderLeft = { label: 'left', value: '$2' };
  it('renders the header', () => {
    const { getByText } = render(<ChartDataHeader fiscalYear="2020" right={mockHeaderRight} left={mockHeaderLeft} />);
    expect(getByText('right')).toBeInTheDocument();
    expect(getByText('$1')).toBeInTheDocument();
    expect(getByText('left')).toBeInTheDocument();
    expect(getByText('$2')).toBeInTheDocument();
    expect(getByText('Fiscal Year')).toBeInTheDocument();
    expect(getByText('2020')).toBeInTheDocument();
  });
});
