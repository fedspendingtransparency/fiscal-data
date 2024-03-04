import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SavingsBondsAreFullyMatured from './savings-bonds-are-fully-matured';

const fullyMaturedAccordion = 'What is the Treasury Doing to Reduce Matured Unredeemed Debt?';

describe('What Happens when Savings Bonds are Fully Matured Section', () => {
  it('renders the section', () => {
    render(<SavingsBondsAreFullyMatured/>);
    expect(screen.getByText('Therefore, the Treasury has increased efforts to encourage bondholders to redeem their matured savings bonds.',
      {exact: false})).toBeInTheDocument();
    expect(
      screen.getByText(
        'Imagine you bought a series EE bond 30 years ago for $500.',
        {exact: false}
      )
    ).toBeInTheDocument();
    expect(screen.getByText(fullyMaturedAccordion)).toBeInTheDocument();
  });
});
