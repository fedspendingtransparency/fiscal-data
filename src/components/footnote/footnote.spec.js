import React from 'react';
import { render, screen } from '@testing-library/react';
import Footnote from './footnote';

const mockFootnotes = [
  {
    anchors: [
      { text: '1', link: 'mock-link1' },
      { text: '2', link: 'mock-link2' },
    ],
    definition: 'Mock Definition',
  },
  {
    anchors: [{ text: '3', link: 'mock-link3' }],
    definition: 'Mock Definition2',
  },
];

describe('Footnote Section', () => {
  it('renders the footnote section and items', () => {
    const { getByTestId, getAllByTestId } = render(<Footnote footnotes={mockFootnotes} />);
    expect(getByTestId('footnote-section')).toBeInTheDocument();
    expect(getAllByTestId('footnote-item')).toHaveLength(2);
  });

  it('renders with custom width', () => {
    render(<Footnote footnotes={mockFootnotes} width="50%" />);

    screen.getAllByTestId('footnote-item').forEach(item => {
      expect(item).toHaveStyle({ width: '50%' });
    });
  });

  it('renders safely with no footnotes', () => {
    render(<Footnote footnotes={[]} />);

    // We still have the container ...
    expect(screen.getByTestId('footnote-section')).toBeInTheDocument();

    // ... but no footnote items
    expect(screen.queryByTestId('footnote-item')).toBeNull();
  });
});
