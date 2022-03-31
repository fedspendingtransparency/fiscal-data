import React from 'react';
import renderer from 'react-test-renderer';
import {SmoothScroll} from './smooth-scroll';

describe('smooth scroll', () => {

  const scrollInstance = new SmoothScroll();
  const globalScrollTo = global.window.scrollTo;

  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <>
        <div id="scrollHere" />
        <a href="#scrollHere" onClick={scrollInstance.onLinkClick}>
          Jump to scroll section
        </a>
      </>
    )
  });
  const instance = component.root;

  const mockClickEvent = {
    srcElement: {
      nodeName: 'A',
      getAttribute: () => '#scrollHere',
    },
    preventDefault: () => {}
  };

  document.querySelector = jest.fn(() => {
    return {
      getBoundingClientRect: jest.fn(() => {
        return {top: 0}
      })
    }
  });

  beforeAll(() => {
    global.window.scrollTo = jest.fn();
  });

  afterAll(() => {
    global.window.scrollTo = globalScrollTo;
  });

  it('expects scrollTo within onLinkClick to have been called on anchor that ' +
    'attaches the SmoothScroll handlers', async () => {
    const link = instance.findByType('a');
    link.addEventListener = jest.fn();

    scrollInstance.attachClickHandlers(link);

    // In the jsx, this is where the click event of 'onLinkClick' is attached to the anchor
    expect(link.addEventListener).toHaveBeenCalled();

    // onLinkClick does not run until the anchor link is clicked
    expect(global.window.scrollTo).not.toHaveBeenCalled();

    renderer.act(() => {
      link.props.onClick(mockClickEvent);
    });

    // This verifies that onLinkClick has been executed all the way through
    expect(global.window.scrollTo).toHaveBeenCalled();
  })
});
