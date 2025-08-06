import React from 'react';
import BreadCrumbs from './breadcrumbs';
import { render } from '@testing-library/react';

describe('BreadCrumbs', () => {
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

  it('loads the section successfully even if no props are sent in', () => {
    const instance = render(<BreadCrumbs />);
    expect(instance).toBeTruthy();
    expect(instance.innerHTML).toBeFalsy();
  });

  it('does not error out even if wrong param type is sent in for links prop', () => {
    const falsyTypes = [1, 0, true, false, 'wrong', undefined, null, {}];

    for (let i = falsyTypes.length; i--; ) {
      const instance = render(<BreadCrumbs links={falsyTypes[i]} />);
      expect(instance).toBeTruthy();
      expect(instance.innerHTML).toBeFalsy();
    }
  });

  it('accepts an array of objects detailing the display name and route for each breadcrumb', () => {
    const { getAllByRole } = render(<BreadCrumbs links={linksArr} />);
    const breadCrumbs = getAllByRole('link');
    expect(breadCrumbs[0]).toHaveTextContent(linksArr[2].name);
    expect(breadCrumbs[1]).toHaveTextContent(linksArr[1].name);
  });

  it('creates breadcrumb links for the parent page(s)', () => {
    const { getAllByRole } = render(<BreadCrumbs links={linksArr} />);
    const pageLinks = getAllByRole('link');
    expect(pageLinks.length).toBe(2);

    let parentLinksFound = true;
    for (let i = pageLinks.length; i--; ) {
      const pageLinkName = pageLinks[i].innerHTML;
      switch (pageLinkName) {
        case 'Parent Page':
        case 'Home':
          if (pageLinkName === 'Parent Page') {
            expect(pageLinks[i]).toHaveAttribute('href', '/parent');
          }
          if (pageLinkName === 'Home') {
            expect(pageLinks[i]).toHaveAttribute('href', '/');
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
    const { queryByRole, getByText } = render(<BreadCrumbs links={linksArr} />);
    expect(queryByRole('link', { name: linksArr[0].name })).not.toBeInTheDocument();
    expect(getByText(linksArr[0].name)).toBeInTheDocument();
  });
});
