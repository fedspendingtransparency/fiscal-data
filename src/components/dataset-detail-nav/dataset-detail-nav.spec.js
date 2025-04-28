import React from 'react';
import DDNav from './dataset-detail-nav';
import { fireEvent, render, waitFor } from '@testing-library/react';
import * as Scroll from 'react-scroll';
import { activeMenu, desktopLinks } from './dataset-detail-nav.module.scss';

jest.useFakeTimers();
describe('DDNav', () => {
  it('creates desktop anchor tags within the menu', () => {
    const { getByTestId } = render(<DDNav />);
    const menu = getByTestId('DDNavMenu');
    let links = menu.getElementsByTagName('a');
    links = Array.from(links);
    let desktopLink = null;

    expect(links.length).toBeGreaterThan(0);

    const filteredLinks = links.filter(link => link.outerHTML.toString().includes('DDNavDesktopLink'));

    desktopLink = filteredLinks[0];

    expect(desktopLink).not.toBeNull();
  });

  it(`sets a hover style on a link's container when hovered and
  removes it when not hovered`, () => {
    const { getByText } = render(<DDNav />);

    const link = getByText('Introduction');

    fireEvent.mouseOver(link);
    expect(link.className.includes('hover')).toBeTruthy();

    fireEvent.mouseOut(link);
    expect(link.className.includes('hover')).toBeFalsy();
  });

  it(`sets the same style as on hover on a link's container when focused and
  removes it when not focused`, () => {
    const { getByText } = render(<DDNav />);

    const link = getByText('Introduction');

    fireEvent.focusIn(link);
    expect(link.className.includes('hover')).toBeTruthy();

    fireEvent.focusOut(link);
    expect(link.className.includes('hover')).toBeFalsy();
  });

  it(`scrolls to page section on enter`, () => {
    const spy = jest.spyOn(Scroll.scroller, 'scrollTo');
    const { getByText } = render(<DDNav />);

    const link = getByText('Introduction');

    fireEvent.keyDown(link, { key: 'Enter' });
    expect(spy).toHaveBeenCalledWith('introduction', { delay: 200, duration: 600, smooth: true, spy: true, offset: -112 });
    spy.mockClear();
    fireEvent.keyDown(link, { key: 'Tab' });
    expect(spy).not.toHaveBeenCalled();
  });

  it(`scrolls to page section on click`, () => {
    const spy = jest.spyOn(Scroll.scroller, 'scrollTo');
    const { getByText } = render(<DDNav />);

    const link = getByText('Introduction');

    fireEvent.click(link);
    expect(spy).toHaveBeenCalledWith('introduction', { delay: 200, duration: 600, smooth: true, spy: true, offset: -112 });
    spy.mockClear();
  });

  it(`sets active link correctly`, () => {
    const { getByTestId } = render(<DDNav />);
    const link = getByTestId('DDNavDesktopLink0');
    fireEvent.click(link);
    expect(link).toHaveClass(desktopLinks);
  });

  const mockNavRef = {
    current: {
      querySelector: jest.fn().mockImplementation(selector => {
        if (selector === `.${desktopLinks}.${activeMenu}`) {
          return { offsetLeft: 100 };
        }
        return null;
      }),
      scrollLeft: 100,
    },
  };

  it('updates scroll bar position when active section changes', async () => {
    const { getByTestId } = render(<DDNav />);
    const link = getByTestId('DDNavDesktopLink0');
    fireEvent.click(link);
    await waitFor(() => {
      expect(mockNavRef.current.scrollLeft).toBe(100);
    });
    mockNavRef.current = null;
  });

  it(`updates active section on natural scroll`, () => {
    const { getByText } = render(<DDNav />);

    const introductionLink = getByText('Introduction');
    fireEvent.scroll(introductionLink);
    expect(introductionLink).toHaveClass(desktopLinks);
  });

  it(`Does not updates active section on click-initiated scroll`, () => {
    const { getByText } = render(<DDNav />);

    const introductionLink = getByText('Introduction');
    fireEvent.click(introductionLink);
    expect(introductionLink).toHaveClass(desktopLinks);
  });

  it('hides api specific tabs when hideRawDataTable is true', () => {
    const { getByText, queryByText } = render(<DDNav hideRawDataTable={true} />);
    expect(getByText('Introduction')).toBeInTheDocument();
    expect(queryByText('Data Preview')).not.toBeInTheDocument();
    expect(getByText('Dataset Properties')).toBeInTheDocument();
    expect(queryByText('API Quick Guide')).not.toBeInTheDocument();
  });
});
