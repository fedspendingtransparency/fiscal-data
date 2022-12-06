import React from 'react';
import { render } from '@testing-library/react';
import Footnote from './footnote';

const mockFootnotes = [
  {
    text: 'Test Footnote Text',
    link: 'testFootnote',
    body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vulputate odio a enim hendrerit interdum. Duis volutpat, nibh porttitor pellentesque mattis, mi justo',
  },
  {
    text: 'Test Footnote Text2',
    link: 'testFootnote2',
    body:
      'Lorem ipsum dolor sit amadipiodio autpat, nibh porttitor pellentesque mattis, mi justo',
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
