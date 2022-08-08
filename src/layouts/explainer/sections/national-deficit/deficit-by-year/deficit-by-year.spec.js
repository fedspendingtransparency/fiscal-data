import React from 'react';
import {render} from '@testing-library/react';
import DeficitByYear from "./deficit-by-year";


describe('Deficit and Surplus Causes Section', () => {
  it('renders the text content', () => {
    const {getByTestId, getAllByRole} = render(<DeficitByYear />);
    expect(getByTestId('textContent')).toBeInTheDocument();
    expect(getAllByRole('link').length).toEqual(2);
  });
  it('renders the trends chart', () => {
    const {getByTestId} = render(<DeficitByYear />);
    expect(getByTestId('deficitTrendsBarChart')).toBeInTheDocument();
  });
});
