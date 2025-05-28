import React from 'react';
import Masthead from './masthead';
import { render, within } from '@testing-library/react';

describe('Masthead component', () => {
  it('displays the dataset name in an H1 element', () => {
    const { getByRole } = render(<Masthead title="Debt to the Nickel" techSpecs={{}} tagLine="All the debt, to the nickel." />);
    const titleDisplayed = getByRole('heading', { level: 1 }); // will fail if not exactly 1 <h1 />
    expect(within(titleDisplayed).getByText('Debt to the Nickel')).toBeInTheDocument();
  });
});
