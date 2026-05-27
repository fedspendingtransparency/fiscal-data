import React from 'react';
import MetaObject from './meta-object';
import { render } from '@testing-library/react';

describe('Meta Object', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findByTestId } = render(<MetaObject />);
    const sectionContent = await findByTestId('section-content');
    expect(sectionContent).toBeInTheDocument();
  });

  it('creates the Meta Object section with the desired id, heading tag and title', async () => {
    const title = 'Meta Object';
    const { findByRole } = render(<MetaObject />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
});
