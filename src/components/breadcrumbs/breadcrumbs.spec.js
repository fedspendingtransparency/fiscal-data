import React from 'react';
import renderer from 'react-test-renderer';
import BreadCrumbs from './breadcrumbs';
import { Link } from 'gatsby';
import { container } from './breadcrumbs.module.scss';

describe('BreadCrumbs', () => {
  let component = renderer.create();
  let instance;

  /*
   * The format of this array is to have the current page in index[0], the parent to the current
   * page in index[1], the parent of that page (and so on) to exist in each successive index.
   */
  const linksArr = [
    {
      name: 'Current Page',
      // while provided, this is ignored as we don't present a link for the current page.
      link: '/parent/child',
    },
    {
      name: 'Parent Page',
      link: '/parent',
    },
    {
      name: 'Home',
      link: '/',
    },
  ];

  beforeEach(() => {
    renderer.act(() => {
      component = renderer.create(<BreadCrumbs links={linksArr} />);
    });
    instance = component.root;
  });

  it('loads the section successfully even if no props are sent in', () => {
    renderer.act(() => {
      component = renderer.create(<BreadCrumbs />);
    });
    instance = component.root;

    const breadCrumbs = instance.findByType(BreadCrumbs);
    const containerDiv = instance.findByProps({ className: container });

    expect(breadCrumbs.props.links).toBeFalsy();
    expect(breadCrumbs).toBeTruthy();
    expect(containerDiv.children.length).toBe(0);
  });

  it('does not error out even if wrong param type is sent in for links prop', () => {
    const falsyTypes = [1, 0, true, false, 'wrong', undefined, null, {}];

    for (let i = falsyTypes.length; i--; ) {
      renderer.act(() => {
        component = renderer.create(<BreadCrumbs links={falsyTypes[i]} />);
      });
      instance = component.root;

      const breadCrumbs = instance.findByType(BreadCrumbs);
      const containerDiv = instance.findByProps({ className: container });

      expect(breadCrumbs).toBeTruthy();
      expect(containerDiv.children.length).toBe(0);
    }
  });

  it('accepts an array of objects detailing the display name and route for each breadcrumb', () => {
    const breadCrumbs = instance.findByType(BreadCrumbs);
    expect(breadCrumbs.props.links).toBe(linksArr);
  });

  it('creates breadcrumb links for the parent page(s)', () => {
    const pageLinks = instance.findAllByType(Link);
    expect(pageLinks.length).toBe(2);

    let parentLinksFound = true;
    for (let i = pageLinks.length; i--; ) {
      const pageLinkName = pageLinks[i].props.children;
      switch (pageLinkName) {
        case 'Parent Page':
        case 'Home':
          const to = pageLinks[i].props.to;
          if (pageLinkName === 'Parent Page') {
            expect(to).toBe('/parent');
          }
          if (pageLinkName === 'Home') {
            expect(to).toBe('/');
          }
          continue;
        default:
          parentLinksFound = false;
          break;
      }
    }

    expect(parentLinksFound).toBe(true);
  });

  it('displays the current page name as plain text within the breadcrumbs', () => {
    const currentPage = instance.findByProps({ 'data-test-id': 'breadCrumbCurrentPage' });
    expect(currentPage.children[0]).toBe(linksArr[0].name);
    expect(currentPage.children[0].type).not.toBe(Link);
  });
});
