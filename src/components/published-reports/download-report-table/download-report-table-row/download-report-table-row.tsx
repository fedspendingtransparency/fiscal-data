import React, { FunctionComponent, KeyboardEvent } from 'react';
import {
  fileDescription,
  downloadIcon,
  center,
  downloadFileContainer,
  fileDate,
  downloadInfo,
  downloadName,
  downloadButtonName,
  startName,
} from './download-report-table-row.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
import pdf from '../../../../../static/images/file-type-icons/file_type_pdf_icon.svg';
import xls from '../../../../../static/images/file-type-icons/file_type_xls_icon.svg';

const DownloadReportTableRow: FunctionComponent<{ fileName: string; mobileView?: boolean }> = ({ fileName, mobileView }) => {
  // grab the file extension
  const regex = /(?<=\.).+/;
  let fileType = fileName.match(regex)?.toString();

  const splitName = (name, index) => {
    const start = name.substring(0, index);
    const end = name.substring(index);
    return { start: start, end: end };
  };
  const displayName = splitName(fileName, fileName.length - 8);

  const fileTypeImage = () => {
    switch (fileType) {
      case 'pdf':
        return pdf;
      default:
        // making the fileType have a default value if null for alt image purposes
        fileType = 'xls';
        return xls;
    }
  };

  const downloadFile = (e?: KeyboardEvent) => {
    if (e?.key && e.key !== 'Enter') {
      return;
    }
    return;
  };

  const fileImage: string = fileTypeImage();

  return (
    <tr className={fileDescription} data-testid="file-download-row">
      {!mobileView && (
        <>
          <td>
            <div className={downloadFileContainer}>
              <img src={fileImage} alt={`${fileType} icon`} />
              <div className={downloadName}>
                <span className={startName}>{displayName.start}</span>
                <span>{displayName.end}</span>
              </div>
            </div>
          </td>
          <td>February 01, 2024</td>
          <td>2KB</td>
        </>
      )}
      {mobileView && (
        <td>
          <div className={downloadFileContainer}>
            <img src={fileImage} alt={`${fileType} icon`} />
            <div>
              <div className={downloadName}>
                <span className={startName}>{displayName.start}</span>
                <span>{displayName.end}</span>
              </div>
              <div className={downloadInfo}>
                <div className={fileDate}>February 01, 2024</div>
                <div>2KB</div>
              </div>
            </div>
          </div>
        </td>
      )}
      <td className={downloadIcon}>
        <div role="button" tabIndex={0} className={center} onClick={() => downloadFile()} onKeyDown={e => downloadFile(e)}>
          <FontAwesomeIcon icon={faCloudArrowDown} />
          <div className={downloadButtonName}>Download</div>
        </div>
      </td>
    </tr>
  );
};

export default DownloadReportTableRow;
