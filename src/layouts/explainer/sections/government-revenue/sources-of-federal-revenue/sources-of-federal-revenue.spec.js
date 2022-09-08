import {SourcesOfFederalRevenue} from "./sources-of-federal-revenue";
import {render} from '@testing-library/react';
import React from "react";


describe('Sources of Federal Revenue', () => {

  it('renders the category header', () => {
    const {getByRole} = render(<SourcesOfFederalRevenue />);
    expect(getByRole('heading', {name: 'Sources of Federal Revenue'})).toBeInTheDocument();
  });

  it('renders the category sub header', () => {
    const {getByText} = render(<SourcesOfFederalRevenue />);
    const subHeader = getByText('Social Security and Medicare Taxes');
    expect(subHeader).toBeInTheDocument();
  });

  it('render the quote box', () => {
    const {getByTestId} = render(<SourcesOfFederalRevenue />);
    expect(getByTestId('quote-box')).toBeInTheDocument();
  });

});
