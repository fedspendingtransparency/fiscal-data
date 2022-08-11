import React from 'react';
import {render} from '@testing-library/react';
import DebtDeficitDifference from "./debt-deficit-difference";
import {deficitDebtDifferenceVisContainer} from "./debt-deficit-difference.module.scss";
import {getByTestId} from "@testing-library/dom";


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
  });

  it('render the deficit-img', () => {
    const {getByTestId} = render(<DebtDeficitDifference />);
    expect(getByTestId('deficitDifferenceChart')).toBeInTheDocument();
  });
});
