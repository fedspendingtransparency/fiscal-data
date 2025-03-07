import React from 'react';
import GettingStarted from './getting-started';
import { render } from '@testing-library/react';

describe('Getting Started', () => {
  it('has SectionContent as a part of its layout', async () => {
    const { findAllByTestId } = render(<GettingStarted />);
    const sectionContent = await findAllByTestId('section-content');
    expect(sectionContent.length).toBeGreaterThan(0);
  });

  it('creates the Getting Started section with the desired id, heading tag and title', async () => {
    const title = 'Getting Started';
    const { findByRole } = render(<GettingStarted />);
    const heading = await findByRole('heading', { name: title, level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the "What is an API?" section with the desired id, heading tag and title', async () => {
    const title = 'What is an API?';
    const { findByRole } = render(<GettingStarted />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the "What is a Dataset?" section with the desired id, heading tag and title', async () => {
    const title = 'What is a dataset?';
    const { findByRole } = render(<GettingStarted />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the API Endpoint section with the desired id, heading tag and title', async () => {
    const title = 'API Endpoint URL structure';
    const { findByRole } = render(<GettingStarted />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the How to Access our API section with the desired id, heading tag and title', async () => {
    const title = 'How to Access our API';
    const { findByRole } = render(<GettingStarted />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the License & Authorization section with the desired id, heading tag and title', async () => {
    const title = 'License & Authorization';
    const { findByRole } = render(<GettingStarted />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('creates the Change Log section with the desired id, heading tag and title', async () => {
    const title = 'Change Log';
    const { findByRole } = render(<GettingStarted />);
    const heading = await findByRole('heading', { name: title, level: 3 });
    expect(heading).toBeInTheDocument();
  });
});
