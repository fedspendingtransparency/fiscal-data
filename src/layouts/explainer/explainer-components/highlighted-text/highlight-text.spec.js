import {render} from '@testing-library/react';
import React from 'react';
import HighlightedText from './highlighted-text';

describe('highlighted text for announcements ', () => {

  it('verifies text are displayed', () => {
    const {getByText} = render(<HighlightedText />);
    expect(getByText('COMING SOON!', {exact: false})).toBeInTheDocument();
  });
});
