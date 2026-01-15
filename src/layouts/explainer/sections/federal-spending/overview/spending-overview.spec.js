import { SpendingOverview } from './spending-overview';
import { render } from '@testing-library/react';
import React from 'react';

describe('Federal Spending Overview', () => {
  global.console.warn = jest.fn();

  it('renders the deficit link', () => {
    const { getByRole } = render(<SpendingOverview />);
    expect(getByRole('link', { name: 'national deficit' })).toBeInTheDocument();
  });

  it('renders the USA Spending link', () => {
    const { getByRole } = render(<SpendingOverview />);
    expect(getByRole('link', { name: 'USAspending.gov' })).toBeInTheDocument();
  });

  it('renders the quotebox', () => {
    const { getByTestId } = render(<SpendingOverview />);
    expect(getByTestId('quote-box')).toBeInTheDocument();
  });
});
