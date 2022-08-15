import React from 'react';
import {render} from '@testing-library/react';
import DeficitAndSurplusCauses from "./deficit-and-surplus-causes";


describe('Deficit and Surplus Causes Section', () => {
  it('renders the text content', () => {
    const glossary = [];
    const {getByTestId, getByRole} = render(<DeficitAndSurplusCauses glossary={glossary} />);
    expect(getByTestId('textContent')).toBeInTheDocument();
    expect(getByRole('link')).toBeInTheDocument();
  })
});
