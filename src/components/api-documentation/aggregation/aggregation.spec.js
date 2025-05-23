import React from 'react';
import Aggregation from './aggregation';
import { render } from '@testing-library/react';

describe('Filters', () => {
  it('has SectionContent as a part of its layout', () => {
    const { getAllByTestId } = render(<Aggregation />);
    expect(getAllByTestId('section-content').length).toBeGreaterThan(0);
  });

  it('creates the Aggregation section with the desired id, heading tag and title', () => {
    const title = 'Aggregation and Sums';
    const { getByRole } = render(<Aggregation />);

    const heading = getByRole('heading', { level: 2, name: title });
    expect(heading).toBeInTheDocument();
  });
});
