import React from 'react';
import DataRegistry, { dataRegistryTitle } from './data-registry';
import { render } from '@testing-library/react';

describe('DataRegistry', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findByTestId } = render(<DataRegistry />);
    const sectionContent = await findByTestId('section-content');
    expect(sectionContent).toBeInTheDocument();
  });

  it('creates the DataRegistry section with the desired id, heading tag and title', async () => {
    const { findByRole } = render(<DataRegistry />);
    const heading = await findByRole('heading', { name: dataRegistryTitle });
    expect(heading).toBeInTheDocument();
  });
});
