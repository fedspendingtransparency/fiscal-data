import React from 'react';
import Parameters from './parameters';
import { render } from '@testing-library/react';

describe('Parameters', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findAllByTestId } = render(<Parameters />);
    const sectionContent = await findAllByTestId('section-content');
    expect(sectionContent.length).toBeGreaterThan(0);
  });
  it('expects Fields to be within its layout', async () => {
    const title = 'Fields';
    const { findByRole } = render(<Parameters />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
  it('expects Filters to be within its layout', async () => {
    const title = 'Filters';
    const { findByRole } = render(<Parameters />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
  it('expects Sorting to be within its layout', async () => {
    const title = 'Sorting';
    const { findByRole } = render(<Parameters />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
  it('expects Format to be within its layout', async () => {
    const title = 'Format';
    const { findByRole } = render(<Parameters />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
  it('expects Pagination to be within its layout', async () => {
    const title = 'Pagination';
    const { findByRole } = render(<Parameters />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the Parameters section with the desired id, heading tag and title', async () => {
    const title = 'Parameters';
    const { findByRole } = render(<Parameters />);
    const heading = await findByRole('heading', { name: title, level: 2 });
    expect(heading).toBeInTheDocument();
  });
});
