import React, { useEffect, useState } from 'react';
import { basicWarning, pageNotice, active } from './page-notice.module.scss';

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
  if (warningLevel) {
    if (warningLevel === 1) {
      warningClass = basicWarning;
    }
  }
  useEffect(() => setPageReady(true), []);
  return (
    <div className={`${pageNotice} ${warningClass} ${pageReady && !warningClass ? active : ''}`} data-testid="pageNoticeContent">
      {children}
    </div>
  );
};
export default PageNotice;
