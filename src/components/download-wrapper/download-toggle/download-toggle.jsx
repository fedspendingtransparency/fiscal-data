import React, { useEffect, useState } from 'react';
import { buttonGroup, radio, toggleButton, selected, disabled, disabledBorderRight } from './download-toggle.module.scss';

const DownloadToggle = ({ onChange, downloadLimit, dateRange, setDisableDownloadBanner, selectedFileType, setSelectedFileType }) => {
  const [disableCSV, setDisableCSV] = useState();
  const [disableJSON, setDisableJSON] = useState();
  const [disableXML, setDisableXML] = useState();

  const disableDownload = fileType => {
    if (downloadLimit && dateRange) {
      const range = dateRange.to.getTime() - dateRange.from.getTime();
      const rangeInDays = Math.round(range / (1000 * 3600 * 24));
      const maxDays = downloadLimit.maxYearRange * 365 + 1;
      return fileType === downloadLimit.fileType && rangeInDays > maxDays;
    }
  };

  const changeState = value => {
    setSelectedFileType(value);
    onChange(value);
  };

  useEffect(() => {
    const csvDisabled = disableDownload('csv');
    const jsonDisabled = disableDownload('json');
    const xmlDisabled = disableDownload('xml');
    if (xmlDisabled && selectedFileType === 'xml') {
      setSelectedFileType('csv');
    } else if (jsonDisabled && selectedFileType === 'json') {
      setSelectedFileType('csv');
    } else if (csvDisabled && selectedFileType === 'csv') {
      setSelectedFileType('json');
    }
    setDisableCSV(csvDisabled);
    setDisableJSON(jsonDisabled);
    setDisableXML(xmlDisabled);
    setDisableDownloadBanner(csvDisabled || jsonDisabled || xmlDisabled);
  }, [dateRange]);

  return (
    <div className={buttonGroup} data-toggle="buttons">
      <input
        type="radio"
        checked={selectedFileType === 'csv' ? 'checked' : ''}
        className={radio}
        value="csv"
        id="csv"
        name="downloadToggle"
        disabled={disableCSV}
        onChange={() => changeState('csv')}
      />
      <label className={`${toggleButton} ${selectedFileType === 'csv' ? selected : ''} ${disableCSV ? disabled : ''}`} htmlFor="csv">
        CSV
      </label>
      <input
        type="radio"
        checked={selectedFileType === 'json' ? 'checked' : ''}
        className={radio}
        value="json"
        id="json"
        name="downloadToggle"
        disabled={disableJSON}
        onChange={() => changeState('json')}
      />
      <label
        className={`${toggleButton} ${selectedFileType === 'json' ? selected : ''} ${disableJSON ? disabled : ''} ${
          disableXML ? disabledBorderRight : ''
        }`}
        htmlFor="json"
      >
        JSON
      </label>
      <input
        type="radio"
        checked={selectedFileType === 'xml' ? 'checked' : ''}
        className={radio}
        value="xml"
        id="xml"
        name="downloadToggle"
        disabled={disableXML}
        onChange={() => changeState('xml')}
      />
      <label className={`${toggleButton} ${selectedFileType === 'xml' ? selected : ''} ${disableXML ? disabled : ''}`} htmlFor="xml">
        XML
      </label>
    </div>
  );
};

export default DownloadToggle;
