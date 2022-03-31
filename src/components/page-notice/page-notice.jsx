import React, { useEffect, useState } from 'react';
import * as styles from './page-notice.module.scss';

/**
 *
 * @param children
 * @param warningLevel - 1 = basic
 * @returns {*}
 * @constructor
 */

const PageNotice = ({ children, warningLevel }) => {
  const [pageReady, setPageReady] = useState(false);
  let warningClass = '';
  if(warningLevel){
    if(warningLevel === 1){
      warningClass = styles.basicWarning;
    }
  }
  useEffect(() => setPageReady(true), []);
  return (
    <div
      className={`${styles.pageNotice} ${warningClass} ${(pageReady && !warningClass) ? styles.active : ''}`}
      data-testid="pageNoticeContent"
    >
      {children}
    </div>
  );
};
export default PageNotice;
