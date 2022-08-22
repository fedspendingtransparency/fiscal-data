import {SpendingOverview} from "./spending-overview";
import {render} from '@testing-library/react';
import React from "react";


describe('Federal Spending Overview', () => {
  it('renders the deficit link', () => {
    const {getByRole} = render(<SpendingOverview />);
    expect(getByRole('link', {name: 'national deficit'})).toBeInTheDocument();
  });

  it('renders the USA Spending link', () => {
    const {getByRole} = render(<SpendingOverview />);
    expect(getByRole('link', {name: 'USAspending.gov'})).toBeInTheDocument();
  });
});
