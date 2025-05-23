import React from 'react';
import Fields from './fields';
import { render } from '@testing-library/react';

describe('Fields', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findAllByTestId } = render(<Fields />);
    const sectionContent = await findAllByTestId('section-content');
    expect(sectionContent.length).toBeGreaterThan(0);
  });

  it('creates the Fields section with the desired id, heading tag and title', async () => {
    const title = 'Fields';
    const { findByRole } = render(<Fields />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the Data Types section with the desired id, heading tag and title', async () => {
    const title = 'Data Types';
    const { findByRole } = render(<Fields />);
    const heading = await findByRole('heading', { name: title, level: 4 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the Fields by Endpoint section with the desired id, heading tag and title', async () => {
    const title = 'Fields by Endpoint';
    const { findByRole } = render(<Fields />);
    const heading = await findByRole('heading', { name: title, level: 4 });
    expect(heading).toBeInTheDocument();
  });
});
