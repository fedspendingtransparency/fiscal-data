import CitationList from './citation-list';
import React from 'react';
import { render } from '@testing-library/react';

describe('Citation List', () => {
  it('renders the header', () => {
    const { getByRole } = render(<CitationList header="Mock Header" citations={[]} />);
    expect(getByRole('heading', { name: 'Mock Header' })).toBeInTheDocument();
  });

  it('renders all citations', () => {
    const mockCitations = [
      { url: 'https://fiscaldata.treasury.gov/', text: 'First Citation' },
      { url: 'https://fiscaldata.treasury.gov/about-us/', text: 'Second Citation' },
    ];
    const { getByRole } = render(<CitationList header="Mock Header" citations={mockCitations} />);
    expect(getByRole('link', { name: 'First Citation' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Second Citation' })).toBeInTheDocument();
  });
});
