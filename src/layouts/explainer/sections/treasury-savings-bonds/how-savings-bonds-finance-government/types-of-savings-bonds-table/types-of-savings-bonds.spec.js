import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import TypesOfSavingsBonds from './types-of-savings-bonds';
import TypesOfSavingsBondsResponsive from './types-of-savings-bonds-responsive';
import { fireEvent } from '@testing-library/dom';

describe('Types of Savings Bonds Table', () => {
  const mockTableContent = [
    {
      name: 'Type',
      content: ['A Bonds', 'FF Bonds'],
    },
    {
      name: 'Primary Advantage',
      content: ["Protect buyer's money from inflation", 'Guaranteed to double in value in 20 years'],
    },
    {
      name: 'Issuing Method',
      content: ['Primarily Electronic', 'Electronic Only'],
    },
    {
      name: 'Interest Earnings',
      content: ['A fixed interest rate and a variable rate based on inflation', 'A steady interest rate that does not change'],
    },
    {
      name: 'Redemption',
      content: [
        'Redeemable after 1 year; if redeemed in the first five years, the interest accumulated from the last three months will be deducted from the final payout',
      ],
    },
  ];

  it('renders desktop table with mock content', () => {
    const { getByText } = render(<TypesOfSavingsBonds tableContent={mockTableContent} />);
    expect(getByText('Type')).toBeInTheDocument();
  });

  it('renders mobile table with mock content', () => {
    const { getByText } = render(<TypesOfSavingsBondsResponsive tableContent={mockTableContent} />);
    expect(getByText('Type')).toBeInTheDocument();
  });

  it('gradient is present until end of right scroll on mobile table', () => {
    const { getByTestId, queryByTestId } = render(<TypesOfSavingsBondsResponsive tableContent={mockTableContent} />);
    expect(getByTestId('gradient')).toBeInTheDocument();
    const scrollContainer = getByTestId('scroll-container');
    fireEvent.scroll(scrollContainer, { target: { scrollRight: 100 } });
    expect(queryByTestId('gradient')).not.toBeInTheDocument();
  });

  it('shadow is not present until right scroll on mobile table', () => {
    const { getByTestId, queryByTestId } = render(<TypesOfSavingsBondsResponsive tableContent={mockTableContent} />);
    expect(queryByTestId('shadow')).not.toBeInTheDocument();
    const scrollContainer = getByTestId('scroll-container');
    fireEvent.scroll(scrollContainer, { target: { scrollLeft: 10 } });
    expect(getByTestId('shadow')).toBeInTheDocument();
    fireEvent.scroll(scrollContainer, { target: { scrollLeft: 0 } });
    expect(queryByTestId('shadow')).not.toBeInTheDocument();
  });
});
