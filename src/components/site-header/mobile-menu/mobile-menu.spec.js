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
  afterEach(() => {
    cleanup();
  });

  it('contains an overlay div', () => {
    const { getByTestId } = render(<MobileMenu />);
    expect(getByTestId('overlay')).toBeDefined();
  });

  it('applies an open class to the menuContainer when the menu button is clicked', () => {
    const { getByTestId, getAllByTestId } = render(<MobileMenu />);
    const theContainer = getByTestId('menuContainer');
    let menuButton = getByTestId('button');

    expect(theContainer).not.toHaveClass('open');

    triggerClickEvent(menuButton);
    expect(theContainer).toHaveClass('open');


    const expandedTopicsContent = getAllByTestId('expandedContent');
    expect(expandedTopicsContent[0]).toBeInTheDocument();

    // Re find button as the new one is now inside the expanded menu
    menuButton = getByTestId('button');

    triggerClickEvent(menuButton);
    expect(theContainer).not.toHaveClass('open');

  });

  it('after the menu is open, closes the menu when the overlay is clicked', () => {
    const { getByTestId } = render(<MobileMenu />);

    const theOverlay = getByTestId('overlay');
    const theContainer = getByTestId('menuContainer');
    const menuButton = getByTestId('button');


    triggerClickEvent(menuButton);
    expect(theContainer).toHaveClass('open');

    triggerClickEvent(theOverlay);
    expect(theContainer).not.toHaveClass('open');
  });

  it('contains the logo', () => {
    const { getByTestId } = render(<MobileMenu />);
    const menuButton = getByTestId('button');
    triggerClickEvent(menuButton);
    expect(getByTestId('logo')).toBeDefined();
  });

  it('contains expected links when mobile menu is open', () => {
    const { getByText, getByTestId } = render(<MobileMenu />);
    const menuButton = getByTestId('button');
    triggerClickEvent(menuButton);
    expect(getByText('Dataset Search')).toBeDefined();
    expect(getByText('About Us')).toBeDefined();
    expect(getByText('Glossary')).toBeDefined();
    expect(getByText('API Documentation')).toBeDefined();
    expect(getByText('Release Calendar')).toBeDefined();
    expect(getByText('Currency Exchange Rates Converter')).toBeDefined();
    expect(getByText('Debt')).toBeDefined();
    expect(getByText('Deficit')).toBeDefined();
    expect(getByText('Spending')).toBeDefined();
    expect(getByText('Revenue')).toBeDefined();
    expect(getByText('Overview')).toBeDefined();
  });

  it('contains expected section headers', () => {
    const { getByText, getByTestId } = render(<MobileMenu />);
    const menuButton = getByTestId('button');
    triggerClickEvent(menuButton);
    expect(getByText('Topics')).toBeDefined();
    expect(getByText('Tools')).toBeDefined();
    expect(getByText('Resources')).toBeDefined();

  });

  it('only opens topics dropdown by default', () => {
    const { getByText, getByTestId } = render(<MobileMenu />);
    const menuButton = getByTestId('button');
    triggerClickEvent(menuButton);
    expect(getByText('Topics')).toHaveClass('headerExpanded')
    expect(getByText('Tools')).not.toHaveClass('headerExpanded')
    expect(getByText('Resources')).not.toHaveClass('headerExpanded')
  });
});
