import React, { FunctionComponent } from 'react';

import { container, item, border } from './download-dialog.module.scss';

interface IDownloadDialogProps {
  downloadSizeInfo: Record<string, any>;
}

export const DownloadDialog: FunctionComponent<IDownloadDialogProps> = ({ downloadSizeInfo }: IDownloadDialogProps) => {
  return (
    <div className={container}>
      <div className={item} role={'button'}>
        <span>CSV</span>
        <span>{downloadSizeInfo.csv}</span>
      </div>
      <div className={item} role={'button'}>
        <span>JSON</span>
        <span>{downloadSizeInfo.json}</span>
      </div>
      <div className={item} role={'button'}>
        <span>XML</span>
        <span>{downloadSizeInfo.xml}</span>
      </div>
      <div className={border} />
      <div className={item} role={'button'}>
        <span>Data Dictionary</span>
        <span>{downloadSizeInfo.dataDict}</span>
      </div>
    </div>
  );
};
