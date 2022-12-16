import React from 'react';
import { render } from '@testing-library/react';
import Footnote from './footnote';

const mockFootnotes = [
  {
    anchors: [
      { text: ['1'], link: ['mock-link1'] },
      { text: ['2'], link: ['mock-link2'] },
    ],
    definition: 'Mock Definition',
  },
  {       
    anchors: [          
      { text: ['3'], link: ['mock-link3'] },
    ],
    definition: 'Mock Definition2',
  },
];

describe('Footnote Section', () => {
  it('it renders the footnote section and items', () => {
    const { getByTestId, getAllByTestId } = render(
      <Footnote footnotes={mockFootnotes} />
    );
    expect(getByTestId('footnote-section')).toBeInTheDocument();
    expect(getAllByTestId('footnote-item')).toHaveLength(2);
  });
});
