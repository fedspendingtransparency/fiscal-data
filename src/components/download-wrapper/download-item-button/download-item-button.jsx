import React, { useEffect, useState } from 'react';
import { downloadItemBtn, linkDisabled, dictionary, optionIcon } from './download-item-button.module.scss';
import Analytics from '../../../utils/analytics/analytics';
import { generateAnalyticsEvent } from '../../../layouts/dataset-detail/helper';
import globalConstants from '../../../helpers/constants';
import { CSVLink } from 'react-csv';
import { useRecoilValue, useRecoilState } from 'recoil';
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
  selectedFileType,
  dapGaEventLabel,
}) => {
  const smallTableCSVData = useRecoilValue(smallTableDownloadDataCSV);
  const smallTableJSONData = useRecoilValue(smallTableDownloadDataJSON);
  const smallTableXMLData = useRecoilValue(smallTableDownloadDataXML);
  const [csvDataWithTimestamp, setCSVDataWithTimestamp] = useState(null);
  const [downloadName, setDownloadName] = useState(null);
  useEffect(() => {
    setDownloadName(constructDownloadFileName(dateRange, selectedTable));
  }, [dateRange, selectedTable]);

  const clickFunction = directDownload => {
    if (directDownload) {
      const currentDateTime = Date.now().toString();
      const newDownloadData = structuredClone(smallTableCSVData);
      newDownloadData[0].push(currentDateTime);
      setCSVDataWithTimestamp(newDownloadData);
      console.log(newDownloadData);
    }

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

  const ButtonComponent = ({ children }) => {
    if (disabled) {
      return (
        <button disabled className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`} data-testid="download-button">
          {children}
        </button>
      );
    } else if (selectedFileType === 'csv' && smallTableCSVData.length > 0) {
      return (
        <CSVLink
          data-testid="csv-download-button"
          className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
          data={csvDataWithTimestamp ? csvDataWithTimestamp : smallTableCSVData}
          filename={downloadName + '.csv'}
          onClick={() => clickFunction(true)}
        >
          {children}
        </CSVLink>
      );
    } else if (selectedFileType === 'json' && smallTableJSONData.length > 0) {
      return (
        <a
          className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
          data-testid="json-download-button"
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(smallTableJSONData)}`}
          download={downloadName + '.json'}
          onClick={() => clickFunction(true)}
        >
          {children}
        </a>
      );
    } else if (selectedFileType === 'xml' && smallTableXMLData.length > 0) {
      return (
        <a
          className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
          data-testid="xml-download-button"
          href={`data:application/xml;charset=utf-8,${encodeURIComponent(smallTableXMLData)}`}
          download={downloadName + '.xml'}
          onClick={() => clickFunction(true)}
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
          onClick={() => clickFunction(false)}
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
