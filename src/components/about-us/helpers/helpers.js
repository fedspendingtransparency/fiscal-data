/* istanbul ignore file */
import React from 'react';
import { sectionContainer } from '../../api-documentation/section-content/section-content.module.scss';
import { title, list, noBullets, lastChild } from '../../../pages/about-us/about-us.module.scss';

export const aboutUsComponents = {
  section: ({ children, sectionTitle, noList, ...props }) => (
    <section className={`${sectionTitle ? title : sectionContainer} ${noList === true ? '' : list}`} {...props}>
      {children}
    </section>
  ),
};

export const additionalContactsComponents = {
  ul: ({ children }) => <ul className={noBullets}>{children}</ul>,
};

export const subscribeComponents = {
  section: ({ children, ...props }) => (
    <section className={`${sectionContainer} ${lastChild}`} {...props}>
      {children}
    </section>
  ),
};

/*
 * The following are helpers for unit tests.
 */

export const ulTestId = 'ulTestId';

export const testMDX = {
  mdx: {
    body: (
      <ul data-testid={ulTestId}>
        <li>Dummy Item 1</li>
        <li>Dummy Item 2</li>
      </ul>
    ),
  },
};
