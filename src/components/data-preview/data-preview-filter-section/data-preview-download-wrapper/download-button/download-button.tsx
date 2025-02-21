import React, { FunctionComponent, useEffect, useState } from 'react';

import globalConstants from '../../../../../helpers/constants';
import { useRecoilValue } from 'recoil';
import { smallTableDownloadDataCSV, smallTableDownloadDataJSON, smallTableDownloadDataXML } from '../../../../../recoil/smallTableDownloadData';
import { constructDownloadFileName } from '../../../../download-wrapper/download-helpers';
import Analytics from '../../../../../utils/analytics/analytics';
import { generateAnalyticsEvent } from '../../../../../layouts/dataset-detail/helper';
import { dictionary, downloadItemBtn, linkDisabled } from './download-dialog.module.scss';
import CsvDirectDownload from './csv-direct-download/csv-direct-download';
import DirectDownload from './direct-download/direct-download';

export const downloadFileEventStr = globalConstants.gaEventLabels.downloadFile;
const DownloadItemButton: FunctionComponent = ({
  label,
  icon,
  fileSize,
  asyncAction,
  handleClick,
  href,
  download,
  disabled,
  selectedTable,
  dateRange,
  selectedFileType,
  dapGaEventLabel,
  downloadTimestamp,
  smallTableDownloadData,
}) => {
  const [downloadName, setDownloadName] = useState(null);

  useEffect(() => {
    setDownloadName(constructDownloadFileName(dateRange, selectedTable));
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
    } else {
      // Downloading raw data.
      generateAnalyticsEvent(dapGaEventLabel, downloadFileEventStr);
    }
  };

  const buttonContents = (
    <>
      <span className="labelText">{label} </span>
      {fileSize && <span className="fileSize"> {fileSize}</span>}
    </>
  );
  const smallTableDownload = type => !disabled && selectedFileType === type && smallTableDownloadData.length > 0;

  return (
    <>
      {disabled && (
        <button disabled className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`} data-testid="download-button">
          {buttonContents}
        </button>
      )}
      {smallTableDownload('csv') && (
        <CsvDirectDownload
          downloadTimestamp={downloadTimestamp}
          downloadData={smallTableDownloadData}
          filename={downloadName + '.csv'}
          handleClick={() => clickFunction(true)}
        >
          {buttonContents}
        </CsvDirectDownload>
      )}
      {(smallTableDownload('json') || smallTableDownload('xml')) && (
        <DirectDownload
          fileType={selectedFileType}
          downloadData={smallTableDownloadData}
          handleClick={() => clickFunction(true)}
          downloadName={downloadName}
        >
          {buttonContents}
        </DirectDownload>
      )}
      {true && (
        <a
          className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
          href={href}
          download={download}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => clickFunction(false)}
          data-testid="download-button"
        >
          {buttonContents}
        </a>
      )}
    </>
  );
};
export default DownloadItemButton;
