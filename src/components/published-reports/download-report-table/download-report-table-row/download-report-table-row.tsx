import React, { FunctionComponent, KeyboardEvent } from 'react';
import { fileDescription, downloadIcon, center, downloadName } from './download-report-table-row.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
import pdf from '../../../../../static/images/file-type-icons/file_type_pdf_icon.svg';
import xls from '../../../../../static/images/file-type-icons/file_type_xls_icon.svg';

const DownloadReportTableRow: FunctionComponent<{ fileName: string }> = ({ fileName }) => {
  const fileTypeImage = () => {
    switch (fileName) {
      case 'pdf':
        console.log('filename: ', fileName);
        console.log('pdf: ', pdf);
        return pdf;
      default:
        return xls;
    }
  };

  const downloadFile = (e?: KeyboardEvent) => {
    if (e?.key && e.key !== 'Enter') {
      return;
    }
    console.log('I clicked download!');
    return;
  };

  const fileImage: string = fileTypeImage();

  return (
    <tr className={fileDescription}>
      <td>
        <div className={downloadName}>
          <img src={fileImage} alt="file type icon" />
          <div>Entire.pdf</div>
        </div>
      </td>
      <td>February 01, 2024</td>
      <td>2KB</td>
      <td className={downloadIcon}>
        <div role="button" tabIndex={0} className={center} onClick={() => downloadFile()} onKeyDown={e => downloadFile(e)}>
          <FontAwesomeIcon icon={faCloudArrowDown} />
          <div>Download</div>
        </div>
      </td>
    </tr>
  );
};

export default DownloadReportTableRow;
