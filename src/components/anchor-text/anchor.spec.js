import React from 'react';
import {render} from '@testing-library/react';
import AnchorText from './anchor-text';

const mockFootnote = {
  text: 'Test Footnote Text',
  link: 'testFootnote',
  body:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vulputate odio a enim hendrerit interdum. Duis volutpat, nibh porttitor pellentesque mattis, mi justo',
};
  
describe('Anchor Text', () => {
  it('it renders the Anchor Text component', () => {
    const {getByTestId} = render(<AnchorText link={mockFootnote.link} text={mockFootnote.text}/>);
    expect(getByTestId('anchor-text')).toBeInTheDocument();
  });
})