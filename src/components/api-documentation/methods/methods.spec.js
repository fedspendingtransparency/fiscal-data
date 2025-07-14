import React from 'react';
import Methods from './methods';
import { render } from '@testing-library/react';

describe('Methods', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findAllByTestId } = render(<Methods />);
    const sectionContent = await findAllByTestId('section-content');
    expect(sectionContent.length).toBeGreaterThan(0);
  });

  it('creates the Methods section with the desired id, heading tag and title', async () => {
    const title = 'Methods';
    const { findByRole } = render(<Methods />);
    const heading = await findByRole('heading', { name: title, level: 2 });
    expect(heading).toBeInTheDocument();
  });
});
