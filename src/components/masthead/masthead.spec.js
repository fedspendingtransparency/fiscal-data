import React from 'react';
import Masthead from './masthead';
import { fireEvent, render, within } from '@testing-library/react';

describe('Masthead component', () => {
  it('displays the dataset name in an H1 element', () => {
    const { getByRole } = render(<Masthead title="Debt to the Nickel" techSpecs={{}} tagLine="All the debt, to the nickel." />);
    const titleDisplayed = getByRole('heading', { level: 1 }); // will fail if not exactly 1 <h1 />
    expect(within(titleDisplayed).getByText('Debt to the Nickel')).toBeInTheDocument();
  });

  it('applies stickyView class to the title once the position exceeds the breakpoint', () => {
    const { getByRole } = render(<Masthead title="Debt to the Nickel" />);
    window.pageYOffset = 150;
    fireEvent.scroll(window);
    const titleDisplayed = getByRole('heading', { level: 1 });
    expect(titleDisplayed).toHaveClass('stickyHeader');
  });
});
