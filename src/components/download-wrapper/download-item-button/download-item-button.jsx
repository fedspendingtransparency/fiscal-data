import React, { useEffect, useState } from 'react';
import { downloadItemBtn, linkDisabled, dictionary, optionIcon } from './download-item-button.module.scss';
import Analytics from '../../../utils/analytics/analytics';
import { generateAnalyticsEvent } from '../../../layouts/dataset-detail/helper';
import globalConstants from '../../../helpers/constants';
import { CSVLink } from 'react-csv';
import { useRecoilValue } from 'recoil';
import { smallTableDownloadDataCSV, smallTableDownloadDataJSON, smallTableDownloadDataXML } from '../../../recoil/smallTableDownloadData';
import { constructDownloadFileName } from '../download-helpers';

export const downloadFileEventStr = globalConstants.gaEventLabels.downloadFile;
const DownloadItemButton = ({
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
  directCSVDownload,
  directJSONDownload,
  directXMLDownload,
}) => {
  const smallTableCSVData = useRecoilValue(smallTableDownloadDataCSV);
  const smallTableJSONData = useRecoilValue(smallTableDownloadDataJSON);
  const smallTableXMLData = useRecoilValue(smallTableDownloadDataXML);
  const [downloadName, setDownloadName] = useState(null);
  console.log(download);
  useEffect(() => {
    setDownloadName(constructDownloadFileName(dateRange, selectedTable));
  }, [dateRange, selectedTable]);

  const clickFunction = () => {
    if (handleClick) {
      handleClick();
    }

    if (download) {
      // Downloading a published report
      Analytics.event({
        category: 'Data Download',
        action: download,
      });
    } else {
      // Downloading raw data.
      generateAnalyticsEvent(downloadFileEventStr);
    }
  };

  const ButtonComponent = ({ children }) => {
    if (disabled) {
      return (
        <button disabled className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`} data-testid="download-button">
          {children}
        </button>
      );
    } else if (directCSVDownload && smallTableCSVData.length > 0) {
      return (
        <CSVLink
          data-testid="csv-download-button"
          className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
          data={smallTableCSVData}
          filename={downloadName + '.csv'}
        >
          {children}
        </CSVLink>
      );
    } else if (directJSONDownload && smallTableJSONData.length > 0) {
      return (
        <a
          className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
          data-testid="json-download-button"
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(smallTableJSONData)}`}
          download={downloadName + '.json'}
        >
          {children}
        </a>
      );
    } else if (directXMLDownload && smallTableXMLData.length > 0) {
      return (
        <a
          className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
          data-testid="xml-download-button"
          href={`data:application/xml;charset=utf-8,${encodeURIComponent(smallTableXMLData)}`}
          download={downloadName + '.xml'}
        >
          {children}
        </a>
      );
    } else {
      return (
        <a
          className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
          href={href}
          download={download}
          target="_blank"
          rel="noreferrer noopener"
          onClick={clickFunction}
          data-testid="download-button"
        >
          {children}
        </a>
      );
    }
  };

  return (
    <div>
      {asyncAction ? (
        <button className={dictionary} onClick={asyncAction} disabled={disabled}>
          <span className="labelText">{label} </span>
          {fileSize && <span className="fileSize"> ({fileSize})</span>}
        </button>
      ) : (
        <ButtonComponent>
          <span className={optionIcon}>{icon}</span>
          <span className="labelText">{label} </span>
          {fileSize && <span className="fileSize"> ({fileSize})</span>}
        </ButtonComponent>
      )}
    </div>
  );
};
export default DownloadItemButton;
