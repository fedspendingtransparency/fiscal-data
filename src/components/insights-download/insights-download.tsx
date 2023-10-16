import { faFileDownload } from '@fortawesome/free-solid-svg-icons/faFileDownload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { downloadContainer, downloadIcon, downloadButton } from './insights-download.module.scss';
import React from 'react';

type InsightsDownloadProps = {
  downloadLink: string;
  dataDate: string;
};

const InsightsDownload = ({ downloadLink, dataDate }: InsightsDownloadProps): JSX.Element => {
  return (
    <div className={downloadContainer} data-testid={'insights-download'}>
      <a href={downloadLink} className={downloadButton} data-testid={'download-button'} download>
        <div className={downloadIcon}>
          <FontAwesomeIcon icon={faFileDownload} title={'download'} />
        </div>
        Download the data (.CSV) as of {dataDate}
      </a>
    </div>
  );
};

export default InsightsDownload;
