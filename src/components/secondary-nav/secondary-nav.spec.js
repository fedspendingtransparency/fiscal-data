import React from 'react';
import { act, fireEvent, render } from "@testing-library/react";
import { scrollOptions, SecondaryNav } from "./secondary-nav";
import { animateScroll } from 'react-scroll';
import * as addressPathFunctions from '../../helpers/address-bar/address-bar';
import Analytics from "../../utils/analytics/analytics";

jest.mock('./variables.module.scss', (content) => ({
  ...content,
  breakpointLg: 992
}));

describe('Secondary Nav', () => {
  const sections = [
    {
      id: 'section-0',
      index: 0,
      title: 'section 0',
      headingTitle: 'section 0 heading'
    },
    {
      id: 'section-1',
      index: 1,
      title: 'section 1',
      headingTitle: 'section 1 heading'
    },
    {
      id: 'section-2',
      index: 2,
      title: 'section 2',
      headingTitle: 'section 2 heading'
    },
    {
      id: 'section-3',
      index: 3,
      title: 'section 3',
      headingTitle: 'section 3 heading'
    },
    {
      id: 'section-4',
      index: 4,
      title: 'section 4',
      headingTitle: 'section 4 heading'
    },
  ];
  const comingSoonSections = [
    {
      id: 'section-4',
      index: 4,
      title: 'section 4',
      comingSoon: true,
      headingTitle: 'section 4 heading'
    },
  ];
  const largeWidth = 1000;
  const smallWidth = 375;
  const childContent = 'child content';
  const hoverClass = 'hoverClass';

  const animateScrollToSpy = jest.spyOn(animateScroll, 'scrollTo');
  const animateScrollToTopSpy = jest.spyOn(animateScroll, 'scrollToTop');
  const addressPathMock = jest.spyOn(addressPathFunctions, 'updateAddressPath')

  afterEach(() => {
    animateScrollToSpy.mockClear();
    animateScrollToTopSpy.mockClear();
  })

  it('renders a link for each section and the content it wraps', () => {
    const { getByText } = render(
      <SecondaryNav
        sections={sections}
        width={largeWidth}
      >
        <div id={sections[0].id}>{childContent}</div>
      </SecondaryNav>
    );

    sections.forEach((_, i) => {
      expect(getByText(sections[i].title)).toBeInTheDocument();
      expect(getByText(childContent)).toBeInTheDocument();
    })
  });

  it('initially shows the page content but not the table of contents on mobile', () => {
    const { queryByText, getByText } = render(
      <SecondaryNav
        sections={sections}
        width={smallWidth}
      >
        <div id={sections[0].id}>{childContent}</div>
      </SecondaryNav>
    );

    expect(queryByText(sections[0].title)).not.toBeInTheDocument();
    expect(getByText(childContent)).toBeInTheDocument();
  });

  it('hides the page content when the table of contents is open on mobile', () => {
    const { getByRole, getByText, container } = render(
      <SecondaryNav
        sections={sections}
        width={smallWidth}
      >
        <div id={sections[0].id}>{childContent}</div>
      </SecondaryNav>
    );

    const button = getByRole('button');
    act(() => {
      button.click();
    });

    expect(getByText(sections[0].title)).toBeInTheDocument();
    // the page content is still on the document, but it is hidden using a CSS class
    expect(container.querySelector('.hidden')).toBeInTheDocument();
  });

  it(`sets a hover style on a link's container when hovered and
  removes it when not hovered`, () => {
    const { getByText } = render(
      <SecondaryNav
        sections={sections}
        width={largeWidth}
        hoverClass={hoverClass}
      >
        <div id={sections[0].id}>{childContent}</div>
      </SecondaryNav>
    );

    const link = getByText(sections[0].title).parentElement;

    fireEvent.mouseOver(link);
    expect(link.className.includes(hoverClass)).toBeTruthy();

    fireEvent.mouseOut(link);
    expect(link.className.includes(hoverClass)).toBeFalsy();
  });

  it('updates the address path when a link is clicked on', () => {
    const { getByText } = render(
      <SecondaryNav
        sections={sections}
        width={largeWidth}
        hoverClass={hoverClass}
      >
        <div id={sections[0].id}>{childContent}</div>
      </SecondaryNav>
    );

    const link = getByText(sections[0].title);
    fireEvent.click(link);
    expect(addressPathMock).toHaveBeenCalledWith(sections[0].id, window.location)
  })

  it('scrolls to the top of the page for TOC button when no TOC target is present', () => {

    const { getByRole } = render(
      <SecondaryNav
        sections={sections}
        width={smallWidth}
      >
        <div id={sections[0].id}>{childContent}</div>
      </SecondaryNav>
    );
    const button = getByRole('button');

    // Click to open TOC
    act(() => {
      button.click();
    });
    expect(animateScrollToTopSpy).toHaveBeenCalledWith(scrollOptions);

    // Click again to close TOC
    act(() => {
      button.click();
    });
    expect(animateScrollToSpy).toHaveBeenCalledWith(0, scrollOptions);
  });

  it('does not scroll to top for TOC button when offset is specified', () => {

    const { getByRole } = render(
      <SecondaryNav
        sections={sections}
        width={smallWidth}
        tocScrollOffset={-100}
      >
        <div id={sections[0].id}>{childContent}</div>
      </SecondaryNav>
    );
    const button = getByRole('button');

    // Click to open TOC
    act(() => {
      button.click();
    });

    // doesn't scroll to top when an offset is specified
    expect(animateScrollToTopSpy).not.toHaveBeenCalled();
  });

  it('calls the appropriate analytics event when links are clicked on', () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByText } = render(
      <SecondaryNav
        sections={sections}
        width={largeWidth}
        hoverClass={hoverClass}
        analytics={true}
        analyticsCategory={'Category'}
        analyticsPageLabel={'Label'}
      >
        {sections.map((section) =>
          <div id={section.id} key={section.id} />
        )}
      </SecondaryNav>);

    sections.forEach(section => {
      const button = getByText(section.title);
      button.click();
      expect(spy).toHaveBeenCalledWith({
        category: 'Category',
        action: `Left Nav Click`,
        label: `Label - ${section.title}`
      });
      spy.mockClear();
    })
  });

  it('renders the coming soon flag on sections with the comingSoon ' +
    'set to true', () => {
    const { getByText } = render(
      <SecondaryNav
        sections={comingSoonSections}
        width={largeWidth}
        hoverClass={hoverClass}
      >
        <div id={sections[0].id}>{childContent}</div>
      </SecondaryNav>
    );
    expect(getByText('COMING SOON!').toBeInTheDocument);
  });

  it('does not render a coming soon flag when no sections have comingSoon set to true', () => {
    const { queryByText } = render(
      <SecondaryNav
        sections={sections}
        width={largeWidth}
        hoverClass={hoverClass}
      >
        <div id={sections[0].id}>{childContent}</div>
      </SecondaryNav>
    );
    expect(queryByText('COMING SOON!')).toBeNull();
  });
});
