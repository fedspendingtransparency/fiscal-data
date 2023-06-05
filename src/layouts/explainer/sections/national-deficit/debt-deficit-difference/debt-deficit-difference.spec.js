import React from 'react';
import {render} from '@testing-library/react';
import DebtDeficitDifference from "./debt-deficit-difference";


describe('Difference between national debt and national deficit section', () => {
  it('renders the text content', () => {
    const {getByTestId, getByRole} = render(<DebtDeficitDifference />);
    expect(getByTestId('textContent')).toBeInTheDocument();
    expect(getByRole('link')).toBeInTheDocument();
  });

  it('renders the accordion', () => {
    const {getByText} = render(<DebtDeficitDifference />);
    expect(getByText('How else does the federal government finance a deficit?'))
      .toBeInTheDocument();
  });

  it('render the deficit-img', () => {
    const {getByTestId} = render(<DebtDeficitDifference />);
    expect(getByTestId('deficitDifferenceChart')).toBeInTheDocument();
  });
});
