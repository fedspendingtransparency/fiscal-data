import {render} from '@testing-library/react';
import React from 'react';
import HighlightedText from './highlighted-text';
import {
  hightlighTextContainer,
  hightlightText
} from "./highlight-text.module.scss";

describe('highlighted text for anouncments ', () => {

  it('verifies text are displayed', () => {
    const {getByText} = render(<HighlightedText />);
    expect(getByText('COMING SOON!', {exact: false})).toBeInTheDocument();
  });
});
