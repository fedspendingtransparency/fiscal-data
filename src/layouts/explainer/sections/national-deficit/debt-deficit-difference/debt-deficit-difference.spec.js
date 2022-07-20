import React from 'react';
import {render} from '@testing-library/react';
import DebtDeficitDifference from "./debt-deficit-difference";


describe('Deficit and Surplus Causes Section', () => {
  it('renders the text content', () => {
    const {getByTestId} = render(<DebtDeficitDifference />);
    expect(getByTestId('textContent')).toBeInTheDocument();
  });

  it('renders the link', () => {
    const {getByRole} = render(<DebtDeficitDifference />);
    expect(getByRole('link')).toBeInTheDocument();
  });
  it('renders the chart placeholder', () => {
    const {getByTestId} = render(<DebtDeficitDifference />);
    expect(getByTestId('chart')).toBeInTheDocument();
  });

  it('renders the accordion', () => {
    const {getByText} = render(<DebtDeficitDifference />);
    expect(getByText('How else does the federal government finance a deficit?'))
      .toBeInTheDocument();
  })
});
