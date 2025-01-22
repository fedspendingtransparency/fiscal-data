import React from 'react';
import LinksObject from './links-object';
import { render } from '@testing-library/react';

describe('Links Object', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findByTestId } = render(<LinksObject />);
    const sectionContent = await findByTestId('section-content');
    expect(sectionContent).toBeInTheDocument();
  });

  it('creates the Link Object section with the desired id, heading tag and title', async () => {
    const title = 'Link Object';
    const { findByRole } = render(<LinksObject />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
});
