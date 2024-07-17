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
  downloadItem,
} from './download-report-table-row.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
import pdf from '../../../../../static/images/file-type-icons/file_type_pdf_icon.svg';
import xls from '../../../../../static/images/file-type-icons/file_type_xls_icon.svg';

const DownloadReportTableRow: FunctionComponent<{ fileName: string; date; mobileView?: boolean }> = ({ fileName, date, mobileView }) => {
  // grab the file extension
  // const regex = /(?<=\.).+/;
  // let fileType = fileName.match(regex)?.toString();

  const splitName = (name, index) => {
    const start = name.substring(0, index);
    const end = name.substring(index);
    console.log(start, end);
    return { start: start, end: end };
  };
  const displayName = splitName(fileName, fileName.length - 8);

  const fileTypeImage = () => {
    if (fileName.includes('.pdf')) {
      return pdf;
    } else if (fileName.includes('.xls')) {
      return xls;
    }
    // switch (fileType) {
    //   case 'pdf':
    //     return pdf;
    //   default:
    //     // making the fileType have a default value if null for alt image purposes
    //     fileType = 'xls';
    //     return xls;
    // }
  };

  const downloadFile = (e?: KeyboardEvent) => {
    if (e?.key && e.key !== 'Enter') {
      return;
    }
    return;
  };

  const fileImage: string = fileTypeImage();

  const DownloadButton = () => (
    <div role="button" tabIndex={0} className={center} onClick={() => downloadFile()} onKeyDown={e => downloadFile(e)}>
      <FontAwesomeIcon icon={faCloudArrowDown} />
      <div className={downloadButtonName}>Download</div>
    </div>
  );

  return (
    <tr className={fileDescription} data-testid="file-download-row">
      {!mobileView && (
        <>
          <td>
            <div className={downloadFileContainer}>
              <img src={fileImage} alt={` icon`} />
              <div className={downloadName}>
                <span className={startName}>{displayName.start}</span>
                <span>{displayName.end}</span>
              </div>
            </div>
          </td>
          <td>{date}</td>
          <td>2KB</td>
          <td className={downloadIcon}>
            <DownloadButton />
          </td>
        </>
      )}
      {mobileView && (
        <td>
          <div className={downloadFileContainer}>
            <img src={fileImage} alt={` icon`} />
            <div className={downloadItem}>
              <div className={downloadName}>
                <div className={startName}>{displayName.start}</div>
                <div>{displayName.end}</div>
              </div>
              <div className={downloadInfo}>
                <div className={fileDate}>{date}</div>
                <div>2KB</div>
              </div>
            </div>
            <div className={downloadIcon}>
              <DownloadButton />
            </div>
          </div>
        </td>
      )}
    </tr>
  );
};

export default DownloadReportTableRow;
