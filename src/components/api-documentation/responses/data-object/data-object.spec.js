import React from 'react';
import DataObject from './data-object';
import { render } from '@testing-library/react';

describe('Data Object', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findByTestId } = render(<DataObject />);
    const sectionContent = await findByTestId('section-content');
    expect(sectionContent).toBeInTheDocument();
  });

  it('creates the Data Object section with the desired id, heading tag and title', async () => {
    const title = 'Data Object';
    const { findByRole } = render(<DataObject />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
});
