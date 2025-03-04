import React, { FunctionComponent } from 'react';
import { downloadItemBtn } from '../download-button.module.scss';

const DirectDownload: FunctionComponent = ({ fileType, downloadData, handleClick, downloadName, children }) => {
  const testId = fileType === 'json' ? 'json-download-button' : 'xml-download-button';
  const hrefDataType = fileType === 'json' ? 'text/plain' : 'application/xml';
  const filename = downloadName + (fileType === 'json' ? '.json' : '.xml');
  return (
    <a
      className={downloadItemBtn}
      data-testid={testId}
      href={`data:${hrefDataType};charset=utf-8,${encodeURIComponent(downloadData)}`}
      download={filename}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

export default DirectDownload;
