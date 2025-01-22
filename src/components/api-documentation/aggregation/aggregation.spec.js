import React from 'react';
import Aggregation from './aggregation';
import { render } from '@testing-library/react';

describe('Filters', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findByTestId } = render(<Aggregation />);
    const sectionContent = await findByTestId('section-content');
    expect(sectionContent).toBeInTheDocument();
  });

  it('creates the Aggregation section with the desired id, heading tag and title', async () => {
    const title = 'Aggregation & Sums';
    const { findByRole } = render(<Aggregation />);
    const heading = await findByRole('heading', { name: title, level: 2 });
    expect(heading).toBeInTheDocument();
  });
});
