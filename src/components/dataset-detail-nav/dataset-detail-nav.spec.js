import React from 'react';
import DDNav from './dataset-detail-nav';
import { fireEvent, render } from '@testing-library/react';
import * as Scroll from 'react-scroll';

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
    console.log(link.props);
    expect(link.className.includes('hover')).toBeTruthy();

    fireEvent.mouseOut(link);
    expect(link.className.includes('hover')).toBeFalsy();
  });

  it(`scrolls to page section on enter`, () => {
    const spy = jest.spyOn(Scroll.scroller, 'scrollTo');
    const { getByText } = render(<DDNav />);

    const link = getByText('Introduction');

    fireEvent.keyDown(link, { key: 'Enter' });
    expect(spy).toHaveBeenCalledWith('introduction', { delay: 200, duration: 600, smooth: true, spy: true });
    spy.mockClear();
    fireEvent.keyDown(link, { key: 'Tab' });
    expect(spy).not.toHaveBeenCalled();
  });

  it(`scrolls to page section on click`, () => {
    const spy = jest.spyOn(Scroll.scroller, 'scrollTo');
    const { getByText } = render(<DDNav />);

    const link = getByText('Introduction');

    fireEvent.click(link);
    expect(spy).toHaveBeenCalledWith('introduction', { delay: 200, duration: 600, smooth: true, spy: true });
    spy.mockClear();
  });
});
