/* istanbul ignore file */
import React from "react";
import * as sectionStyles
  from "../../api-documentation/section-content/section-content.module.scss";
import * as styles from "../../../pages/about-us/about-us.module.scss";


export const aboutUsComponents = {
  section: ({children, sectionTitle, noList,  ...props}) => <section
    className={`${sectionTitle ? styles.title : sectionStyles.sectionContainer} ${noList === true ? '' : styles.list}`}
    {...props}
                                                            >{children}
                                                            </section>
};

export const additionalContactsComponents = {
  ul: ({children}) => <ul className={styles.noBullets}>{children}</ul>
};

export const subscribeComponents = {
  section: ({children,...props}) => <section
    className={`${sectionStyles.sectionContainer} ${styles.lastChild}`}
    {...props}
                                    >{children}
                                    </section>
};

/*
 * The following are helpers for unit tests.
 */

export const ulTestId = 'ulTestId';

export const testMDX = {
  mdx : {
    body : <ul data-testid={ulTestId}><li>Dummy Item 1</li><li>Dummy Item 2</li></ul>
  }
}
