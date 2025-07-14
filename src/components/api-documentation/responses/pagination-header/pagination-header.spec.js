import React from 'react';
import PaginationHeader from './pagination-header';
import { render } from '@testing-library/react';

describe('Error Object', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findByTestId } = render(<PaginationHeader />);
    const sectionContent = await findByTestId('section-content');
    expect(sectionContent).toBeInTheDocument();
  });

  it('creates the Pagination Header section with the desired id, heading tag and title', async () => {
    const title = 'Pagination Header';
    const { findByRole } = render(<PaginationHeader />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
});
