import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv/lib';
import { timestampDownloadButton, downloadItemBtn } from '../download-button.module.scss';

const CsvDirectDownload: FunctionComponent = ({ filename, downloadData, handleClick, downloadTimestamp, children }) => {
  const [csvDataWithTimestamp, setCSVDataWithTimestamp] = useState(null);
  const ref = useRef();
  const captureTimestamp = () => {
    const currentDate = new Date();
    const formattedTimestamp = `Report Run: ${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate
      .getDate()
      .toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}${currentDate
      .getHours()
      .toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}${currentDate
      .getMinutes()
      .toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`;
    const newDownloadData = structuredClone(downloadData);
    newDownloadData[0].push(formattedTimestamp);
    setCSVDataWithTimestamp(newDownloadData);
  };

  useEffect(() => {
    if (csvDataWithTimestamp) {
      ref.current.link.click();
    }
  }, [csvDataWithTimestamp]);

  return (
    <>
      {downloadTimestamp && (
        <button data-testid="csv-timestamp-download-button" onClick={() => captureTimestamp()} className={timestampDownloadButton}>
          {children}
        </button>
      )}
      <CSVLink
        data-testid="csv-download-button"
        className={downloadTimestamp ? null : downloadItemBtn}
        data={csvDataWithTimestamp ? csvDataWithTimestamp : downloadData}
        filename={filename + '.csv'}
        onClick={handleClick}
        ref={ref}
        aria-hidden={true}
        enclosingCharacter=""
        tabIndex={downloadTimestamp ? -1 : 0}
      >
        {!downloadTimestamp && children}
      </CSVLink>
    </>
  );
};

export default CsvDirectDownload;
