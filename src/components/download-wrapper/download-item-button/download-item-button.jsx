import React, { useEffect, useState } from 'react';
import { downloadItemBtn, linkDisabled, dictionary, optionIcon } from './download-item-button.module.scss';
import Analytics from '../../../utils/analytics/analytics';
import { generateAnalyticsEvent } from '../../../layouts/dataset-detail/helper';
import globalConstants from '../../../helpers/constants';
import { CSVLink } from 'react-csv';
import { useRecoilValue } from 'recoil';
import { smallTableDownloadDataCSV, smallTableDownloadDataJSON, smallTableDownloadDataXML } from '../../../recoil/smallTableDownloadData';
import { format } from 'date-fns';

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

  useEffect(() => {
    if (dateRange?.from && dateRange?.to && selectedTable?.downloadName) {
      const from = format(dateRange?.from, 'yyyyMMdd');
      const to = format(dateRange?.to, 'yyyyMMdd');
      setDownloadName(selectedTable?.downloadName + '_' + from + '_' + to);
    }
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
    switch (true) {
      case disabled:
        return (
          <button disabled className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`} data-testid="download-button">
            {children}
          </button>
        );
      case directCSVDownload:
        return (
          <CSVLink className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`} data={smallTableCSVData} filename={downloadName + '.csv'}>
            {children}
          </CSVLink>
        );
      case directJSONDownload:
        return (
          <a
            className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
            data-testid="download-button"
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(smallTableJSONData)}`}
            download={downloadName + '.json'}
          >
            {children}
          </a>
        );
      case directXMLDownload:
        return (
          <a
            className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
            data-testid="download-button"
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(smallTableXMLData)}`}
            download={downloadName + '.xml'}
          >
            {children}
          </a>
        );
      default:
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
