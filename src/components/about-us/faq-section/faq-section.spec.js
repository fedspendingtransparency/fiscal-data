import React from 'react';
import FAQ from './faq-section';
import { render } from '@testing-library/react';

const h3Headers = ['who', 'when', 'why', 'how', 'get-updates', 'new-to-apis', 'taxes-stimulus-inquiries', 'update-frequency'];

describe('FAQ section', () => {
  it('renders a SectionContent component with correct title and headingLevel for main title', async () => {
    const { findByRole } = render(<FAQ />);
    const heading = await findByRole('heading', { name: 'FAQs', level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('renders the correct number of SectionContent components with headingLevel 3', async () => {
    const { findAllByRole } = render(<FAQ />);
    const headers = await findAllByRole('heading', { level: 3 });
    expect(headers.length).toEqual(h3Headers.length);
  });

  it('does Highlight Who Can I Contact when triggered and stops highlighting', async () => {
    const { findByRole } = render(<FAQ triggerHighlight={1} />);
    const highlightedText = await findByRole('mark');
    expect(highlightedText).toBeInTheDocument();
  });
});
