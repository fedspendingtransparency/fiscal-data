import { render } from '@testing-library/react';
import React from 'react';
import CustomDotNoAnimation from './custom-dot';
import { spendingExplainerPrimary } from '../../../federal-spending/federal-spending.module.scss';
import { revenueExplainerPrimary } from '../../../government-revenue/revenue.module.scss';

describe('AFG Deficit Tooltip', () => {
  const mockPayloadSpending = {
    type: 'spending',
  };
  const mockPayloadRevenue = {
    type: 'revenue',
  };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders the spending dot', () => {
    const { getByTestId } = render(<CustomDotNoAnimation payload={mockPayloadSpending} cx={0} cy={0} r={0} />);
    const dot = getByTestId('customDot');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveStyle({ color: spendingExplainerPrimary });
  });

  it('renders the revenue dot', async () => {
    const { getByTestId } = render(<CustomDotNoAnimation payload={mockPayloadRevenue} cx={0} cy={0} r={0} />);
    const dot = getByTestId('customDot');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveStyle({ color: revenueExplainerPrimary });
  });
});
