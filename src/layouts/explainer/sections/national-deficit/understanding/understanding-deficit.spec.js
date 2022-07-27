import React from 'react';
import {render} from '@testing-library/react';
import UnderstandingDeficit from "./understanding-deficit";


describe('Deficit and Surplus Causes Section', () => {
  it('renders the text content', () => {
    const {getByTestId} = render(<UnderstandingDeficit />);
    expect(getByTestId('textContent')).toBeInTheDocument();
  });

  it('renders the bar chart', () => {
    const {getByTestId} = render(<UnderstandingDeficit />);
    expect(getByTestId('deficitComparisonChart')).toBeInTheDocument();
  });
});
