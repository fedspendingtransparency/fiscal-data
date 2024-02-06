import React from 'react';
import { render } from '@testing-library/react';
import SavingsBondsOverview from './savings-bonds-overview';

describe('Savings Bonds Overview Section', () => {
  it('renders the section', () => {
    const { container } = render(<SavingsBondsOverview />);
    expect(container).toBeInTheDocument();
  });

  it('renders the quote box', () => {
    const { getByRole, getAllByRole } = render(<SavingsBondsOverview />);
    expect(getAllByRole('img', { hidden: true })[0]).toHaveClass('fa-calculator');
    expect(getByRole('link', { name: 'Savings Bond Calculator' })).toBeInTheDocument();
  });
});
