import React from 'react';
import DDNav from './dataset-detail-nav';
import { getByTestId } from '@testing-library/dom';
import { render } from '@testing-library/react';

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
});
