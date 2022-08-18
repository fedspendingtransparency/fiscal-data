import {SpendingDifference} from "./spending-difference";
import {render} from '@testing-library/react';
import React from "react";
import {fireEvent} from "@testing-library/dom";


describe('Federal Spending Overview', () => {
  it('renders the subcategory headers', () => {
    const {getByRole} = render(<SpendingDifference />);
    expect(getByRole('heading', {name: 'Who controls federal government spending?'}))
      .toBeInTheDocument();
    expect(getByRole('heading', {name: 'Mandatory Spending'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'Discretionary Spending'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'Supplemental Spending'})).toBeInTheDocument();
  });

  it('renders the accordion', () => {
    const {getByText} = render(<SpendingDifference />);
    const accordion = getByText('What is the process for determining discretionary spending?');
    expect(accordion).toBeInTheDocument();
    fireEvent.click(accordion);
    expect(getByText('Discretionary spending is determined', {exact: false})).toBeInTheDocument();
  });
});
