import React from 'react';
import Pagination from './pagination';
import { render } from '@testing-library/react';

describe('Parameters Pagination', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findAllByTestId } = render(<Pagination />);
    const sectionContent = await findAllByTestId('section-content');
    expect(sectionContent.length).toBeGreaterThan(0);
  });

  it('creates the Pagination section with the desired id, heading tag and title', async () => {
    const title = 'Pagination';
    const { findByRole } = render(<Pagination />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
});
