import {
  linkContainer,
  mainContainer,
  navContainer,
  navigableContent,
} from '../../data-preview/data-preview-mobile-dialog/data-preview-mobile-dialog.module.scss';
import React from 'react';

const DataPreviewMobileDialog = () => {
  const shouldTocShow = true;
  const shouldContentShow = false;

  return (
    <div className={mainContainer}>
      <div className={`${navContainer} secondaryNavContainer`}>
        {/*{!scrollToTop && <ScrollTarget name="table-of-contents" />}*/}
        {shouldTocShow}
        {shouldTocShow && (
          <div key={1}>
            <h1>test test</h1>
            <div
              role="presentation"
              // onMouseEnter={() => handleMouseEnter(1)}
              // onMouseLeave={handleMouseLeave}
              className={`${linkContainer}`}
            ></div>
          </div>
        )}
      </div>
      <div className={`${navigableContent} ${shouldContentShow ? '' : 'hidden'}`}>TEST TEXT</div>
      {/*<TOCButton handleToggle={handleInteraction} state={tocIsOpen} />*/}
    </div>
  );
};
export default DataPreviewMobileDialog;
