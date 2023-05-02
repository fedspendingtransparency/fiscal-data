import { render } from '@testing-library/react';
import React from 'react';
import GlossaryList from './glossary-list';
describe('glossary list',() => {
  const glossaryExample = {
    'A': [
      {
        id: 3,
        term: 'Apple',
        site_page: 'spending',
        definition: 'An apple',
        urlDisplay: 'example.com',
        urlPath: 'example.com'
      },
      {
        id: 4,
        term: 'Another Apple',
        site_page: 'spending',
        definition: 'An apple',
        urlDisplay: 'example.com',
        urlPath: 'example.com'
      }
    ],
    'B': [
      {
        id: 1,
        term: 'Banana',
        site_page: 'debt',
        definition: 'A banana',
        urlDisplay: 'example.com',
        urlPath: 'example.com'
      },
    ],
    'P': [
      {
        id: 2,
        term: 'Pear',
        site_page: 'debt',
        definition: 'A pear',
        urlDisplay: 'example.com',
        urlPath: 'example.com'
      },
    ],
  }

  it('contains the initial list header', () => {
    const { getByText } = render(<GlossaryList termMap={glossaryExample} />);

    expect(getByText('All Terms')).toBeInTheDocument();
  });

  it('renders a header for every letter containing a term', () => {
    const { getByText } = render(<GlossaryList termMap={glossaryExample} />);

    expect(getByText('A')).toBeInTheDocument();
    expect(getByText('B')).toBeInTheDocument();
    expect(getByText('P')).toBeInTheDocument();
  });

  it('renders all terms for each given letter', () => {
    const { getByText } = render(<GlossaryList termMap={glossaryExample} />);

    expect(getByText('Apple')).toBeInTheDocument();
    expect(getByText('Another Apple')).toBeInTheDocument();
    expect(getByText('Banana')).toBeInTheDocument();
    expect(getByText('Pear')).toBeInTheDocument();
  });

});
