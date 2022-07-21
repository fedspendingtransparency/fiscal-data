import React from 'react';
import {render} from '@testing-library/react';
import DebtDeficitDifference from "./debt-deficit-difference";


describe('Deficit and Surplus Causes Section', () => {
  it('renders the text content', () => {
    const {getByTestId, getByRole} = render(<DebtDeficitDifference />);
    expect(getByTestId('textContent')).toBeInTheDocument();
    expect(getByRole('link')).toBeInTheDocument();
  });

  it('renders the accordion', () => {
    const {getByText} = render(<DebtDeficitDifference />);
    expect(getByText('How else does the federal government finance a deficit?'))
      .toBeInTheDocument();
  })
});
