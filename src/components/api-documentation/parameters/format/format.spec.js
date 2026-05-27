import React from 'react';
import Format from './format';
import { render } from '@testing-library/react';

describe('Parameters Format', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findAllByTestId } = render(<Format />);
    const sectionContent = await findAllByTestId('section-content');
    expect(sectionContent.length).toBeGreaterThan(0);
  });

  it('creates the Format section with the desired id, heading tag and title', async () => {
    const title = 'Format';
    const { findByRole } = render(<Format />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
});
