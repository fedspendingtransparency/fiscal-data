import React, { FunctionComponent } from 'react';
import { fileDescription, downloadIcon, center, downloadName } from './download-report-table-row.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCloudArrowDown}  from '@fortawesome/free-solid-svg-icons';
import { pdf } from '../../../../../static/images/file-type-icons/file_type_pdf_icon.svg';

const DownloadReportTableRow = ({fileName}) => {
  fileName = 'pdf';

  const fileTypeImage = (): {} => {
    switch (fileName) {
      case 'pdf':
        console.log('filename: ', fileName);
        console.log('pdf: ', pdf);
        return pdf;
    }
  };


  return (
    <tr className={fileDescription}>
      <td>
        <div className={downloadName}>
          <img src={fileTypeImage()} alt="file type icon"/>
          <div>Entire.pdf</div>
        </div>
      </td>
      <td>February 01, 2024</td>
      <td>2KB</td>
      <td className={downloadIcon}>
        <div className={center}>
          <FontAwesomeIcon icon={faCloudArrowDown}/>
          <div>Download</div>
        </div>
      </td>
    </tr>
  )
}

export default DownloadReportTableRow;
