import React from 'react';
import Examples from './examples';
import { render } from '@testing-library/react';

describe('API Documentation Examples', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findAllByTestId } = render(<Examples />);
    const sectionContent = await findAllByTestId('section-content');
    expect(sectionContent.length).toBeGreaterThan(0);
  });

  it('creates the Examples section with the desired id, heading tag and title', async () => {
    const title = 'Examples and Code Snippets';
    const { findByRole } = render(<Examples />);
    const heading = await findByRole('heading', { name: title, level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the Fields section with the desired id, heading tag and title', async () => {
    const title = 'Fields';
    const { findByRole } = render(<Examples />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the Filters section with the desired id, heading tag and title', async () => {
    const title = 'Filters';
    const { findByRole } = render(<Examples />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the Sorting section with the desired id, heading tag and title', async () => {
    const title = 'Sorting';
    const { findByRole } = render(<Examples />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the Format section with the desired id, heading tag and title', async () => {
    const title = 'Format';
    const { findByRole } = render(<Examples />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the Pagination section with the desired id, heading tag and title', async () => {
    const title = 'Pagination';
    const { findByRole } = render(<Examples />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the Aggregation section with the desired id, heading tag and title', async () => {
    const title = 'Aggregation';
    const { findByRole } = render(<Examples />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the Multi-dimension Datasets section with the desired id, heading tag and title', async () => {
    const title = 'Multi-dimension Datasets';
    const { findByRole } = render(<Examples />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
});
