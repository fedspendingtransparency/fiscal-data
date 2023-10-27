import React from 'react';
import AfgHero from './afg-hero';
import { render } from '@testing-library/react';

describe('AFG Hero Component', () => {
  it('renders the Component', () => {
    const { getByTestId, getByText, getByAltText } = render(<AfgHero />);
    expect(getByTestId('afg-hero')).toBeInTheDocument();
    expect(getByText("YOUR GUIDE TO AMERICA'S FINANCES")).toBeInTheDocument();
    expect(getByText("The Latest Data on Federal Revenue, Spending, Deficit, and the National Debt")).toBeInTheDocument();
    expect(getByText("Understand the Basics of Federal Finances from the U.S. Treasury Department")).toBeInTheDocument();
    expect(getByAltText("An open book with a coin above the pages.")).toBeInTheDocument();

  });
});
