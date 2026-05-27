import React from 'react';
import Sorting from './sorting';
import { render } from '@testing-library/react';

describe('Parameters Sorting', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findAllByTestId } = render(<Sorting />);
    const sectionContent = await findAllByTestId('section-content');
    expect(sectionContent.length).toBeGreaterThan(0);
  });

  it('creates the Sorting section with the desired id, heading tag and title', async () => {
    const title = 'Sorting';
    const { findByRole } = render(<Sorting />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
});
