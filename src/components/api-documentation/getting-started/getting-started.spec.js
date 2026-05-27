import React from 'react';
import GettingStarted from './getting-started';
import { render } from '@testing-library/react';

describe('Getting Started', () => {
  it('has SectionContent as a part of its layout', () => {
    const { getAllByTestId } = render(<GettingStarted />);

    expect(getAllByTestId('section-content').length).toBeGreaterThan(0);
  });

  it('creates the Getting Started section with the desired id, heading tag and title', () => {
    const title = 'Getting Started';
    const { getByRole } = render(<GettingStarted />);
    const heading = getByRole('heading', { level: 2, name: title });
    expect(heading).toBeInTheDocument();
  });

  it('creates the "What is an API?" section with the desired id, heading tag and title', () => {
    const title = 'What is an API?';
    const { getByRole } = render(<GettingStarted />);
    const heading = getByRole('heading', { level: 3, name: title });
    expect(heading).toBeInTheDocument();
  });

  it('creates the "What is a Dataset?" section with the desired id, heading tag and title', () => {
    const title = 'What is a Dataset?';
    const { getByRole } = render(<GettingStarted />);
    const heading = getByRole('heading', { level: 3, name: title });
    expect(heading).toBeInTheDocument();
  });

  it('creates the API Endpoint section with the desired id, heading tag and title', () => {
    const title = 'API Endpoint URL Structure';
    const { getByRole } = render(<GettingStarted />);
    const heading = getByRole('heading', { level: 3, name: title });
    expect(heading).toBeInTheDocument();
  });

  it('creates the How to Access our API section with the desired id, heading tag and title', () => {
    const title = 'How to Access our API';
    const { getByRole } = render(<GettingStarted />);
    const heading = getByRole('heading', { level: 3, name: title });
    expect(heading).toBeInTheDocument();
  });

  it('creates the License and Authorization section with the desired id, heading tag and title', () => {
    const title = 'License and Authorization';
    const { getByRole } = render(<GettingStarted />);
    const heading = getByRole('heading', { level: 3, name: title });
    expect(heading).toBeInTheDocument();
  });

  it('creates the API Versioning section with the desired id, heading tag and title', () => {
    const title = 'API Versioning';
    const { getByRole } = render(<GettingStarted />);
    const heading = getByRole('heading', { level: 3, name: title });
    expect(heading).toBeInTheDocument();
  });
});
