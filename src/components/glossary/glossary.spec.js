import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import Glossary from './glossary';

const triggerClickEvent = (itemToClick) => {
  fireEvent(itemToClick, new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  }));
};

describe('glossary header',() => {
  it('renders the glossary', () => {
    const { getByTestId } = render(<Glossary />);

    expect(getByTestId('glossaryContainer')).toBeInTheDocument();
  });

  it('contains an overlay div', () => {
    const { getByTestId } = render(<Glossary />);
    expect(getByTestId('overlay')).toBeDefined();
  });

  it('after the glossary is open, closes the glossary when the overlay is clicked', () => {
    const { getByTestId } = render(<Glossary />);

    const theOverlay = getByTestId('overlay');
    const theContainer = getByTestId('glossaryContainer');

    expect(theContainer).toHaveClass('open');

    triggerClickEvent(theOverlay);
    expect(theContainer).not.toHaveClass('open');
  });
});
