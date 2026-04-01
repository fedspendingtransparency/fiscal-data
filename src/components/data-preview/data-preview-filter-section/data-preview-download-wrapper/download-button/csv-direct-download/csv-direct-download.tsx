import React, { FunctionComponent } from 'react';
import { timestampDownloadButton, downloadItemBtn } from '../download-button.module.scss';

const CsvDirectDownload: FunctionComponent = ({ filename, downloadData, handleClick, downloadTimestamp, children }) => {
  const formatCsvWithCRLF = (data: any[][]): string => {
    return data.map(row => row.map(field => `"${(field ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\r\n');
  };

  const downloadWithCRLF = (data: any[][]) => {
    const csv = formatCsvWithCRLF(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const captureTimestampAndDownload = () => {
    const currentDate = new Date();
    const formattedTimestamp = `Report Run: ${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate
      .getDate()
      .toString()
      .padStart(2, '0')}${currentDate
      .getHours()
      .toString()
      .padStart(2, '0')}${currentDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const newDownloadData = structuredClone(downloadData);
    newDownloadData[0].push(formattedTimestamp);
    handleClick?.();
    downloadWithCRLF(newDownloadData);
  };

  const handleNonTimestampDownload = () => {
    handleClick?.();
    downloadWithCRLF(downloadData);
  };

  return downloadTimestamp ? (
    <button data-testid="csv-timestamp-download-button" onClick={captureTimestampAndDownload} className={timestampDownloadButton}>
      {children}
    </button>
  ) : (
    <button data-testid="csv-download-button" onClick={handleNonTimestampDownload} className={downloadItemBtn}>
      {children}
    </button>
  );
};

export default CsvDirectDownload;
