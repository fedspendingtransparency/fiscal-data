import React from 'react';
import renderer from 'react-test-renderer';
import DDNav from './dataset-detail-nav';
import {getByTestId} from "@testing-library/dom";
import {render} from "@testing-library/react";


jest.useFakeTimers();
describe('DDNav', () => {

  const datasetTitle = 'Dummy Dataset';
  const breakpoint = {
    desktop: 992,
    tablet: 600
  };

  it('writes out the expected title', () => {
    const { getByTestId } = render(<DDNav title={datasetTitle}/>)
    expect(getByTestId('DDNavTitle').title).toBe(datasetTitle);
  });

  it('creates desktop anchor tags within the menu', () => {
    const { getByTestId } = render(<DDNav/>)
    const menu = getByTestId('DDNavMenu');
    let links = menu.getElementsByTagName('a');
    links = Array.from(links);
    let desktopLink = null;

    expect(links.length).toBeGreaterThan(0);

    const filteredLinks =
      links.filter(link => link.outerHTML.toString().includes('DDNavDesktopLink'));

    desktopLink = filteredLinks[0];

    expect(desktopLink).not.toBeNull();

  });

  it('creates mobile/tablet anchor tags within the menu when at tablet/mobile size', async() => {
    renderer.act(() => {
      global.window.innerWidth = breakpoint.tablet;
      global.dispatchEvent(new Event('resize'));
      jest.runAllTimers();
    });

    const { getByTestId } = render(<DDNav title={datasetTitle}/>)

    const menu = getByTestId('DDNavMenu');
    let links = menu.getElementsByTagName('a');
    links = Array.from(links);
    let mobileLink = null;

    expect(links.length).toBeGreaterThan(0);


    const filteredLinks =
      links.filter(link => link.outerHTML.toString().includes('DDNavMobileLink'));

    mobileLink = filteredLinks[0];

    expect(mobileLink).not.toBeNull();

    // Additional assurance on the mobile links
    const icon = mobileLink.getElementsByTagName('svg');
    expect(icon.length).toBeGreaterThan(0);
  });
});
