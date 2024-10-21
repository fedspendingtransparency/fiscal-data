import React from 'react';
import { render } from '@testing-library/react';
import DeficitByYear from './deficit-by-year';
import { setGlobalFetchResponse } from '../../../../../utils/mock-utils';
import { mockDeficitTrendsData } from '../../../explainer-test-helper';

describe('Deficit by year section', () => {
  beforeEach(() => {
    setGlobalFetchResponse(jest, mockDeficitTrendsData);
  });

  it('renders the section links', () => {
    const { getByRole } = render(<DeficitByYear />);
    expect(getByRole('link', { name: 'federal spending' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'federal revenue' })).toBeInTheDocument();
  });

  it('renders the trends chart', async () => {
    const { findByTestId } = render(<DeficitByYear />);
    expect(await findByTestId('deficitTrendsChartParent')).toBeInTheDocument();
  });
});
