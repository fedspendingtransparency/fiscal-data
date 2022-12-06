import {faFileDownload} from "@fortawesome/free-solid-svg-icons/faFileDownload";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {downloadContainer, downloadIcon, downloadButton} from "./insights-download.module.scss";
import React from "react";

type InsightsDownloadProps = {
  downloadLink: string,
  dataDate: string
}



const InsightsDownload = ({downloadLink, dataDate}: InsightsDownloadProps): JSX.Element => {

    const fileName = downloadLink.split('/').pop();

    const getFile = (downloadLink) => {
      fetch(downloadLink, {
        method: 'GET',
        headers: {
          'Content-Type': 'text/csv'
        },
      })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(
          new Blob([blob]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          fileName,
        );

        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

      })
    }

    return (
      <div className={downloadContainer} data-testid={'insights-download'}>
        <button onClick={() => getFile(downloadLink)} className={downloadButton} data-testid={'download-button'}>
          <div className={downloadIcon}>
            <FontAwesomeIcon icon={faFileDownload} title={'download'} />
          </div>
          Download the data (.csv) as of {dataDate}
        </button>
      </div>
  )
}

export default InsightsDownload;
