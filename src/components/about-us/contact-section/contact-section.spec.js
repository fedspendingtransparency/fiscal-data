import React from 'react';
import Contact from './contact-section';
import { render } from '@testing-library/react';

describe('Contact Us section', () => {
  it('renders a SectionContent component with correct title and headingLevel for main title', async () => {
    const { findByRole } = render(<Contact />);
    const heading = await findByRole('heading', { name: 'Contact Us', level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('renders the Subscribe section', async () => {
    const { findByRole } = render(<Contact />);
    const subsection = await findByRole('heading', { name: 'Sign Up for Email Updates', level: 3 });
    expect(subsection).toBeInTheDocument();
  });
});
