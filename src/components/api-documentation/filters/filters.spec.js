import React from 'react';
import Filters from './filters';
import { render } from '@testing-library/react';

describe('Filters', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findAllByTestId } = render(<Filters />);
    const sectionContent = await findAllByTestId('section-content');
    expect(sectionContent.length).toBeGreaterThan(0);
  });

  it('creates the Filters section with the desired id, heading tag and title', async () => {
    const title = 'Filters';
    const { findByRole } = render(<Filters />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
});
