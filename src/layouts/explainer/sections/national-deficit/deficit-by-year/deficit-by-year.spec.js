import React from 'react';
import {render} from '@testing-library/react';
import DeficitByYear from "./deficit-by-year";


describe('Deficit and Surplus Causes Section', () => {
  it('renders the text content', () => {
    const {getByTestId} = render(<DeficitByYear />);
    expect(getByTestId('textContent')).toBeInTheDocument();
  });

  it('renders the link', () => {
    const {getByRole} = render(<DeficitByYear />);
    expect(getByRole('link')).toBeInTheDocument();
  });

});
