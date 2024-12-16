import React, { FunctionComponent } from 'react';

import { container, item, border } from './download-dialog.module.scss';

export const DownloadDialog: FunctionComponent = () => {
  return (
    <div className={container}>
      <div className={item} role={'button'} tabIndex={0}>
        <span>CSV</span>
        <span>84 KB</span>
      </div>
      <div className={item} role={'button'} tabIndex={0}>
        <span>JSON</span>
        <span>84 KB</span>
      </div>
      <div className={item} role={'button'} tabIndex={0}>
        <span>XML</span>
        <span>84 KB</span>
      </div>
      <div className={border} />
      <div className={item} role={'button'} tabIndex={0}>
        <span>Data Dictionary</span>
        <span>24 KB</span>
      </div>
    </div>
  );
};
