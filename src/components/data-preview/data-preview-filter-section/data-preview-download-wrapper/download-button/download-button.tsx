import React, { FunctionComponent, useEffect, useState } from 'react';
import globalConstants from '../../../../../helpers/constants';
import { constructDownloadFileName } from '../../../../download-wrapper/download-helpers';
import Analytics from '../../../../../utils/analytics/analytics';
import { generateAnalyticsEvent } from '../../../../../layouts/dataset-detail/helper';
import { dictionary, downloadItemBtn, linkDisabled } from './download-button.module.scss';
import CsvDirectDownload from './csv-direct-download/csv-direct-download';
import DirectDownload from './direct-download/direct-download';

export const downloadFileEventStr = globalConstants.gaEventLabels.downloadFile;
const DownloadItemButton: FunctionComponent = ({
  label,
  fileSize,
  handleClick,
  href,
  download,
  disabled,
  selectedTable,
  dateRange,
  fileType,
  dapGaEventLabel,
  downloadTimestamp,
  gaDownloadCSVEvent,
  formatDownloadDate = true,
  smallTableDownloadData,
}) => {
  const [downloadName, setDownloadName] = useState(null);

  useEffect(() => {
    setDownloadName(constructDownloadFileName(dateRange, selectedTable, formatDownloadDate));
  }, [dateRange, selectedTable]);

  const clickFunction = directDownload => {
    if (handleClick && !directDownload) {
      handleClick();
    }

    if (download) {
      // Downloading a published report
      Analytics.event({
        category: 'Data Download',
        action: 'Published Report Download',
        label: download,
      });
    }
    if (gaDownloadCSVEvent) {
      gaDownloadCSVEvent();
    } else {
      // Downloading raw data.
      generateAnalyticsEvent(dapGaEventLabel, downloadFileEventStr);
    }
  };

  const smallTableDownload = type => fileType === type && smallTableDownloadData?.length > 0;

  const fileSizeValue =
    smallTableDownload('csv') || smallTableDownload('json') || smallTableDownload('xml') || fileType === 'data-dictionary' ? fileSize : null;

  const buttonContents = (
    <>
      <span className="labelText">{label} </span>
      {fileSizeValue && <span className="fileSize">{fileSizeValue}</span>}
    </>
  );

  const buttonComponent = children => {
    switch (true) {
      case disabled:
        return (
          <button disabled className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`} data-testid="download-button">
            {children}
          </button>
        );
      case smallTableDownload('csv'):
        return (
          <CsvDirectDownload
            downloadTimestamp={downloadTimestamp}
            downloadData={smallTableDownloadData}
            filename={downloadName}
            handleClick={() => clickFunction(true)}
          >
            {children}
          </CsvDirectDownload>
        );
      case smallTableDownload('json') || smallTableDownload('xml'):
        return (
          <DirectDownload
            fileType={fileType}
            downloadData={smallTableDownloadData}
            handleClick={() => clickFunction(true)}
            downloadName={downloadName}
          >
            {children}
          </DirectDownload>
        );
      case fileType === 'data-dictionary':
        return (
          <button className={dictionary} onClick={handleClick}>
            {children}
          </button>
        );
      default:
        return (
          <a
            className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
            href={href}
            download={download}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => clickFunction(false)}
            data-testid="download-button"
            aria-label={label + ' Download'}
          >
            {children}
          </a>
        );
    }
  };

  return <>{buttonComponent(buttonContents)}</>;
};
export default DownloadItemButton;
