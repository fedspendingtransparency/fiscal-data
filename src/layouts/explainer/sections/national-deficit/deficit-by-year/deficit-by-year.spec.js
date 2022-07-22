import React from 'react';
import {render} from '@testing-library/react';
import DeficitByYear from "./deficit-by-year";


describe('Deficit and Surplus Causes Section', () => {
  it('renders the text content', () => {
    const {getByTestId, getByRole} = render(<DeficitByYear />);
    expect(getByTestId('textContent')).toBeInTheDocument();
    expect(getByRole('link')).toBeInTheDocument();
  });
});
