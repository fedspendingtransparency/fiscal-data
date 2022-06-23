import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import MobileMenu from "./mobile-menu";

const triggerClickEvent = (itemToClick) => {
  fireEvent(itemToClick, new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  }));
};

describe('MobileMenu actions', () => {
  let getByTestId = jest.fn();
  let queryByRole = jest.fn();
  let theButton = null;
  beforeEach(() => {
    ({getByTestId, queryByRole} = render(<MobileMenu />));
    theButton = queryByRole('button');
  });

  afterEach(() => {
    cleanup();
  });

  it('contains an overlay div', () => {
    expect(getByTestId('overlay')).toBeDefined();
  });

  it('applies an open class to the menuContainer when the menu button is clicked', () => {
    const theContainer = getByTestId('menuContainer');
    expect(theContainer).not.toHaveClass('open');

    triggerClickEvent(theButton);
    expect(theContainer).toHaveClass('open');

    //TODO: add back in once topics is not marked as experimental

    // const expandedTopicsContent = getByTestId('expandedContent');
    // expect(expandedTopicsContent).toBeInTheDocument();

    // Re find button as the new one is now inside the expanded menu
    theButton = queryByRole('button');

    triggerClickEvent(theButton);
    expect(theContainer).not.toHaveClass('open');

  });

  it('after the menu is open, closes the menu when the overlay is clicked', () => {
    const theOverlay = getByTestId('overlay');
    const theContainer = getByTestId('menuContainer');

    triggerClickEvent(theButton);
    expect(theContainer).toHaveClass('open');

    triggerClickEvent(theOverlay);
    expect(theContainer).not.toHaveClass('open');
  });

  it('contains the logo', () => {
    triggerClickEvent(theButton);
    expect(getByTestId('logo')).toBeDefined();
  });

  it('contains expected links when mobile menu is open', () => {
    triggerClickEvent(theButton);
    expect(getByTestId('datasets')).toBeDefined();
    expect(getByTestId('apiDocs')).toBeDefined();
    expect(getByTestId('about')).toBeDefined();
  });
});
